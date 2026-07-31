import Link from "next/link";
import { CALCULATOR_GROUPS, calculatorsByGroup, CALCULATORS } from "@/lib/calculators";
import CalcIcon from "@/components/calc/CalcIcon";

/**
 * 홈 계산기 허브 섹션.
 * 홈은 대표 계산기(실구매가) 페이지이므로, 여기서 나머지 계산기로 흐르는 동선을 만든다.
 */

/**
 * 그룹별 시각 스타일.
 *
 * lib/calculators.js가 아니라 이 파일에 두는 이유: Tailwind content 글롭이
 * app/·components/만 훑기 때문에 lib/에 적은 클래스명은 빌드에서 제거된다.
 *
 * illustration: public/ 기준 경로. 값을 넣으면 <img>로 그리고,
 * null이면 아래 그라데이션 원 + 글리프로 대체한다.
 * (고해상도 일러스트를 public/calc-purchase.png 식으로 넣고 경로만 채우면 된다.
 *  권장 규격: 정사각 512×512 PNG, 배경 투명)
 */
const GROUP_STYLE = {
  purchase: {
    index: "01",
    wash: "from-blue-100/80 via-blue-50/50 to-white",
    orb: "from-blue-100 to-white",
    glyph: "text-blue-500",
    num: "text-blue-400",
    chip: "bg-blue-50 text-blue-600",
    rowHover: "hover:border-blue-200 hover:bg-blue-50/40",
    illustration: null,
  },
  running: {
    index: "02",
    wash: "from-emerald-100/80 via-emerald-50/50 to-white",
    orb: "from-emerald-100 to-white",
    glyph: "text-emerald-500",
    num: "text-emerald-400",
    chip: "bg-emerald-50 text-emerald-600",
    rowHover: "hover:border-emerald-200 hover:bg-emerald-50/40",
    illustration: null,
  },
  charging: {
    index: "03",
    wash: "from-violet-100/80 via-violet-50/50 to-white",
    orb: "from-violet-100 to-white",
    glyph: "text-violet-500",
    num: "text-violet-400",
    chip: "bg-violet-50 text-violet-600",
    rowHover: "hover:border-violet-200 hover:bg-violet-50/40",
    illustration: null,
  },
};

/** 카드 상단 워시와 본문 사이를 잇는 완만한 곡선 */
function WaveDivider() {
  return (
    <svg
      viewBox="0 0 400 44"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-8 w-full text-white"
      aria-hidden="true"
    >
      <path
        d="M0 26C64 6 128 40 200 28c72-12 128 8 200-6v22H0V26z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HomeCalcLinks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            계산기 {CALCULATORS.length}종
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
            실구매가 다음에 확인해야 할 숫자들
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            차값만으로는 판단이 끝나지 않습니다. 매달 나가는 돈, 몇 년 뒤까지의 총비용, 충전
            환경까지 각각 계산해보세요.
          </p>
        </div>
        <Link
          href="/calc"
          className="shrink-0 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
        >
          전체 보기
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {CALCULATOR_GROUPS.map((group) => {
          const s = GROUP_STYLE[group.id];
          const items = calculatorsByGroup(group.id).filter((c) => c.href !== "/");

          return (
            <article
              key={group.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_-16px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_60px_-24px_rgba(15,23,42,0.28)]"
            >
              {/* 상단 워시 + 일러스트 */}
              <div
                className={`relative h-[150px] bg-gradient-to-b ${s.wash} md:h-[168px]`}
              >
                <span
                  className={`absolute left-6 top-5 text-sm font-black tabular-nums tracking-tight ${s.num}`}
                >
                  {s.index}
                </span>

                <div className="absolute right-5 top-1/2 h-[104px] w-[104px] -translate-y-[58%] md:right-6 md:h-[116px] md:w-[116px]">
                  {s.illustration ? (
                    <img
                      src={s.illustration}
                      alt=""
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${s.orb} shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-300 group-hover:scale-105`}
                    >
                      <CalcIcon
                        name={group.id}
                        group
                        className={`h-11 w-11 ${s.glyph}`}
                      />
                    </div>
                  )}
                </div>

                <WaveDivider />
              </div>

              {/* 본문 */}
              <div className="flex flex-1 flex-col px-6 pb-6 md:px-7 md:pb-7">
                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{group.desc}</p>

                <div className="my-5 h-px bg-slate-100" />

                <ul className="space-y-2">
                  {items.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className={`group/row flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3 py-2.5 transition ${s.rowHover}`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.chip}`}
                        >
                          <CalcIcon name={c.href} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="flex-1 text-sm font-bold text-slate-800">
                          {c.shortLabel}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 shrink-0 text-slate-300 transition group-hover/row:translate-x-0.5 group-hover/row:text-slate-500"
                          aria-hidden="true"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
