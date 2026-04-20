"""
Tavily Search + OpenAI로 테슬라/전기차/자동차 분야 인기 이슈 조사
- Tavily로 실시간 검색 → OpenAI로 JSON 포맷
"""
from __future__ import annotations

import json
from urllib import request
from urllib.error import HTTPError
from datetime import date


CATEGORIES = [
    "테슬라",
    "전기차",
    "보조금",
    "충전",
    "비교",
    "구매가이드",
    "자동차",
]

CATEGORY_STR = " | ".join(CATEGORIES)

# 카테고리별 검색 쿼리 — 다양한 주제가 검색 결과에 포함되도록
_SEARCH_QUERY_POOL = [
    "테슬라 한국 최신 뉴스 이슈",
    "현대 아이오닉 기아 EV 전기차 한국 최신",
    "전기차 보조금 충전 인프라 한국 정책 최신",
    "수입 전기차 BMW iX 벤츠 EQ 폭스바겐 ID 한국",
    "전기차 자동차 구매 시장 동향 한국 최신",
]


class TavilyResearcher:
    TAVILY_URL = "https://api.tavily.com/search"
    OPENAI_URL = "https://api.openai.com/v1/chat/completions"

    def __init__(self, tavily_api_key: str, openai_api_key: str, openai_model: str = "gpt-4o-mini") -> None:
        self.tavily_api_key = tavily_api_key
        self.openai_api_key = openai_api_key
        self.openai_model = openai_model

    def _tavily_search(self, query: str) -> dict:
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "search_depth": "basic",
            "include_answer": True,
            "max_results": 5,
        }
        raw_body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.TAVILY_URL,
            data=raw_body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"Tavily HTTP {e.code}: {body}") from e

    def research_today(
        self,
        published_topics: list[str] | None = None,
        recent_categories: list[str] | None = None,
    ) -> dict:
        """
        오늘의 전기차/자동차 인기 이슈 1개 선정 + 심층 리서치
        published_topics: 이미 발행된 제목 목록 (중복 회피용)
        recent_categories: 최근 발행된 카테고리 목록 (카테고리 편중 방지용)
        Returns: { topic, category, background, key_data, impact_on_buyers, related_keywords }
        """
        today = date.today().strftime("%Y년 %m월 %d일")

        # 중복 주제 제외 블록
        exclude_block = ""
        if published_topics:
            titles = "\n".join(f"- {t}" for t in published_topics)
            exclude_block = (
                "\n\n【이미 발행된 주제 — 반드시 제외】\n"
                f"{titles}\n"
                "위 주제와 동일하거나 매우 유사한 주제는 선택하지 마세요. "
                "카테고리가 같더라도 다른 각도나 세부 주제를 선택해야 합니다."
            )

        # 카테고리 편중 방지 블록
        avoid_block = ""
        if recent_categories:
            from collections import Counter
            counts = Counter(recent_categories)
            # 최근 5건 중 3건 이상 차지한 카테고리는 이번에 피하도록 유도
            overused = [cat for cat, cnt in counts.items() if cnt >= 3]
            if overused:
                avoid_block = (
                    "\n\n【카테고리 균형 지침】\n"
                    f"최근 발행된 카테고리: {', '.join(recent_categories)}\n"
                    f"아래 카테고리가 과도하게 반복됐습니다: {', '.join(overused)}\n"
                    "이번에는 반드시 다른 카테고리(전기차·보조금·충전·비교·구매가이드·자동차 중)에서 주제를 선정하세요."
                )

        # Step 1: Tavily 실시간 검색 — 날짜 기반으로 쿼리 풀 순환
        day_of_year = date.today().timetuple().tm_yday
        base_query = _SEARCH_QUERY_POOL[day_of_year % len(_SEARCH_QUERY_POOL)]
        query = f"{base_query} {today}"
        search_results = self._tavily_search(query)
        answer = search_results.get("answer", "")
        snippets = "\n".join(
            f"- [{r['title']}]({r['url']}): {r['content'][:300]}"
            for r in search_results.get("results", [])
        )
        context = f"[검색 요약]\n{answer}\n\n[주요 기사]\n{snippets}"

        # Step 2: OpenAI로 JSON 포맷
        payload = {
            "model": self.openai_model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "당신은 대한민국 자동차·전기차 분야 전문 리서처입니다. "
                        "주어진 검색 결과를 분석하여 정확한 JSON 형식으로 응답합니다."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"오늘({today}) 아래 검색 결과를 바탕으로 이슈 1개를 선정하고, "
                        "아래 형식의 JSON으로만 응답하세요. JSON 외 다른 텍스트는 출력하지 마세요.\n\n"
                        "【주제 선정 원칙】\n"
                        "- 테슬라, 전기차(현대 아이오닉·기아 EV·BMW iX·벤츠 EQ 등), 보조금, 충전, 구매가이드, 자동차 시장 전반을 균형 있게 다룬다.\n"
                        "- 특정 브랜드(테슬라 포함)가 연속으로 선정되지 않도록 다양한 카테고리를 순환하여 선택한다.\n"
                        "- 검색 결과에 테슬라 기사가 많더라도, 다른 카테고리의 의미 있는 이슈가 있다면 그것을 우선 선택할 수 있다.\n\n"
                        f"[검색 결과]\n{context}\n\n"
                        "{\n"
                        '  "topic": "이슈 제목 (한국어, 50자 이내)",\n'
                        f'  "category": "{CATEGORY_STR} 중 1개",\n'
                        '  "background": "이슈 배경 설명 (200자 이상, 왜 지금 화제인지, 관련 정책·수치 포함)",\n'
                        '  "key_data": [\n'
                        '    {"fact": "구체적 수치나 스펙·정책 내용", "source": "출처 기관명 또는 발표처, 연도"},\n'
                        '    ...\n'
                        '  ],\n'
                        '  "impact_on_buyers": "소비자/구매자에게 미치는 실질적 영향 (200자 이상)",\n'
                        '  "related_keywords": ["키워드1", "키워드2", "키워드3"],\n'
                        '  "sources": [\n'
                        '    {"name": "출처명", "url": "https://..."},\n'
                        '    ...\n'
                        '  ]\n'
                        "}\n\n"
                        "요구사항:\n"
                        "- key_data는 최소 3개 이상 (수치 또는 공식 발표 내용 필수)\n"
                        "- 추측이나 불확실한 내용 금지"
                        f"{avoid_block}"
                        f"{exclude_block}"
                    ),
                },
            ],
            "max_completion_tokens": 2000,
            "temperature": 0.4,
        }

        raw_body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.OPENAI_URL,
            data=raw_body,
            headers={
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                content = data["choices"][0]["message"]["content"].strip()
                if content.startswith("```"):
                    content = content.split("```")[1]
                    if content.startswith("json"):
                        content = content[4:]
                return json.loads(content.strip())
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"OpenAI HTTP {e.code}: {body}") from e
