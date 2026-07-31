import Link from "next/link";
import { CALCULATOR_GROUPS, calculatorsByGroup, CALCULATORS } from "@/lib/calculators";

/**
 * 홈 계산기 허브 섹션.
 * 홈은 대표 계산기(실구매가) 페이지이므로, 여기서 나머지 계산기로 흐르는 동선을 만든다.
 */
export default function HomeCalcLinks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            계산기 {CALCULATORS.length}종
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            실구매가 다음에 확인해야 할 숫자들
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            차값만으로는 판단이 끝나지 않습니다. 매달 나가는 돈, 몇 년 뒤까지의 총비용, 충전
            환경까지 각각 계산해보세요.
          </p>
        </div>
        <Link
          href="/calc"
          className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
        >
          전체 보기
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CALCULATOR_GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.05)]"
          >
            <h3 className="text-base font-black tracking-tight text-slate-950">{group.title}</h3>
            <p className="mt-1.5 text-xs leading-6 text-slate-500">{group.desc}</p>
            <ul className="mt-4 space-y-1.5">
              {calculatorsByGroup(group.id)
                .filter((c) => c.href !== "/")
                .map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                    >
                      <span>{c.shortLabel}</span>
                      <span className="text-slate-300 transition group-hover:text-blue-500">→</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
