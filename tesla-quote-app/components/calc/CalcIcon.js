/**
 * 계산기 아이콘 세트 — 선(stroke) 기반 인라인 SVG.
 *
 * 이미지 대신 인라인으로 두는 이유: 크기가 작아 래스터 이미지는 흐려지고,
 * currentColor를 상속받아야 그룹별 강조색을 그대로 따라가기 때문이다.
 * 키는 계산기 href를 그대로 쓴다 (lib/calculators.js와 1:1).
 */

const PATHS = {
  // 살 때 드는 돈
  "/": (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10.5h18" />
      <path d="M7.5 15.5h3" />
    </>
  ),
  "/calc/monthly-real-cost": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 9.5h18M6.5 14.5h4" />
    </>
  ),
  "/calc/compare": (
    <>
      <path d="M12 4v16M5 8h14" />
      <path d="M5 8l-2.5 5.5a3 3 0 005 0L5 8zM19 8l-2.5 5.5a3 3 0 005 0L19 8z" />
      <path d="M8.5 20h7" />
    </>
  ),
  // 타면서 드는 돈
  "/calc/tco": (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
      <path d="M5 6.5v5c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-5" />
      <path d="M5 11.5v5c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-5" />
    </>
  ),
  "/calc/maintenance": (
    <>
      <path d="M14.7 6.3a3.7 3.7 0 004.9 4.9l-8.4 8.4a2.2 2.2 0 01-3.1-3.1l8.4-8.4z" />
      <path d="M14.7 6.3l-1.9-1.9a3.7 3.7 0 00-1.5 6.2" />
    </>
  ),
  "/calc/switch-to-tesla": (
    <>
      <path d="M4 8.5h13l-3-3M20 15.5H7l3 3" />
    </>
  ),
  // 충전 환경
  "/calc/charging": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 9.5h7M8.5 12.5h7M10 8l2 4 2-4M12 12v4" />
    </>
  ),
  "/calc/charging-time": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  "/calc/charger-install": (
    <>
      <path d="M4 20V10.5L11 5l7 5.5V20" />
      <path d="M9 20v-4.5h4V20" />
      <path d="M18.5 13.5h2.5M19.75 13.5v3a2 2 0 01-2 2" />
    </>
  ),
  "/calc/ev-purchase-readiness": (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
      <path d="M9 4.5V3.2h6v1.3" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

/** 그룹 대표 글리프 — 일러스트 이미지가 없을 때 쓰는 대체 그림 */
const GROUP_PATHS = {
  purchase: (
    <>
      <path d="M3 5h2.2l2.3 10.5h10L20 8H6.2" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  running: (
    <>
      <path d="M4 15.5l1.8-5A2.5 2.5 0 018.2 9h7.6a2.5 2.5 0 012.4 1.5l1.8 5" />
      <path d="M3 15.5h18v3H3zM6.5 18.5v1.3M17.5 18.5v1.3" />
    </>
  ),
  charging: (
    <>
      <rect x="6" y="3.5" width="9" height="17" rx="2.5" />
      <path d="M10.8 8l-1.3 3h3l-1.3 3" />
      <path d="M15 9h3.5v6.5a1.8 1.8 0 01-3.5 0" />
    </>
  ),
};

/**
 * @param {{ name: string, className?: string, group?: boolean }} props
 *   name  - 계산기 href (group=true면 그룹 id)
 *   group - 그룹 대표 글리프를 그릴지 여부
 */
export default function CalcIcon({ name, className = "h-5 w-5", group = false }) {
  const d = group ? GROUP_PATHS[name] : PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
