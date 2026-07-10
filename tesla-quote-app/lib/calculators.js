/**
 * 계산기 레지스트리 — 네비게이션, 사이트맵, 상호 내부링크에 공용 사용.
 * "테슬라 구매 의사결정 계산 플랫폼"의 핵심 동선을 한 곳에서 관리한다.
 */
export const CALCULATORS = [
  {
    href: "/",
    label: "실구매가·월납입금 계산기",
    shortLabel: "실구매가·월납입금",
    desc: "지역별 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다.",
  },
  {
    href: "/",
    label: "테슬라 보조금 계산기",
    shortLabel: "테슬라 보조금",
    desc: "2026년 Model 3·Model Y 국고·지자체 보조금을 지역별로 적용해 실구매가·월납입금을 계산합니다.",
  },
  {
    href: "/calc/maintenance",
    label: "유지비 계산기",
    shortLabel: "유지비",
    desc: "충전비·보험료·자동차세로 월·연·5년 유지비를 계산합니다.",
  },
  {
    href: "/calc/charging",
    label: "충전비 계산기",
    shortLabel: "충전비",
    desc: "주행거리·전비·급속/완속 비율로 월·연 충전비를 계산합니다.",
  },
  {
    href: "/calc/tco",
    label: "총소유비용(TCO) 계산기",
    shortLabel: "총소유비용",
    desc: "감가상각·운영비를 합산한 총소유비용과 내연기관 대비 차이를 계산합니다.",
  },
  {
    href: "/calc/compare",
    label: "모델 비교 계산기",
    shortLabel: "모델 비교",
    desc: "Model 3와 Model Y의 실구매가·월납입금·유지비·5년 총비용을 비교합니다.",
  },
  {
    href: "/calc/monthly-real-cost",
    label: "월 실제 부담금 계산기",
    shortLabel: "월 실제 부담",
    desc: "할부금에 충전비·보험료·자동차세를 합산한 월 실제 지출액을 계산합니다.",
  },
  {
    href: "/calc/switch-to-tesla",
    label: "내연기관→테슬라 전환 비교 계산기",
    shortLabel: "전환 비교",
    desc: "현재 차량 월 비용 vs 테슬라 전환 후 비용을 비교해 월 절감액을 확인합니다.",
  },
  {
    href: "/calc/ev-purchase-readiness",
    label: "구매 준비도 체크",
    shortLabel: "구매 준비도",
    desc: "충전 환경·주행거리·예산 등 5가지 항목으로 전기차 구매 적합도를 점수화합니다.",
  },
];

/** 현재 경로를 제외한 나머지 계산기 목록 (관련 계산기 섹션용) */
export function relatedCalculators(currentHref) {
  return CALCULATORS.filter((c) => c.href !== currentHref);
}
