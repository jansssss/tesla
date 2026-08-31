"""paytesla GSC 개선 루프의 지속 상태.

에이전트가 만든 변경을 반증 가능한 결정으로 기록하고, 배포 후 일정 기간 같은
페이지와 검색어를 동결한 뒤 실제 GSC 수치로 채점한다. 이 파일의 목적은
관찰->변경으로 끝나는 오픈 루프를 관찰->결정->검증->학습 루프로 닫는 것이다.
"""
from __future__ import annotations

import json
import re
import subprocess
from datetime import date, datetime, timedelta
from pathlib import Path


SCHEDULE: dict[str, dict[str, int]] = {
    "D": {"freeze": 24, "first": 24, "final": 42},
    "C": {"freeze": 28, "first": 28, "final": 56},
    "B": {"freeze": 42, "first": 42, "final": 70},
    "A": {"freeze": 42, "first": 42, "final": 84},
    "O": {"freeze": 0, "first": 24, "final": 24},
}

AFTER_WINDOW_LAG_DAYS = 7
MIN_AFTER_WINDOW_DAYS = 14
MIN_IMPRESSIONS_AFTER = 30
MIN_IMPRESSIONS_BEFORE = 10
POSITION_MOVE_THRESHOLD = 3.0
MIN_IMPRESSIONS_FOR_CTR = 200
MAX_OPEN_EXPERIMENTS = 3
MAX_NEW_DECISIONS_PER_RUN = 1
MAX_EXTENSIONS = 1
EXTENSION_DAYS = 28
STALE_DEPLOY_DAYS = 3

STATUS_PENDING = "pending_deploy"
STATUS_OBSERVING = "observing"
STATUS_DUE = "verdict_due"
STATUS_CLOSED = "closed"


def state_dir(project_root: Path) -> Path:
    target = project_root / "reports" / "gsc" / "state"
    target.mkdir(parents=True, exist_ok=True)
    (target / "decisions").mkdir(exist_ok=True)
    (target / "observations").mkdir(exist_ok=True)
    return target


def decisions_dir(project_root: Path) -> Path:
    return state_dir(project_root) / "decisions"


def _parse_date(value) -> date | None:
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.strptime(str(value)[:10], "%Y-%m-%d").date()
    except ValueError:
        return None


def load_decisions(project_root: Path) -> list[dict]:
    decisions: list[dict] = []
    for path in sorted(decisions_dir(project_root).glob("*.json")):
        try:
            item = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            print(f"[STATE] 결정 파일 읽기 실패 {path.name}: {exc}", flush=True)
            continue
        item["_path"] = str(path)
        decisions.append(item)
    return decisions


def save_decision(project_root: Path, decision: dict) -> Path:
    item = dict(decision)
    item.pop("_path", None)
    path = decisions_dir(project_root) / f"{item['id']}.json"
    path.write_text(json.dumps(item, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def new_decision_id(created: date, slug: str) -> str:
    normalized = re.sub(r"[^a-z0-9가-힣]+", "-", slug.lower()).strip("-")[:48]
    return f"{created.isoformat()}-{normalized or 'decision'}"


def _git(project_root: Path, *args: str) -> str:
    repo_root = project_root.parent if (project_root.parent / ".git").exists() else project_root
    try:
        result = subprocess.run(
            ["git", "-C", str(repo_root), *args],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=30,
        )
    except (OSError, subprocess.SubprocessError):
        return ""
    return result.stdout.strip() if result.returncode == 0 else ""


def _apply_schedule(decision: dict) -> None:
    deployed = _parse_date(decision.get("deployed_at"))
    if not deployed:
        return
    schedule = SCHEDULE.get(str(decision.get("grade", "C")).upper(), SCHEDULE["C"])
    decision["freeze_until"] = (deployed + timedelta(days=schedule["freeze"])).isoformat()
    decision["evaluate_at"] = (deployed + timedelta(days=schedule["first"])).isoformat()
    decision["final_evaluate_at"] = (deployed + timedelta(days=schedule["final"])).isoformat()
    if decision.get("status") in (None, STATUS_PENDING):
        decision["status"] = STATUS_OBSERVING


def backfill_deployed_at(project_root: Path, decisions: list[dict]) -> list[dict]:
    """결정 대상 파일이 처음 커밋된 날짜를 실제 배포 시작일로 사용한다."""
    changed: list[dict] = []
    for decision in decisions:
        if decision.get("deployed_at") or decision.get("status") == STATUS_CLOSED:
            continue
        files = decision.get("files") or []
        if not files:
            decision["deployed_at"] = decision.get("created")
            _apply_schedule(decision)
            changed.append(decision)
            continue
        created = _parse_date(decision.get("created"))
        args = ["log", "--reverse", "--format=%cI", "--max-count=1"]
        if created:
            args.append(f"--since={(created - timedelta(days=1)).isoformat()}")
        args.extend(["--", *files])
        output = _git(project_root, *args)
        if not output:
            continue
        decision["deployed_at"] = output.splitlines()[0].strip()[:10]
        _apply_schedule(decision)
        changed.append(decision)
    return changed


def refresh_statuses(decisions: list[dict], today: date | None = None) -> None:
    today = today or date.today()
    for decision in decisions:
        if decision.get("status") != STATUS_OBSERVING:
            continue
        due = _parse_date(decision.get("evaluate_at"))
        if due and today >= due:
            decision["status"] = STATUS_DUE


def due_decisions(decisions: list[dict], today: date | None = None) -> list[dict]:
    refresh_statuses(decisions, today)
    return [item for item in decisions if item.get("status") == STATUS_DUE]


def open_experiments(decisions: list[dict]) -> list[dict]:
    return [
        item
        for item in decisions
        if item.get("status") in (STATUS_PENDING, STATUS_OBSERVING, STATUS_DUE)
    ]


def stale_pending(decisions: list[dict], today: date | None = None) -> list[dict]:
    today = today or date.today()
    result: list[dict] = []
    for item in decisions:
        if item.get("status") != STATUS_PENDING or item.get("deployed_at"):
            continue
        created = _parse_date(item.get("created"))
        if created and (today - created).days >= STALE_DEPLOY_DAYS:
            result.append(item)
    return result


def frozen_targets(decisions: list[dict], today: date | None = None) -> dict:
    today = today or date.today()
    pages: dict[str, str] = {}
    queries: dict[str, str] = {}
    owners: list[dict] = []
    for item in decisions:
        if item.get("status") == STATUS_CLOSED:
            continue
        until = _parse_date(item.get("freeze_until"))
        if item.get("status") != STATUS_PENDING and (not until or today >= until):
            continue
        label = item.get("freeze_until") or "배포대기"
        targets = item.get("targets") or {}
        for page in targets.get("pages") or []:
            pages[page] = label
        for query in targets.get("queries") or []:
            queries[query] = label
        for file_path in item.get("files") or []:
            pages.setdefault(file_path, label)
        owners.append({"id": item.get("id"), "until": label, "grade": item.get("grade")})
    return {"pages": pages, "queries": queries, "decisions": owners}


def can_open_new(decisions: list[dict]) -> tuple[bool, str]:
    count = len(open_experiments(decisions))
    if count >= MAX_OPEN_EXPERIMENTS:
        return False, f"열린 실험 {count}건 (상한 {MAX_OPEN_EXPERIMENTS}) — 신규 결정 금지"
    return True, f"열린 실험 {count}건 / 상한 {MAX_OPEN_EXPERIMENTS}"


def judge(
    before: dict,
    after: dict,
    site_before: dict,
    site_after: dict,
    predict: dict,
    days_before: int = 28,
    days_after: int = 28,
) -> dict:
    """대상 변화에서 사이트 전체 변화를 뺀 값으로 과거 예측을 채점한다."""
    imp_before = int(before.get("impressions", 0) or 0)
    imp_after = int(after.get("impressions", 0) or 0)
    before_days = max(1, int(days_before or 1))
    after_days = max(1, int(days_after or 1))
    result = {
        "impressions_before": imp_before,
        "impressions_after": imp_after,
        "days_before": before_days,
        "days_after": after_days,
        "impressions_per_day_before": round(imp_before / before_days, 2),
        "impressions_per_day_after": round(imp_after / after_days, 2),
        "position_before": round(float(before.get("position", 0) or 0), 1),
        "position_after": round(float(after.get("position", 0) or 0), 1),
        "clicks_before": int(before.get("clicks", 0) or 0),
        "clicks_after": int(after.get("clicks", 0) or 0),
    }
    if imp_after < MIN_IMPRESSIONS_AFTER or imp_before < MIN_IMPRESSIONS_BEFORE:
        result["verdict"] = "판정불가"
        result["reason"] = (
            f"표본 부족 (before {imp_before}/{MIN_IMPRESSIONS_BEFORE}, "
            f"after {imp_after}/{MIN_IMPRESSIONS_AFTER})"
        )
        result["weak_signal"] = (
            f"참고: 일평균 노출 {result['impressions_per_day_before']} -> "
            f"{result['impressions_per_day_after']}, 순위 "
            f"{result['position_before']} -> {result['position_after']}"
        )
        return result

    target_delta = result["position_after"] - result["position_before"]
    site_delta = float(site_after.get("position", 0) or 0) - float(
        site_before.get("position", 0) or 0
    )
    adjusted = target_delta - site_delta
    result.update(
        position_delta=round(target_delta, 1),
        site_position_delta=round(site_delta, 1),
        adjusted_delta=round(adjusted, 1),
    )
    if abs(adjusted) < POSITION_MOVE_THRESHOLD:
        result["verdict"] = "변화없음"
        result["reason"] = f"사이트 보정 후 {adjusted:+.1f}위 — 임계 {POSITION_MOVE_THRESHOLD}위 미만"
    else:
        improved = adjusted < 0
        want_down = str(predict.get("direction", "down")).lower() == "down"
        result["verdict"] = "적중" if improved == want_down else "빗나감"
        result["reason"] = (
            f"사이트 보정 후 {adjusted:+.1f}위 "
            f"(대상 {target_delta:+.1f} - 사이트 {site_delta:+.1f})"
        )

    if imp_after >= MIN_IMPRESSIONS_FOR_CTR:
        ctr_before = float(before.get("ctr", 0) or 0)
        ctr_after = float(after.get("ctr", 0) or 0)
        result.update(
            ctr_before=round(ctr_before, 4),
            ctr_after=round(ctr_after, 4),
            ctr_delta=round(ctr_after - ctr_before, 4),
        )
    else:
        result["ctr_note"] = f"노출 {imp_after} < {MIN_IMPRESSIONS_FOR_CTR} — CTR 판정 보류"
    return result


def extend(decision: dict, today: date | None = None) -> bool:
    today = today or date.today()
    used = int(decision.get("extensions", 0) or 0)
    if used >= MAX_EXTENSIONS:
        return False
    decision["extensions"] = used + 1
    decision["evaluate_at"] = (today + timedelta(days=EXTENSION_DAYS)).isoformat()
    decision["freeze_until"] = decision["evaluate_at"]
    decision["status"] = STATUS_OBSERVING
    return True


def close(decision: dict, verdict: str, note: str, today: date | None = None) -> None:
    today = today or date.today()
    decision.setdefault("verdicts", []).append(
        {"date": today.isoformat(), "verdict": verdict, "note": note}
    )
    decision["status"] = STATUS_CLOSED
    decision["closed_at"] = today.isoformat()
    decision["final_verdict"] = verdict
