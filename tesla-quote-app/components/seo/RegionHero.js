export default function RegionHero({ metro, stats }) {
  const m3rwd = stats.statsByModel.find((s) => s.trimId === "m3-rwd");
  const myRwd = stats.statsByModel.find((s) => s.trimId === "my-rwd");

  return (
    <section className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] text-white py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* 뱃지 */}
        <div className="mb-4">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            지역별 보조금
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-2xl md:text-4xl font-black mb-3 leading-tight tracking-tight">
          2026 {metro.name}<br className="md:hidden" />
          <span className="md:ml-2">테슬라 보조금·실구매가 계산</span>
        </h1>

        <p className="text-blue-100/70 text-sm md:text-base mb-10">
          국고보조금 + {metro.shortName} 지방보조금 합산 최신 데이터 기준
          {metro.type === "do" && " · 시/군/구별 보조금이 다를 수 있습니다"}
        </p>

        {/* 핵심 숫자 3개 */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label={`Model 3 RWD 최대 보조금`}
            value={`${m3rwd?.max ?? 0}만원`}
            sub={metro.type === "do" ? `최소 ${m3rwd?.min ?? 0}만원` : null}
          />
          <StatCard
            label={`Model Y RWD 최대 보조금`}
            value={`${myRwd?.max ?? 0}만원`}
            sub={metro.type === "do" ? `최소 ${myRwd?.min ?? 0}만원` : null}
          />
          <StatCard
            label={metro.type === "si" ? "지원 모델 수" : "지원 시/군/구"}
            value={metro.type === "si" ? `5종` : `${stats.districts.length}개`}
            sub={null}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 md:p-5">
      <p className="text-blue-200/80 text-xs mb-1.5 leading-snug">{label}</p>
      <p className="text-lg md:text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-blue-300/60 text-xs mt-1">{sub}</p>}
    </div>
  );
}
