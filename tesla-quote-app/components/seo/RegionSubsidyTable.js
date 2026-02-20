import RegionDistrictSelector from "./RegionDistrictSelector";

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

export default function RegionSubsidyTable({ stats, metro }) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold mb-4">
        2026년 모델별 보조금 현황
      </h2>

      {metro.type === "do" && (
        <RegionDistrictSelector districts={stats.districts} metro={metro} />
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">모델 / 트림</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">출고가</th>
                <th className="text-right px-4 py-3 font-semibold text-green-700">
                  {metro.type === "si" ? "보조금" : "보조금 범위"}
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-900">실구매가*</th>
              </tr>
            </thead>
            <tbody>
              {stats.statsByModel.map((stat) => {
                const subsidyDisplay =
                  metro.type === "si"
                    ? `${stat.max}만원`
                    : stat.min === stat.max
                    ? `${stat.max}만원`
                    : `${stat.min}~${stat.max}만원`;

                const estimatedPrice =
                  metro.type === "si" && stat.max > 0
                    ? stat.price - stat.max * 10000
                    : null;

                return (
                  <tr
                    key={stat.trimId}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-gray-900">{stat.label}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-500 hidden sm:table-cell">
                      {formatWon(stat.price)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-green-600">
                        -{subsidyDisplay}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-gray-900">
                      {estimatedPrice ? formatWon(estimatedPrice) : "지역 선택 시"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 px-4 py-3 border-t border-gray-50">
          * 실구매가는 보조금만 차감한 기준입니다. 청년·다자녀·전환 혜택은 계산기에서 확인하세요.
          {metro.type === "do" && " 도 단위 보조금은 시/군/구별로 다릅니다."}
        </p>
      </div>
    </section>
  );
}
