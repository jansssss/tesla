"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CALCULATOR_GROUPS, calculatorsByGroup } from "@/lib/calculators";

/* 색인 유지 대상(광역시·특별시)만 노출 — do 단위 지역은 noindex 처리되어 있다 */
const REGIONS = [
  { label: "서울", href: "/subsidy/seoul" },
  { label: "부산", href: "/subsidy/busan" },
  { label: "인천", href: "/subsidy/incheon" },
  { label: "대구", href: "/subsidy/daegu" },
  { label: "대전", href: "/subsidy/daejeon" },
  { label: "광주", href: "/subsidy/gwangju" },
  { label: "울산", href: "/subsidy/ulsan" },
  { label: "세종", href: "/subsidy/sejong" },
  { label: "제주", href: "/subsidy/jeju" },
];

const MODELS = [
  { label: "Model 3", href: "/models/model-3" },
  { label: "Model Y", href: "/models/model-y" },
  { label: "Model Y L", href: "/models/model-y-l" },
];

const COMPARISONS = [
  { label: "Model 3 vs Model Y", href: "/compare/model-3-vs-model-y" },
  { label: "RWD vs AWD", href: "/compare/rwd-vs-awd" },
];

const SITE_LINKS = [
  { label: "가이드", href: "/guides" },
  { label: "사이트 소개", href: "/about" },
  { label: "데이터 출처", href: "/data-sources" },
  { label: "콘텐츠 정책", href: "/editorial-policy" },
  { label: "문의하기", href: "/contact" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
];

/**
 * 모바일 전용 전체 메뉴 시트.
 * 데스크톱의 상단 pill 네비(SiteNav)를 대체한다 — 좁은 화면에서 링크 20여 개를
 * 한 줄에 밀어 넣는 대신, 하단에서 올라오는 시트에 그룹으로 펼친다.
 */
export default function MobileMenuSheet({ open, onClose }) {
  /* 시트가 열린 동안 배경 스크롤 잠금 + ESC 닫기 */
  useEffect(() => {
    if (!open) return;

    document.body.classList.add("sheet-open");
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("sheet-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden" aria-hidden={!open}>
      {/* 딤 배경 */}
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 시트 본체.
          닫힌 상태에 invisible을 함께 주는 이유: translate만으로 화면 밖에 두면
          내부 링크가 여전히 Tab 포커스를 받아 aria-hidden과 충돌한다. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        className={`fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
          open ? "visible translate-y-0" : "invisible pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "calc(1.25rem + var(--safe-b))" }}
      >
        {/* 손잡이 + 닫기 */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 pb-3 pt-3 backdrop-blur">
          <span className="text-sm font-black tracking-tight text-slate-950">전체 메뉴</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-slate-400 active:bg-slate-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 px-5 pt-5">
          {CALCULATOR_GROUPS.map((group) => (
            <MenuGroup key={group.id} title={group.title}>
              {calculatorsByGroup(group.id).map((c) => (
                <MenuRow key={c.href} href={c.href} onClose={onClose}>
                  {c.shortLabel}
                </MenuRow>
              ))}
            </MenuGroup>
          ))}

          <MenuGroup title="지역별 보조금">
            <div className="col-span-2 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  onClick={onClose}
                  className="inline-flex min-h-[40px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 active:bg-slate-100"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </MenuGroup>

          <MenuGroup title="모델 · 비교">
            {[...MODELS, ...COMPARISONS].map((m) => (
              <MenuRow key={m.href} href={m.href} onClose={onClose}>
                {m.label}
              </MenuRow>
            ))}
          </MenuGroup>

          <MenuGroup title="사이트 정보">
            {SITE_LINKS.map((s) => (
              <MenuRow key={s.href} href={s.href} onClose={onClose}>
                {s.label}
              </MenuRow>
            ))}
          </MenuGroup>
        </div>
      </div>
    </div>
  );
}

function MenuGroup({ title, children }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </section>
  );
}

function MenuRow({ href, children, onClose }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold leading-snug text-slate-700 active:bg-slate-50"
    >
      {children}
    </Link>
  );
}
