/**
 * 계산기 레지스트리 — 네비게이션, /calc 인덱스, 사이트맵, 상호 내부링크에 공용 사용.
 * "테슬라 구매 의사결정 계산 플랫폼"의 핵심 동선을 한 곳에서 관리한다.
 *
 * group: /calc 인덱스에서 묶어 보여주는 분류
 *   - purchase: 살 때의 비용
 *   - running:  타면서 드는 비용
 *   - charging: 충전 환경·인프라
 */
export const CALCULATORS = [
  {
    href: "/subsidy",
    group: "purchase",
    label: "테슬라 보조금·실구매가 계산기",
    shortLabel: "실구매가·월납입금",
    desc: "지역별 국고·지자체 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다.",
  },
  {
    href: "/calc/monthly-real-cost",
    group: "purchase",
    label: "월 실제 부담금 계산기",
    shortLabel: "월 실제 부담",
    desc: "할부금에 충전비·보험료·자동차세를 합산한 월 실제 지출액을 계산합니다.",
  },
  {
    href: "/calc/compare",
    group: "purchase",
    label: "모델 비교 계산기",
    shortLabel: "모델 비교",
    desc: "Model 3와 Model Y의 실구매가·월납입금·유지비·5년 총비용을 비교합니다.",
  },
  {
    href: "/calc/tco",
    group: "running",
    label: "총소유비용(TCO) 계산기",
    shortLabel: "총소유비용",
    desc: "감가상각·운영비를 합산한 총소유비용과 내연기관 대비 차이를 계산합니다.",
  },
  {
    href: "/calc/maintenance",
    group: "running",
    label: "유지비 계산기",
    shortLabel: "유지비",
    desc: "충전비·보험료·자동차세로 월·연·5년 유지비를 계산합니다.",
  },
  {
    href: "/calc/switch-to-tesla",
    group: "running",
    label: "내연기관→테슬라 전환 비교 계산기",
    shortLabel: "전환 비교",
    desc: "현재 차량 월 비용 vs 테슬라 전환 후 비용을 비교해 월 절감액을 확인합니다.",
  },
  {
    href: "/calc/charging",
    group: "charging",
    label: "충전비 계산기",
    shortLabel: "충전비",
    desc: "주행거리·전비·급속/완속 비율로 월·연 충전비를 계산합니다.",
  },
  {
    href: "/calc/charging-time",
    group: "charging",
    label: "충전 시간 계산기",
    shortLabel: "충전 시간",
    desc: "충전기 출력과 배터리 용량으로 완속·급속·슈퍼차저 충전 소요 시간을 계산합니다.",
  },
  {
    href: "/calc/charger-install",
    group: "charging",
    label: "충전기 설치 비용 계산기",
    shortLabel: "충전기 설치",
    desc: "홈 충전기 설치 시 월 충전비 절감액과 설치비 회수 기간을 계산합니다.",
  },
  {
    href: "/calc/ev-purchase-readiness",
    group: "charging",
    label: "구매 준비도 체크",
    shortLabel: "구매 준비도",
    desc: "충전 환경·주행거리·예산 등 5가지 항목으로 전기차 구매 적합도를 점수화합니다.",
  },
];

/** /calc 인덱스에서 사용하는 그룹 정의 */
export const CALCULATOR_GROUPS = [
  {
    id: "purchase",
    title: "살 때 드는 돈",
    desc: "보조금을 적용한 실구매가부터 매달 나가는 부담금까지, 구매 시점의 숫자를 잡습니다.",
  },
  {
    id: "running",
    title: "타면서 드는 돈",
    desc: "유지비와 감가상각을 합쳐 보유 기간 전체의 비용을 봅니다. 지금 타는 차와의 비교도 여기서 합니다.",
  },
  {
    id: "charging",
    title: "충전 환경",
    desc: "전기차 만족도를 가장 크게 좌우하는 영역입니다. 충전비·충전 시간·설치 손익을 확인합니다.",
  },
];

/** 그룹 id로 계산기 목록 조회 */
export function calculatorsByGroup(groupId) {
  return CALCULATORS.filter((c) => c.group === groupId);
}

/** 현재 경로를 제외한 나머지 계산기 목록 (관련 계산기 섹션용) */
export function relatedCalculators(currentHref) {
  return CALCULATORS.filter((c) => c.href !== currentHref);
}
