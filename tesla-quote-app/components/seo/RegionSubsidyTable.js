import RegionDistrictSelector from "./RegionDistrictSelector";

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

export default function RegionSubsidyTable({ stats, metro, dataDate }) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold mb-4">
        모델별 보조금 비교 · {dataDate} 자료
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
                <th className="text-right px-4 py-3 font-semibold text-gray-900">보조금 차감 차량가*</th>
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
                        {stat.max > 0 ? `-${subsidyDisplay}` : "자료 미확인"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-gray-900">
                      {estimatedPrice ? formatWon(estimatedPrice) : metro.type === "do" ? "지역 선택 시" : "자료 미확인"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 px-4 py-3 border-t border-gray-50">
          * 당시 차량 가격에서 기본 보조금만 차감한 비교값입니다. 취득세·등록비·보험·옵션·할부 이자는 포함하지 않습니다.
          추가 지원은 자격 확인 전 확정 금액에 넣지 마세요. 자료 미확인은 지원 불가를 뜻하지 않습니다.
          {metro.type === "do" && " 도 단위 보조금은 시/군/구별로 다릅니다."}
        </p>
      </div>
    </section>
  );
}
