import Link from "next/link";

/**
 * 홈 히어로 — 좌측 카피 / 우측 실데이터 프리뷰 카드의 2단 구조.
 *
 * 우측 카드는 목업이 아니라 latest.csv 스냅샷에서 계산한 실제 값이다.
 * "같은 차인데 지역에 따라 실구매가가 달라진다"는 이 사이트의 존재 이유를
 * 스크롤 없이 숫자로 먼저 보여주는 것이 목적이다.
 */

function Arrow({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const man = (won) => `${Math.round(won / 10000).toLocaleString()}만원`;

export default function HomeHero({ preview }) {
  return (
    <section className="border-b border-tesla-line bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-8 md:py-20">
        {/* ── 좌: 카피 ── */}
        <div>
          <span className="inline-flex rounded-md bg-tesla-blueSoft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-tesla-blue">
            지역별 보조금 자동 반영
          </span>

          <h1 className="mt-5 text-[34px] font-black leading-[1.12] tracking-tight text-tesla-ink md:text-[52px]">
            테슬라, 내 지역에선
            <br />
            실제로 얼마인가.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-tesla-ink70 md:text-base">
            국고보조금과 지자체 보조금은 같은 차라도 사는 곳에 따라 달라집니다. 하우머치 테슬라는
            공개 데이터를 그대로 적용해 실구매가·월납입금·유지비까지 한 번에 계산합니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/subsidy"
              className="inline-flex items-center gap-2 rounded-md bg-tesla-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-tesla-blue"
            >
              보조금 확인하기
              <Arrow />
            </Link>
            <Link
              href="/answers"
              className="inline-flex items-center gap-2 rounded-md border border-tesla-line bg-white px-6 py-3.5 text-sm font-bold text-tesla-ink transition hover:border-tesla-ink"
            >
              구매 질문 30 보기
            </Link>
          </div>

          <p className="mt-6 text-[11px] leading-5 text-slate-400">
            무공해차 통합누리집 공개 데이터 기준 · 데이터 기준일 {preview.dataDate}
          </p>
        </div>

        {/* ── 우: 실데이터 프리뷰 ── */}
        <div className="rounded-2xl border border-tesla-line bg-tesla-mist/60 p-4 md:p-6">
          <div className="rounded-xl border border-tesla-line bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              같은 차, 다른 지역
            </p>
            <p className="mt-2 text-base font-black text-tesla-ink">{preview.trimLabel}</p>
            <p className="text-xs text-slate-500">차량 가격 {man(preview.price)}</p>

            {/* 최대 보조금 지역 */}
            <div className="mt-5 rounded-xl border border-tesla-blue/30 bg-tesla-blueSoft p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-tesla-ink">{preview.best.name}</span>
                <span className="rounded-full bg-tesla-blue px-2 py-0.5 text-[10px] font-bold text-white">
                  보조금 최대
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-500">보조금</p>
                  <p className="text-sm font-black text-tesla-blue">
                    {preview.best.subsidyManwon.toLocaleString()}만원
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">실구매가</p>
                  <p className="text-sm font-black text-tesla-ink">{man(preview.best.netPrice)}</p>
                </div>
              </div>
            </div>

            {/* 다른 지역 */}
            <p className="mt-5 text-[11px] font-bold text-slate-400">다른 지역</p>
            <ul className="mt-2 divide-y divide-tesla-line">
              {preview.others.map((r) => (
                <li key={r.name} className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-semibold text-tesla-ink">{r.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      보조금 {r.subsidyManwon.toLocaleString()}만원
                    </span>
                    <span className="text-xs font-bold text-tesla-ink70">{man(r.netPrice)}</span>
                  </span>
                </li>
              ))}
            </ul>

            {preview.spreadManwon > 0 ? (
              <p className="mt-4 rounded-lg bg-tesla-mist px-3 py-2.5 text-[11px] leading-5 text-tesla-ink70">
                동일 트림인데 지역 간 실구매가 차이가{" "}
                <b className="text-tesla-ink">{preview.spreadManwon.toLocaleString()}만원</b>{" "}
                납니다. 내 지역 값은 계산기에서 바로 확인하세요.
              </p>
            ) : null}
          </div>

          <Link
            href="/subsidy"
            className="mt-4 flex items-center justify-between rounded-xl bg-tesla-ink px-4 py-3.5 text-sm font-bold text-white transition hover:bg-tesla-blue"
          >
            내 지역으로 계산하기
            <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
