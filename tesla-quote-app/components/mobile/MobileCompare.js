"use client";

/**
 * 모바일 전용 차량 비교 UI.
 *
 * 데스크톱 비교 모드는 QuoteCard 두 장을 좌우로 놓고 각각 견적 요약을 붙인다.
 * 같은 마크업이 모바일에서는 세로로 쌓이면서 A와 B가 화면 하나에 같이 보이지 않아
 * '비교'가 성립하지 않는다. 모바일은 (1) 네이티브 셀렉트 기반 압축 선택기와
 * (2) 항목별 좌우 대조표라는 별도 컴포넌트로 분리한다.
 */

/** 자동차 가격은 '만원' 단위로 읽는 것이 좁은 화면에서 훨씬 빠르다 */
function manwon(value) {
  const v = Math.round(Number(value || 0) / 10000);
  return `${v.toLocaleString("ko-KR")}만원`;
}

function manwonSigned(value) {
  const v = Math.round(Number(value || 0) / 10000);
  if (v === 0) return "0원";
  return `${v > 0 ? "+" : "−"}${Math.abs(v).toLocaleString("ko-KR")}만원`;
}

/* ── 1. 압축 선택기 ───────────────────────────────────────── */

export function MobileCompareSelector({
  modelCatalog,
  modelIdA,
  trimIdA,
  onModelChangeA,
  onTrimChangeA,
  modelIdB,
  trimIdB,
  onModelChangeB,
  onTrimChangeB,
}) {
  const rows = [
    {
      key: "A",
      badge: "A",
      badgeClass: "bg-slate-900 text-white",
      modelId: modelIdA,
      trimId: trimIdA,
      onModelChange: onModelChangeA,
      onTrimChange: onTrimChangeA,
    },
    {
      key: "B",
      badge: "B",
      badgeClass: "bg-brandRed text-white",
      modelId: modelIdB,
      trimId: trimIdB,
      onModelChange: onModelChangeB,
      onTrimChange: onTrimChangeB,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:hidden">
      <h3 className="mb-3 text-base font-bold">비교할 차량 선택</h3>
      <div className="space-y-3">
        {rows.map((row) => {
          const model =
            modelCatalog.find((m) => m.id === row.modelId) || modelCatalog[0];
          const trim =
            model.trims.find((t) => t.id === row.trimId) || model.trims[0];

          return (
            <div key={row.key} className="rounded-xl bg-gray-50 p-3">
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${row.badgeClass}`}
                >
                  {row.badge}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {trim.displayName ?? model.name}
                </span>
                <span className="ml-auto text-sm font-extrabold text-slate-900">
                  {manwon(trim.price)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="sr-only">{row.badge} 모델 선택</span>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-medium"
                    value={row.modelId}
                    onChange={(e) => {
                      const next = modelCatalog.find((m) => m.id === e.target.value);
                      row.onModelChange(e.target.value);
                      if (next) row.onTrimChange(next.trims[0].id);
                    }}
                  >
                    {modelCatalog.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="sr-only">{row.badge} 트림 선택</span>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-medium"
                    value={row.trimId}
                    onChange={(e) => row.onTrimChange(e.target.value)}
                  >
                    {model.trims.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── 2. 좌우 대조 결과표 ──────────────────────────────────── */

export function MobileCompareResult({ nameA, nameB, quoteA, quoteB, comparison }) {
  if (!quoteA || !quoteB) return null;

  const rows = [
    { label: "차량가", a: quoteA.basePrice, b: quoteB.basePrice },
    { label: "보조금", a: -quoteA.subsidyWon, b: -quoteB.subsidyWon, good: true },
    { label: "추가 혜택", a: -quoteA.extraBenefitWon, b: -quoteB.extraBenefitWon, good: true },
    { label: "실구매가", a: quoteA.estimatedPrice, b: quoteB.estimatedPrice, strong: true },
  ];

  const monthlyA = Math.round(quoteA.monthly);
  const monthlyB = Math.round(quoteB.monthly);
  const monthlyDiff = monthlyB - monthlyA;

  return (
    <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl md:hidden">
      {/* 헤더 — 두 차량 이름 */}
      <div className="grid grid-cols-[76px_1fr_1fr] items-end gap-2 border-b border-white/10 px-3 py-3">
        <span className="text-[10px] font-medium text-gray-500">항목</span>
        <span className="text-center text-[11px] font-bold leading-tight text-white">
          <span className="mb-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/15 text-[9px]">
            A
          </span>
          <span className="block break-keep">{nameA}</span>
        </span>
        <span className="text-center text-[11px] font-bold leading-tight text-white">
          <span className="mb-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brandRed text-[9px]">
            B
          </span>
          <span className="block break-keep">{nameB}</span>
        </span>
      </div>

      {/* 항목별 대조 */}
      <div className="divide-y divide-white/5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[76px_1fr_1fr] items-center gap-2 px-3 py-3"
          >
            <span
              className={`text-[11px] ${row.strong ? "font-bold text-white" : "text-gray-400"}`}
            >
              {row.label}
            </span>
            {[row.a, row.b].map((value, i) => (
              <span
                key={i}
                className={`text-center tabular-nums ${
                  row.strong
                    ? "text-sm font-black"
                    : row.good
                      ? "text-xs font-semibold text-green-400"
                      : "text-xs font-medium text-gray-200"
                }`}
              >
                {row.good ? manwonSigned(value) : manwon(value)}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 월 납입금 — 가장 중요한 비교 지표라 별도 강조 */}
      <div className="grid grid-cols-[76px_1fr_1fr] items-center gap-2 bg-white/5 px-3 py-4">
        <span className="text-[11px] font-bold">월 납입금</span>
        <span className="text-center text-base font-black tabular-nums text-brandRed">
          {monthlyA.toLocaleString("ko-KR")}
          <span className="text-[10px] font-medium">원</span>
        </span>
        <span className="text-center text-base font-black tabular-nums text-brandRed">
          {monthlyB.toLocaleString("ko-KR")}
          <span className="text-[10px] font-medium">원</span>
        </span>
      </div>

      {/* 결론 한 줄 */}
      <div className="border-t border-white/10 px-3 py-3.5 text-center">
        {monthlyDiff === 0 ? (
          <p className="text-xs text-gray-400">두 차량의 월 납입금이 같습니다.</p>
        ) : (
          <p className="text-xs leading-relaxed text-gray-300">
            <strong className="font-bold text-white">
              {monthlyDiff > 0 ? nameB : nameA}
            </strong>
            가 월{" "}
            <strong className="font-black text-brandRed">
              {Math.abs(monthlyDiff).toLocaleString("ko-KR")}원
            </strong>{" "}
            더 나갑니다
            {comparison ? (
              <span className="mt-1 block text-[11px] text-gray-500">
                실구매가 차이 {manwon(Math.abs(comparison.priceDiff))}
              </span>
            ) : null}
          </p>
        )}
      </div>
    </section>
  );
}
