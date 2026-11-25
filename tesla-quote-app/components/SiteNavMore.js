"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/AppLink";

const DOT_CLASS = {
  hot: "bg-gradient-to-r from-[#ff8a5b] to-[#e2456f]",
  warm: "bg-gradient-to-r from-[#8ea0f0] to-[#b59cf2]",
  base: "bg-gray-300",
};

// SiteNav 오른쪽 '전체 메뉴' 드롭다운. 한 줄에 다 보이지 않는 메뉴를 분류별로 모아 보여준다.
export default function SiteNavMore({ groups, basis }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-nav-more"
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400"
      >
        전체 메뉴
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div
          id="site-nav-more"
          className="absolute right-0 top-full z-40 mt-2 w-[560px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-5 shadow-xl shadow-slate-900/10"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {groups.map((group) => (
              <div key={group.name}>
                <p className="text-[11px] font-semibold text-gray-400">{group.name}</p>
                <ul className="mt-2 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[item.tier]}`} aria-hidden="true" />
                        {item.label}
                        {item.tier !== "base" ? (
                          <span className="ml-auto text-[11px] font-semibold text-gray-400">{item.rank + 1}위</span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-gray-100 pt-3 text-[11px] text-gray-400">
            순위와 색은 {basis} 횟수를 쌓아 정합니다. 많이 찾을수록 순위가 오르고 색이 진해집니다.
          </p>
        </div>
      ) : null}
    </div>
  );
}
