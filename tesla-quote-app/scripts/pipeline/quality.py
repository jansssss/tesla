"""자동 생성 가이드가 공개 파일에 들어가기 전 적용하는 보수적 품질 게이트."""
from __future__ import annotations

import re
from urllib.parse import urlparse

from .writer import Guide


OFFICIAL_HOSTS = {
    "tesla.com", "www.tesla.com",
    "ev.or.kr", "www.ev.or.kr",
    "me.go.kr", "www.me.go.kr",
    "molit.go.kr", "www.molit.go.kr",
    "fss.or.kr", "www.fss.or.kr", "finlife.fss.or.kr",
    "nts.go.kr", "www.nts.go.kr",
    "car365.go.kr", "www.car365.go.kr",
    "law.go.kr", "www.law.go.kr",
}

HYPE_RE = re.compile(r"완벽\s*가이드|완전\s*정리|충격|대박|무조건|반드시\s*(유리|승인|구매)")
FIRST_PERSON_RE = re.compile(r"제가\s*(직접|타보|구매)|저는\s*(직접|구매|운전)|솔직히\s*말하면")
EMOJI_RE = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF]")


def _text(guide: Guide) -> str:
    chunks = [guide.title, guide.description, *guide.key_points]
    chunks.extend(str(value) for value in guide.reader_need.values())
    for section in guide.sections:
        chunks.extend([section.title, *section.paragraphs, *(section.bullets or [])])
        if section.callout:
            chunks.append(section.callout)
        if section.table:
            chunks.extend(section.table.get("headers", []))
            chunks.extend(cell for row in section.table.get("rows", []) for cell in row)
    return " ".join(chunks)


def validate_guide(guide: Guide) -> list[str]:
    """문제가 없으면 빈 배열을 반환한다. 하나라도 있으면 발행하지 않는다."""
    issues: list[str] = []
    text = _text(guide)
    compact = re.sub(r"\s+", "", text)
    paragraph_count = sum(len(section.paragraphs) for section in guide.sections)
    bullet_count = sum(len(section.bullets or []) for section in guide.sections)
    table_count = sum(1 for section in guide.sections if section.table and section.table.get("rows"))

    if not 18 <= len(guide.title) <= 70:
        issues.append("제목은 18~70자로 작성")
    if not 70 <= len(guide.description) <= 180:
        issues.append("설명은 70~180자로 작성")
    if len(guide.key_points) < 3:
        issues.append("핵심 요약 3개 이상")
    if len(guide.sections) < 5:
        issues.append("본문 섹션 5개 이상")
    if paragraph_count < 10:
        issues.append("완결된 설명 문단 10개 이상")
    if bullet_count < 5:
        issues.append("실행 체크리스트 5개 이상")
    if table_count < 1:
        issues.append("조건 비교표 1개 이상")
    if len(compact) < 2200:
        issues.append("실질 본문 2,200자 이상")
    if len(guide.sources) < 2:
        issues.append("공식 출처 2개 이상")

    required_need = ("question", "stage", "needLevel", "intent")
    if any(not guide.reader_need.get(key) for key in required_need):
        issues.append("readerNeed에 질문·확인시점·결정영향·대상독자 포함")
    if len(guide.related_slugs) != 3:
        issues.append("관련 대표 글 slug 3개 포함")

    for source in guide.sources:
        host = urlparse(source.get("url", "")).hostname or ""
        if host not in OFFICIAL_HOSTS:
            issues.append(f"공식 도메인이 아닌 출처 제거: {host or source.get('url', '')}")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", source.get("accessedAt", "")):
            issues.append("모든 출처에 YYYY-MM-DD 확인일 표기")

    if HYPE_RE.search(text):
        issues.append("과장·단정 표현 제거")
    if FIRST_PERSON_RE.search(text):
        issues.append("검증되지 않은 1인칭 경험 표현 제거")
    if EMOJI_RE.search(text):
        issues.append("이모티콘·장식용 기호 제거")

    return list(dict.fromkeys(issues))
