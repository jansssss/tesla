"use client";

import { useState, useEffect } from "react";

export default function GuideToc({ sections }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const headings = document.querySelectorAll("article h2[data-idx]");
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.idx));
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!sections || sections.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-[20px] border border-slate-100 bg-slate-50 p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          목차
        </p>
        <ol className="space-y-1">
          {sections.map((sec, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  document
                    .querySelector(`h2[data-idx="${i}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition ${
                  active === i
                    ? "bg-white font-bold text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className={`mt-0.5 shrink-0 text-[10px] font-black tabular-nums ${active === i ? "text-blue-500" : "text-slate-300"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-snug">{sec.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
