"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegionDistrictSelector({ districts, metro }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const code = e.target.value;
    setSelected(code);
    if (code) {
      router.push(`/?region=${code}&model=model3&trim=m3-rwd`);
    }
  };

  return (
    <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-blue-950/40 border border-blue-800/40 rounded-xl p-4">
      <span className="text-sm font-medium text-blue-300 whitespace-nowrap">
        {metro.shortName} 내 시/군/구 선택
      </span>
      <select
        value={selected}
        onChange={handleChange}
        className="flex-1 w-full sm:w-auto bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="">전체 범위 보기 (최소~최대)</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>
      {selected && (
        <span className="text-xs text-blue-400">
          선택한 지역 계산기로 이동합니다 →
        </span>
      )}
    </div>
  );
}
