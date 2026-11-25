"""
상단 '많이 찾는 메뉴'(components/SiteNav.js) 인기 순위용 데이터 생성기.

Search Console 페이지별 검색 클릭 수를 조회해 data/nav-popularity.json 에 저장한다.
SiteNav 는 빌드 시 이 파일을 읽어 메뉴 순서와 색 단계(상위 3개 / 다음 4개 / 나머지)를 정한다.
사이트 안 클릭 수가 아니라 "검색에서 사람들이 많이 찾아 들어온 페이지" 기준이다.

Usage (tesla-quote-app 폴더에서):
  python -m scripts.analytics.nav_popularity            # 최근 90일
  python -m scripts.analytics.nav_popularity --days 60
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

APP_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APP_ROOT))

from scripts.analytics.gsc_daily_insight import GSCInsight, load_gsc_settings  # noqa: E402

OUT_FILE = APP_ROOT / "data" / "nav-popularity.json"
_DATA_LAG_DAYS = 3  # GSC 데이터 확정 지연


def main() -> None:
    parser = argparse.ArgumentParser(description="SiteNav 인기 순위 데이터 생성")
    parser.add_argument("--days", type=int, default=90)
    args = parser.parse_args()

    settings = load_gsc_settings()
    insight = GSCInsight(
        site_url=settings["site_url"],
        client_secret_path=settings["client_secret_path"],
        token_path=settings["token_path"],
    )
    previous = json.loads(OUT_FILE.read_text(encoding="utf-8")) if OUT_FILE.exists() else {}

    end = date.today() - timedelta(days=_DATA_LAG_DAYS)
    # Vercel Web Analytics 수집 시작일(analyticsStart) 이후는 Vercel 방문 수가 담당한다.
    # 검색 클릭 1건 = 방문 1건이라 기간이 겹치면 이중 집계되므로 GSC 는 그 전날까지만 센다.
    analytics_start = previous.get("analyticsStart")
    if analytics_start:
        end = min(end, date.fromisoformat(analytics_start) - timedelta(days=1))
    start = end - timedelta(days=args.days - 1)
    rows = insight._query(["page"], start, end)
    if not rows:
        raise SystemExit("[NAV] GSC 응답이 비어 있어 기존 파일을 유지합니다.")

    clicks: dict[str, int] = {}
    for row in rows:
        path = urlparse(row["keys"][0]).path.rstrip("/") or "/"
        clicks[path] = clicks.get(path, 0) + int(row["clicks"])

    payload = {
        "source": "Google Search Console 페이지별 검색 클릭",
        "window": {"start": start.isoformat(), "end": end.isoformat(), "days": args.days},
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "clicks": dict(sorted(clicks.items(), key=lambda kv: (-kv[1], kv[0]))),
    }
    # Vercel 쪽 필드(수집 시작일, 방문 수)는 Vercel MCP 로 따로 채운다 — 덮어쓰지 않고 유지.
    for key in ("analyticsStart", "pageviews"):
        if key in previous:
            payload[key] = previous[key]
    OUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[NAV] {start} ~ {end} ({args.days}d), pages {len(clicks)} -> {OUT_FILE}")


if __name__ == "__main__":
    main()
