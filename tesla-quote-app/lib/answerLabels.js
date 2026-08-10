/**
 * 답변 페이지 slug → 브레드크럼용 짧은 라벨.
 *
 * Breadcrumb는 클라이언트 컴포넌트라서 lib/answers(본문 전체)를 가져오면
 * 본문 텍스트가 통째로 클라이언트 번들에 실린다. 그래서 라벨만 따로 둔다.
 *
 * 누락 방지: __tests__/answers.test.js 가 모든 slug에 라벨이 있는지 검증한다.
 */
export const ANSWER_BREADCRUMB_LABELS = {
  "model-y-worth-buying": "모델Y 사도 될까",
  "model-y-vs-ioniq5": "모델Y vs 아이오닉5",
  "model-y-vs-ev6": "모델Y vs EV6",
  "tesla-insurance-cost": "보험료",
  "tesla-car-tax": "자동차세·취득세",
  "tesla-without-home-charger": "집밥 없이 전기차",
  "tesla-fast-charging-ccs": "급속충전·어댑터",
  "ev-charging-card": "충전카드",
  "model-y-real-range": "실제 주행거리",
  "tesla-winter-range": "겨울 주행거리",
  "tesla-seoul-to-busan": "서울–부산 장거리",
  "tesla-lfp-vs-ncm": "LFP vs NCM",
  "tesla-charge-80-or-100": "80% vs 100% 충전",
  "tesla-battery-degradation": "배터리 수명·열화",
  "tesla-battery-warranty": "배터리 보증",
  "tesla-phantom-drain": "팬텀 드레인",
  "tesla-maintenance-items": "정비·소모품",
  "tesla-tire-replacement": "타이어 교체",
  "tesla-repair-cost": "수리비",
  "ev-fire-underground-parking": "화재·지하주차장",
  "used-model-y-checklist": "중고 모델Y 체크",
  "tesla-fsd-korea": "FSD 한국",
};
