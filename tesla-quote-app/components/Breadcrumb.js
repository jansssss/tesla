"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS = {
  models:               "모델",
  "model-3":            "Model 3",
  "model-y":            "Model Y",
  compare:              "비교",
  "model-3-vs-model-y": "Model 3 vs Y",
  "rwd-vs-awd":         "RWD vs AWD",
  subsidy:              "지역 보조금",
  seoul:                "서울",
  gyeonggi:             "경기",
  incheon:              "인천",
  busan:                "부산",
  daejeon:              "대전",
  jeju:                 "제주",
  jeonnam:              "전남",
  guides:               "가이드",
  about:                "사이트 소개",
  contact:              "문의",
  privacy:              "개인정보처리방침",
  terms:                "이용약관",
  disclaimer:           "면책고지",
};

function slugToLabel(seg) {
  // YYYYMMDD- 날짜 접두사 제거
  const withoutDate = seg.replace(/^\d{8}-/, "");
  return withoutDate.replace(/-/g, " ");
}

export default function Breadcrumb({ lastLabel }) {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "홈", href: "/" }];

  segments.forEach((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label = isLast && lastLabel
      ? lastLabel
      : (LABELS[seg] ?? slugToLabel(seg));
    crumbs.push({ label, href, isLast });
  });

  return (
    <nav aria-label="breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-3 pb-1 md:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            {crumb.isLast ? (
              <span className="max-w-[200px] truncate font-medium text-slate-600 md:max-w-sm">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="transition hover:text-slate-700">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
