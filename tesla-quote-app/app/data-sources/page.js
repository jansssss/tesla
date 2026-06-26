import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";

export const metadata = {
  title: "데이터 출처 및 계산 기준",
  description:
    "테슬라 얼마? 사이트의 차량 가격·보조금·유지비 계산에 사용된 데이터 출처와 가정값, 업데이트 이력을 안내합니다.",
  alternates: { canonical: "https://paytesla.kr/data-sources" },
};

const SECTIONS = [
  {
    title: "차량 가격",
    rows: [
      { item: "출고가 기준", value: "테슬라 공식 홈페이지(tesla.com/ko_kr)" },
      { item: "데이터 기준일", value: CALC_DATA_DATE },
      { item: "포함 세금", value: "부가가치세(VAT) 포함 최종 소비자가" },
      { item: "옵션·색상 추가금", value: "미포함 — 기본 사양 기준" },
    ],
  },
  {
    title: "보조금",
    rows: [
      { item: "국고 보조금", value: "환경부 무공해차 통합누리집 고시 기준" },
      { item: "지방 보조금", value: "각 지자체 공고 기준 (17개 시·도)" },
      { item: "데이터 기준일", value: CALC_DATA_DATE },
      {
        item: "주의사항",
        value:
          "보조금은 예산 소진·정책 변경으로 시기에 따라 달라질 수 있습니다. 신청 전 해당 지자체에서 최신 금액을 반드시 확인하세요.",
      },
    ],
  },
  {
    title: "충전비 계산 기본 가정",
    rows: [
      {
        item: "완속 단가",
        value: `${CALC_DEFAULTS.slowPrice.toLocaleString("ko-KR")}원/kWh — 가정용·공용 완속 평균`,
      },
      {
        item: "급속 단가",
        value: `${CALC_DEFAULTS.fastPrice.toLocaleString("ko-KR")}원/kWh — 공공 급속 평균`,
      },
      {
        item: "전비",
        value: `${CALC_DEFAULTS.efficiency} km/kWh — Model 3·Y 평균 가정`,
      },
      {
        item: "출처",
        value: "한국전력공사 전기차 충전 요금표, 환경부 충전 인프라 정보 시스템 참고",
      },
    ],
  },
  {
    title: "보험료·자동차세 가정",
    rows: [
      {
        item: "연 보험료",
        value: `${(CALC_DEFAULTS.insurancePerYear / 10000).toLocaleString("ko-KR")}만원 — 30대 운전자 기준 가정`,
      },
      {
        item: "연 자동차세",
        value: `${CALC_DEFAULTS.taxPerYear.toLocaleString("ko-KR")}원 — 전기차 비영업용, 지방교육세 포함`,
      },
      {
        item: "주의사항",
        value:
          "보험료는 나이·사고이력·가입 담보에 따라 크게 다릅니다. 보험사 다이렉트 견적을 통해 실제 금액을 확인하세요.",
      },
    ],
  },
  {
    title: "총소유비용(TCO) 계산 기준",
    rows: [
      {
        item: "포함 항목",
        value: "감가상각(실구매가 − 잔존가치) + 보험료 + 충전비",
      },
      {
        item: "미포함 항목",
        value: "할부 이자(금융비용), 타이어·소모품, 주차비, 과태료 등",
      },
      {
        item: "잔존가치 계산",
        value: `연 ${CALC_DEFAULTS.depreciationRate}% 정률 감가상각 가정 (실제 시세와 다를 수 있음)`,
      },
      {
        item: "내연기관 비교 가정",
        value: `연비 ${CALC_DEFAULTS.ice.fuelEfficiency}km/L, 휘발유 ${CALC_DEFAULTS.ice.fuelPrice.toLocaleString("ko-KR")}원/L, 연 정비비 ${(CALC_DEFAULTS.ice.maintenancePerYear / 10000).toLocaleString("ko-KR")}만원`,
      },
    ],
  },
];

const UPDATE_LOG = [
  { date: "2026-06-17", content: "차량 가격·보조금 데이터 최신화" },
  { date: "2026-04-01", content: "Model Y L AWD 트림 추가" },
  { date: "2026-01-01", content: "2026년 보조금 기준 반영" },
];

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-10">
          <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            데이터 출처
          </span>
          <h1 className="mt-4 text-2xl md:text-3xl font-black tracking-tight text-slate-950">
            계산 데이터 출처 및 기준
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            이 사이트의 모든 계산 결과는{" "}
            <strong>실제 구매 판단을 돕기 위한 예상치</strong>입니다.
            가격·보조금·유지비는 개인 조건과 시기에 따라 달라질 수 있으며,
            최종 구매 전 반드시 딜러·금융사·지자체에서 실제 조건을 확인하세요.
          </p>
        </header>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
            >
              <div className="bg-slate-950 px-5 py-3">
                <h2 className="text-sm font-bold text-white">{section.title}</h2>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="w-36 md:w-44 shrink-0 px-5 py-3 font-semibold text-slate-600 align-top">
                        {row.item}
                      </td>
                      <td className="px-5 py-3 text-slate-700 leading-relaxed">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}

          {/* 업데이트 이력 */}
          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="bg-slate-950 px-5 py-3">
              <h2 className="text-sm font-bold text-white">데이터 업데이트 이력</h2>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {UPDATE_LOG.map((entry, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="w-28 px-5 py-3 font-mono text-xs text-slate-500 align-top whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{entry.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 면책 안내 */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-800 leading-relaxed">
            <p className="font-bold mb-2">⚠️ 중요 안내</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>이 사이트는 테슬라(Tesla, Inc.)의 공식 사이트가 아닙니다.</li>
              <li>계산 결과는 참고용 예상치이며 법적 효력이 없습니다.</li>
              <li>보조금 지급 여부는 예산·자격 조건에 따라 달라질 수 있습니다.</li>
              <li>금융 조건(금리·할부 수수료)은 금융사별로 상이합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
