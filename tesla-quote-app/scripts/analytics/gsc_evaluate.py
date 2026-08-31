"""과거 GSC 결정의 효과를 실제 수치로 측정하는 판정 계층."""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from scripts.analytics import gsc_state as st
from scripts.analytics.gsc_daily_insight import (
    APP_ROOT,
    GSCInsight,
    _DATA_LAG_DAYS,
    load_gsc_settings,
    page_path_of,
    scan_site_routes,
)


EMPTY_METRICS = {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0}


def _parse_date(value) -> date | None:
    if not value:
        return None
    try:
        return datetime.strptime(str(value)[:10], "%Y-%m-%d").date()
    except ValueError:
        return None


def normalize_page_arg(value: str, known_routes: list[str] | None = None) -> str:
    normalized = (value or "").strip().replace("\\", "/")
    if "://" in normalized:
        normalized = urlparse(normalized).path or "/"
    if re.match(r"^[A-Za-z]:/", normalized) and known_routes:
        for route in sorted(known_routes, key=len, reverse=True):
            if route != "/" and normalized.endswith(route):
                return route
    if not normalized.startswith("/"):
        normalized = "/" + normalized
    return normalized.rstrip("/") or "/"


class Evaluator:
    def __init__(self, insight: GSCInsight) -> None:
        self.insight = insight

    def window(self, start: date, end: date) -> dict:
        queries = self.insight._agg(self.insight._query(["query"], start, end))
        page_rows = self.insight._agg(self.insight._query(["page"], start, end))
        pages: dict[str, dict] = {}
        for url, values in page_rows.items():
            path = page_path_of(url)
            slot = pages.setdefault(path, {"clicks": 0, "impressions": 0, "_weighted": 0.0})
            slot["clicks"] += values["clicks"]
            slot["impressions"] += values["impressions"]
            slot["_weighted"] += values["position"] * values["impressions"]
        for slot in pages.values():
            impressions = slot["impressions"]
            slot["ctr"] = slot["clicks"] / impressions if impressions else 0.0
            slot["position"] = slot["_weighted"] / impressions if impressions else 0.0
            slot.pop("_weighted")

        site = {"clicks": 0, "impressions": 0, "_weighted": 0.0}
        for values in page_rows.values():
            site["clicks"] += values["clicks"]
            site["impressions"] += values["impressions"]
            site["_weighted"] += values["position"] * values["impressions"]
        impressions = site["impressions"]
        site["ctr"] = site["clicks"] / impressions if impressions else 0.0
        site["position"] = site["_weighted"] / impressions if impressions else 0.0
        site.pop("_weighted")
        return {
            "start": start.isoformat(),
            "end": end.isoformat(),
            "days": (end - start).days + 1,
            "queries": queries,
            "pages": pages,
            "site": site,
        }


def _pick(window: dict, kind: str, keys: list[str]) -> dict:
    source = window.get(kind, {})
    result = {"clicks": 0, "impressions": 0, "_weighted": 0.0}
    for key in keys:
        values = source.get(key)
        if not values:
            continue
        result["clicks"] += values.get("clicks", 0)
        result["impressions"] += values.get("impressions", 0)
        result["_weighted"] += values.get("position", 0.0) * values.get("impressions", 0)
    impressions = result["impressions"]
    return {
        "clicks": result["clicks"],
        "impressions": impressions,
        "ctr": result["clicks"] / impressions if impressions else 0.0,
        "position": result["_weighted"] / impressions if impressions else 0.0,
    }


def after_window_for(decision: dict, data_end: date) -> tuple[date, date] | None:
    deployed = _parse_date(decision.get("deployed_at"))
    if not deployed:
        return None
    start = deployed + timedelta(days=st.AFTER_WINDOW_LAG_DAYS)
    if (data_end - start).days + 1 < st.MIN_AFTER_WINDOW_DAYS:
        return None
    return start, data_end


def evaluate(project_root: Path, insight: GSCInsight, today: date | None = None) -> dict:
    today = today or date.today()
    data_end = today - timedelta(days=_DATA_LAG_DAYS)
    decisions = st.load_decisions(project_root)
    for decision in st.backfill_deployed_at(project_root, decisions):
        st.save_decision(project_root, decision)
    due = st.due_decisions(decisions, today)
    evaluations: list[dict] = []
    cache: dict[tuple[str, str], dict] = {}
    evaluator = Evaluator(insight)

    def get_window(start: date, end: date) -> dict:
        key = (start.isoformat(), end.isoformat())
        if key not in cache:
            cache[key] = evaluator.window(start, end)
        return cache[key]

    for decision in due:
        after_dates = after_window_for(decision, data_end)
        if not after_dates:
            evaluations.append(
                {
                    "id": decision.get("id"),
                    "grade": decision.get("grade"),
                    "hypothesis": decision.get("hypothesis"),
                    "action": decision.get("action"),
                    "judgement": {
                        "verdict": "판정불가",
                        "reason": "배포 후 확정된 관찰 창이 아직 14일 미만",
                    },
                }
            )
            continue
        after_start, after_end = after_dates
        after = get_window(after_start, after_end)
        baseline = decision.get("baseline") or {}
        targets = decision.get("targets") or {}
        pages = targets.get("pages") or []
        queries = targets.get("queries") or []
        kind, keys = ("pages", pages) if pages else ("queries", queries)
        before = _pick(
            {"pages": baseline.get("pages") or {}, "queries": baseline.get("queries") or {}},
            kind,
            keys,
        )
        judgement = st.judge(
            before,
            _pick(after, kind, keys),
            baseline.get("site") or dict(EMPTY_METRICS),
            after["site"],
            decision.get("predict") or {},
            days_before=int(baseline.get("days") or baseline.get("window_days") or 28),
            days_after=after["days"],
        )
        final_date = _parse_date(decision.get("final_evaluate_at"))
        evaluations.append(
            {
                "id": decision.get("id"),
                "grade": decision.get("grade"),
                "hypothesis": decision.get("hypothesis"),
                "action": decision.get("action"),
                "predict": decision.get("predict"),
                "deployed_at": decision.get("deployed_at"),
                "target": {"kind": kind, "keys": keys},
                "after_window": {
                    "start": after_start.isoformat(),
                    "end": after_end.isoformat(),
                    "days": after["days"],
                },
                "extensions_used": int(decision.get("extensions", 0) or 0),
                "extension_available": int(decision.get("extensions", 0) or 0) < st.MAX_EXTENSIONS,
                "is_final": bool(final_date and today >= final_date),
                "judgement": judgement,
            }
        )

    can_open, quota_note = st.can_open_new(decisions)
    return {
        "generated_at": today.isoformat(),
        "data_end": data_end.isoformat(),
        "due_count": len(due),
        "evaluations": evaluations,
        "open_experiments": [
            {
                "id": item.get("id"),
                "grade": item.get("grade"),
                "status": item.get("status"),
                "deployed_at": item.get("deployed_at"),
                "evaluate_at": item.get("evaluate_at"),
            }
            for item in st.open_experiments(decisions)
        ],
        "frozen": st.frozen_targets(decisions, today),
        "stale_pending": [
            {"id": item.get("id"), "created": item.get("created"), "files": item.get("files")}
            for item in st.stale_pending(decisions, today)
        ],
        "can_open_new_decision": can_open,
        "quota_note": quota_note,
    }


def render(payload: dict) -> str:
    lines = [
        f"# 결정 판정 근거 ({payload['generated_at']})",
        "",
        f"- 데이터 확정일: {payload['data_end']}",
        f"- 판정 기일 도래: **{payload['due_count']}건**",
        f"- {payload['quota_note']}",
        "",
    ]
    if not payload["evaluations"]:
        lines.extend(["## 판정 대상 없음", "", "이번 회차에 판정 기일이 도래한 결정이 없습니다.", ""])
    else:
        lines.extend(["## 판정 대상", ""])
        for item in payload["evaluations"]:
            judgement = item["judgement"]
            lines.extend(
                [
                    f"### [{item.get('grade')}] {item['id']}",
                    f"- 가설: {item.get('hypothesis') or '-'}",
                    f"- 조치: {item.get('action') or '-'}",
                    f"- 판정: **{judgement.get('verdict')}** — {judgement.get('reason', '')}",
                    "",
                ]
            )
    frozen = payload.get("frozen") or {}
    if frozen.get("pages") or frozen.get("queries"):
        lines.extend(["## 동결 대상", ""])
        for page, until in sorted((frozen.get("pages") or {}).items()):
            lines.append(f"- `{page}` — {until}까지 수정 금지")
        for query, until in sorted((frozen.get("queries") or {}).items()):
            lines.append(f"- 검색어 `{query}` — {until}까지 수정 금지")
        lines.append("")
    return "\n".join(lines)


def build_status(project_root: Path, today: date | None = None) -> dict:
    today = today or date.today()
    decisions = st.load_decisions(project_root)
    for decision in st.backfill_deployed_at(project_root, decisions):
        st.save_decision(project_root, decision)
    due = st.due_decisions(decisions, today)
    can_open, note = st.can_open_new(decisions)
    marker = st.state_dir(project_root) / "last-tier2.txt"
    last = _parse_date(marker.read_text(encoding="utf-8").strip()) if marker.exists() else None
    return {
        "today": today.isoformat(),
        "due_count": len(due),
        "open_count": len(st.open_experiments(decisions)),
        "stale_pending_count": len(st.stale_pending(decisions, today)),
        "can_open_new_decision": can_open,
        "quota_note": note,
        "days_since_last_deep_run": (today - last).days if last else 999,
    }


def record_observation(project_root: Path, today: date | None = None) -> Path | None:
    today = today or date.today()
    latest = project_root / "reports" / "gsc" / "latest.json"
    if not latest.exists():
        print("[EVAL] latest.json 이 없어 관측 기록을 건너뜁니다", flush=True)
        return None
    report = json.loads(latest.read_text(encoding="utf-8"))
    summary = report.get("summary") or {}

    def trim(rows: list[dict] | None, keys: list[str], limit: int = 10) -> list[dict]:
        return [{key: row.get(key) for key in keys} for row in (rows or [])[:limit]]

    record = {
        "recorded_at": today.isoformat(),
        "generated_for": report.get("generated_for"),
        "window": report.get("window"),
        "summary": summary.get("current"),
        "delta_pct": summary.get("delta_pct"),
        "anomaly_flags": (report.get("anomaly") or {}).get("flags") or [],
        "top_queries": trim(
            report.get("top_queries"), ["query", "impressions", "clicks", "position", "intent"]
        ),
        "top_pages": trim(
            report.get("top_pages"), ["path", "impressions", "clicks", "position"]
        ),
        "intent_breakdown": trim(
            report.get("intent_breakdown"), ["intent", "impressions", "clicks", "queries"], 8
        ),
        "loop": {
            "verdict_due": (report.get("loop_state") or {}).get("verdict_due") or [],
            "open_experiments": [
                item.get("id")
                for item in ((report.get("loop_state") or {}).get("open_experiments") or [])
            ],
        },
    }
    path = st.state_dir(project_root) / "observations" / f"{report.get('generated_for') or today.isoformat()}.json"
    path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[EVAL] 관측 기록 저장: {path}", flush=True)
    return path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="paytesla GSC 결정 판정")
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--snapshot", action="store_true")
    parser.add_argument("--query", action="append", default=[])
    parser.add_argument("--page", action="append", default=[])
    parser.add_argument("--days", type=int, default=28)
    parser.add_argument("--mark-deep-run", action="store_true")
    parser.add_argument("--record-observation", action="store_true")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    today = date.today()
    if args.record_observation:
        return 0 if record_observation(APP_ROOT, today) else 1
    if args.mark_deep_run:
        (st.state_dir(APP_ROOT) / "last-tier2.txt").write_text(today.isoformat(), encoding="utf-8")
        print(f"[EVAL] 심층 실행 기록: {today.isoformat()}", flush=True)
        return 0
    if args.status:
        status = build_status(APP_ROOT, today)
        (st.state_dir(APP_ROOT) / "status.json").write_text(
            json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(json.dumps(status, ensure_ascii=False))
        return 0

    settings = load_gsc_settings()
    insight = GSCInsight(
        site_url=settings["site_url"],
        client_secret_path=settings["client_secret_path"],
        token_path=settings["token_path"],
    )
    if args.snapshot:
        end = today - timedelta(days=_DATA_LAG_DAYS)
        start = end - timedelta(days=args.days - 1)
        window = Evaluator(insight).window(start, end)
        pages = [normalize_page_arg(value, scan_site_routes(APP_ROOT)) for value in args.page]
        output = {
            "window_days": window["days"],
            "days": window["days"],
            "start": window["start"],
            "end": window["end"],
            "queries": {key: window["queries"].get(key, dict(EMPTY_METRICS)) for key in args.query},
            "pages": {key: window["pages"].get(key, dict(EMPTY_METRICS)) for key in pages},
            "site": window["site"],
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))
        return 0

    payload = evaluate(APP_ROOT, insight, today)
    state_path = st.state_dir(APP_ROOT)
    (state_path / "evaluation-input.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (state_path / "evaluation-input.md").write_text(render(payload), encoding="utf-8")
    print(
        f"[EVAL] 판정 대상 {payload['due_count']}건 / 열린 실험 {len(payload['open_experiments'])}건",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
