import Link from "next/link";

/**
 * 계산 결과 아래 배치하는 "구매 전 함께 계산할 항목" 섹션.
 * items[0]이 핵심 링크(강조 카드)이며, 보통 홈(/) 대표 계산기로 연결한다.
 *
 * @param {Array<{href:string, label:string, desc:string}>} items
 */
export default function PurchaseCrossLinks({ items }) {
  if (!items?.length) return null;
  const [primary, ...rest] = items;

  return (
    <section className="mx-auto max-w-3xl px-4 md:px-8 mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-black text-slate-950 mb-4">
          구매 전 함께 계산할 항목
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={primary.href}
            className="group rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100/70 sm:col-span-2"
          >
            <h3 className="text-sm font-black text-blue-800 group-hover:text-blue-900">
              {primary.label} →
            </h3>
            <p className="mt-1.5 text-xs leading-6 text-blue-700/80">{primary.desc}</p>
          </Link>
          {rest.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white"
            >
              <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700">
                {it.label}
              </h3>
              <p className="mt-1.5 text-xs leading-6 text-slate-500">{it.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
