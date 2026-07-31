import Link from "next/link";
import CalcContent from "@/components/calc/CalcContent";
import { METRO_REGIONS } from "@/lib/regions";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { getTrimById, VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";

export const metadata = {
  title: "테슬라 Model Y L 가격·주행거리·보조금 실구매가 (2026)",
  description:
    "Model Y L AWD의 출고가와 주행거리, 지역별 보조금을 적용한 실구매가와 월납입금을 계산합니다. 기존 Model Y Long Range와 무엇이 다른지, 어떤 사람에게 맞는 트림인지 정리했습니다.",
  openGraph: {
    title: "테슬라 Model Y L 가격·주행거리·보조금 실구매가",
    description:
      "Model Y L AWD 출고가·주행거리와 지역별 보조금 적용 실구매가·월납입금 계산.",
    url: "https://www.paytesla.kr/models/model-y-l",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/models/model-y-l" },
};

const myL = getTrimById("my-l-awd");
const myLr = getTrimById("my-lr");
const myRwd = getTrimById("my-rwd");
const m3Lr = getTrimById("m3-lr");

const man = (won) => `${(won / 10000).toLocaleString()}만원`;
const formatWon = (amount) => `₩${Number(amount).toLocaleString("ko-KR")}`;
const liter = (l) => `${Number(l).toLocaleString()}L`;

// 적재 공간은 가격·주행거리와 확인 시점이 달라 별도 표기한다.
const CARGO_VERIFIED_AT = "2026-07-31";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: myL.trimFull,
      brand: { "@type": "Brand", name: "Tesla" },
      category: "전기 SUV",
      offers: {
        "@type": "Offer",
        price: String(myL.priceKrw),
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
        url: "https://www.paytesla.kr/models/model-y-l",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Model Y",
          item: "https://www.paytesla.kr/models/model-y",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Model Y L",
          item: "https://www.paytesla.kr/models/model-y-l",
        },
      ],
    },
  ],
};

const SECTIONS = [
  {
    heading: "Model Y L은 Model Y의 상위 트림이 아니라 다른 용도의 차다",
    lead: `${myL.trimFull}는 라인업에서 가장 비싸고(${man(myL.priceKrw)}) 주행거리도 가장 깁니다(${myL.rangeKm}km). 그런데 이 차를 '더 좋은 Model Y'로 보면 판단을 그르치기 쉽습니다.`,
    blocks: [
      {
        type: "text",
        paragraphs: [
          "성능만 놓고 보면 Model Y L AWD의 0-100km/h 가속은 " +
            myL.zeroToHundred +
            "초로, " +
            myLr.trimFull +
            "의 " +
            myLr.zeroToHundred +
            "초보다 오히려 느립니다. 차체가 커지고 무거워진 결과입니다.",
          "즉 이 트림이 제공하는 것은 더 빠른 주행이 아니라 더 넓은 공간과 더 긴 주행거리입니다. 좌석과 적재 공간이 실제로 필요한 사람에게는 대체 불가능한 선택이고, 그렇지 않은 사람에게는 비용만 늘어나는 선택입니다.",
          "그래서 이 트림을 검토할 때 던져야 할 질문은 '더 좋은가'가 아니라 '내가 이 공간을 쓰는가'입니다.",
        ],
      },
      {
        type: "table",
        headers: ["항목", "Model Y L AWD", "Model Y Long Range", "차이"],
        rows: [
          [
            "출고가",
            man(myL.priceKrw),
            man(myLr.priceKrw),
            `+${man(myL.priceKrw - myLr.priceKrw)}`,
          ],
          [
            "주행거리",
            `${myL.rangeKm}km`,
            `${myLr.rangeKm}km`,
            `+${myL.rangeKm - myLr.rangeKm}km`,
          ],
          [
            "0-100km/h",
            `${myL.zeroToHundred}초`,
            `${myLr.zeroToHundred}초`,
            `+${(myL.zeroToHundred - myLr.zeroToHundred).toFixed(1)}초 (느림)`,
          ],
          ["구동 방식", myL.driveType, myLr.driveType, "동일"],
          [
            "좌석",
            `${myL.seats}인승 (3열)`,
            `${myLr.seats}인승 (2열)`,
            `+${myL.seats - myLr.seats}석`,
          ],
        ],
        note: `가격·주행거리·가속은 테슬라 공식 홈페이지 기준, 확인일 ${VEHICLE_DATA_VERIFIED_AT}. 주행거리는 환경부 복합 인증 기준입니다. Model Y L은 2026년 4월 국내 출시된 3열 ${myL.seats}인승(2+2+2) 구성입니다. 적재 용량은 아래 표에 좌석 구성별로 정리했습니다.`,
      },
    ],
  },
  {
    heading: "적재 공간은 좌석을 몇 개 쓰느냐로 완전히 달라진다",
    lead: `${myL.trimFull}의 최대 적재 용량은 ${liter(myL.cargoLiters)}로 표기되지만, 이 숫자는 2명만 타고 2·3열을 모두 접었을 때의 값입니다. 3열까지 쓰면서 동시에 짐도 많이 싣는 상황은 성립하지 않습니다.`,
    blocks: [
      {
        type: "table",
        headers: ["탑승 구성", "뒤 적재공간", "프렁크", "총 적재공간"],
        rows: myL.cargo.configs.map((c) => [
          c.label,
          liter(c.rearL),
          liter(myL.cargo.frunkL),
          liter(c.totalL),
        ]),
        note: `적재 공간 확인일 ${CARGO_VERIFIED_AT}. 프렁크(앞 트렁크) ${liter(myL.cargo.frunkL)}는 좌석 구성과 무관하게 항상 쓸 수 있습니다.`,
      },
      {
        type: "text",
        paragraphs: [
          `표에서 봐야 할 것은 첫 줄입니다. 6명이 모두 타면 뒤에 남는 공간은 ${liter(myL.cargo.configs[0].rearL)}로, 프렁크를 더해도 ${liter(myL.cargo.configs[0].totalL)}입니다. 6명분의 여행 가방을 싣기에는 넉넉하지 않습니다.`,
          `반대로 3열을 접으면 뒤 공간이 ${liter(myL.cargo.configs[1].rearL)}로 두 배 이상 늘어납니다. 즉 이 차의 실제 사용 패턴은 '4명 + 짐 많이' 또는 '6명 + 짐 조금' 중 하나이지, 둘을 동시에 만족시키는 구성이 아닙니다.`,
          "그래서 구매 전에 던져야 할 질문은 '6명이 탈 일이 있는가'가 아니라 '6명이 타면서 짐도 실어야 하는 일이 얼마나 자주 있는가'입니다. 그 빈도가 낮다면 3열은 비상용이고, 평소에는 넓은 트렁크를 가진 5인승 SUV와 같은 방식으로 쓰게 됩니다.",
        ],
      },
      {
        type: "callout",
        title: "3열을 실제로 쓸 계획이라면",
        text: `6명 탑승 시 뒤 공간이 ${liter(myL.cargo.configs[0].rearL)}라는 점을 감안해 루프박스나 트레일러 히치 같은 추가 적재 수단을 함께 검토하는 편이 현실적입니다. 장거리 가족 여행에서 이 차이는 출발 당일에 체감됩니다.`,
      },
    ],
  },
  {
    heading: "차값 차이를 어떻게 볼 것인가",
    lead: `Long Range와의 출고가 차이는 ${man(myL.priceKrw - myLr.priceKrw)}입니다. 이 금액이 월 부담으로는 얼마가 되는지 감을 잡아보면 판단이 쉬워집니다.`,
    blocks: [
      {
        type: "text",
        paragraphs: [
          "차값 차이 " +
            man(myL.priceKrw - myLr.priceKrw) +
            "을 60개월 할부로 나누면 단순 계산으로 월 10만원 남짓입니다. 여기에 이자가 붙으므로 실제로는 조금 더 늘어납니다.",
          "정확한 금액은 보조금이 얼마나 적용되는지에 따라 달라집니다. 국고보조금은 차량 가격 구간에 따라 산정되므로 트림별로 금액이 다르고, 지방보조금은 거주 지역에 따라 또 달라집니다. 두 트림의 실제 실구매가 차이는 출고가 차이와 같지 않을 수 있습니다.",
          "위 계산기에서 지역과 트림을 선택하면 각각의 보조금이 자동 적용된 실구매가와 월납입금을 확인할 수 있습니다. 두 트림을 번갈아 계산해 차이를 직접 확인해보세요.",
        ],
      },
      {
        type: "callout",
        title: "같은 예산으로 생각해볼 대안",
        text: `Model Y L AWD 가격이면 ${m3Lr.trimFull}(${man(m3Lr.priceKrw)}, ${m3Lr.rangeKm}km)를 사고도 상당한 금액이 남습니다. 주행거리를 확보하는 것이 목적이라면 세단 쪽이 비용 효율이 좋습니다. 공간이 목적일 때만 L 트림이 설득력을 갖습니다.`,
      },
    ],
  },
  {
    heading: "어떤 사람에게 맞는 선택인가",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "L 트림이 맞는 경우",
            tone: "good",
            items: [
              "탑승 인원이 정기적으로 5명을 넘는다",
              "카시트를 두 개 이상 장착해야 한다",
              "캠핑·레저 장비를 자주 싣는다",
              "장거리 주행이 잦아 긴 주행거리가 실제로 쓰인다",
              "부모님을 자주 모시고 다닌다",
            ],
          },
          {
            title: "다른 트림이 나은 경우",
            tone: "bad",
            items: [
              "평소 1~2명이 타고 짐이 적다",
              "'가끔 필요할지도'라는 이유로 고민 중이다",
              "주차 공간이 좁은 곳을 자주 이용한다",
              "월 부담을 낮추는 것이 우선이다",
              "가속 성능을 중시한다 (LR이 더 빠름)",
            ],
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "실무적인 조언을 하나 더하면, '가끔 필요할지도 모른다'는 이유로 큰 차를 사는 선택은 대체로 후회로 이어집니다. 1년에 몇 번 있는 상황을 위해 매달 더 내는 할부금과 더 나가는 충전비를 감수하는 셈이기 때문입니다.",
          "연 몇 회 수준으로 대인원 이동이 필요하다면, 그때만 다른 수단을 쓰는 편이 총비용 면에서 유리한 경우가 많습니다.",
        ],
      },
    ],
  },
  {
    heading: "구매 전 확인할 것들",
    blocks: [
      {
        type: "steps",
        items: [
          `3열 좌석에 직접 앉아보고, 3열을 세운 상태의 트렁크(${liter(myL.cargo.configs[0].rearL)})에 평소 싣는 짐이 들어가는지 확인합니다. 3열 공간의 여유는 탑승자 체격에 따라 체감이 크게 다릅니다.`,
          "차체 크기를 확인하고 평소 이용하는 주차장에 들어가는지 실측합니다. 기계식 주차장은 특히 제한이 있을 수 있습니다.",
          "거주 지역의 보조금을 확인합니다. 차량 가격 구간에 따라 국고보조금이 달라질 수 있습니다.",
          "실구매가 계산기에서 L AWD와 Long Range를 각각 계산해 월납입금 차이를 확인합니다.",
          "총소유비용 계산기로 5년 보유 기준 차이까지 확인합니다. 차체가 무거우면 전비가 불리해 유지비 차이도 누적됩니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "사양은 반드시 공식 홈페이지에서",
        text: `이 페이지의 가격·주행거리·가속 수치는 테슬라 공식 홈페이지를 기준으로 ${VEHICLE_DATA_VERIFIED_AT}에 확인한 값입니다. 다만 가격과 사양은 예고 없이 변경될 수 있으므로, 계약 전에는 반드시 공식 홈페이지에서 최신 정보를 다시 확인하세요.`,
      },
    ],
  },
  {
    heading: "Model Y L에 대해 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Model Y L은 기존 Model Y와 무엇이 다른가요?",
            a: `가장 큰 차이는 차체 크기와 그에 따른 실내 공간입니다. 주행거리도 ${myL.rangeKm}km로 Long Range의 ${myLr.rangeKm}km보다 깁니다. 반면 차체가 커지고 무거워진 만큼 0-100km/h 가속은 ${myL.zeroToHundred}초로 Long Range의 ${myLr.zeroToHundred}초보다 느립니다. 좌석은 3열 ${myL.seats}인승(2+2+2) 구성으로, 2열 ${myLr.seats}인승인 기존 Model Y와 용도가 다릅니다.`,
          },
          {
            q: "보조금은 다른 트림과 같은가요?",
            a: "다를 수 있습니다. 국고보조금은 차량 가격 구간과 효율 등에 따라 산정되므로 트림별로 금액이 달라집니다. 지방보조금은 거주 지역에 따라 또 달라집니다. 정확한 금액은 실구매가 계산기에서 지역과 트림을 선택해 확인하세요.",
          },
          {
            q: "주행거리가 기니까 충전비도 적게 드나요?",
            a: "아닙니다. 주행거리가 길다는 것은 배터리 용량이 크다는 뜻이지 전비가 좋다는 뜻이 아닙니다. 오히려 차체가 무거우면 같은 거리를 달리는 데 더 많은 전력을 쓰게 됩니다. 한 번 충전으로 더 멀리 갈 수는 있지만, 연간 충전비는 더 나올 수 있습니다. 충전비 계산기에서 전비를 조정해 비교해보세요.",
          },
          {
            q: `${man(myL.priceKrw)}면 다른 선택지는 없나요?`,
            a: `공간이 목적이 아니라면 대안이 있습니다. ${m3Lr.trimFull}는 ${man(m3Lr.priceKrw)}에 ${m3Lr.rangeKm}km를, ${myLr.trimFull}는 ${man(myLr.priceKrw)}에 ${myLr.rangeKm}km를 제공합니다. 모델 비교 계산기에서 실구매가·월납입금·5년 총비용을 나란히 놓고 보면 판단이 쉬워집니다.`,
          },
          {
            q: "지금 사는 게 좋을까요?",
            a: "가격과 보조금은 모두 변동 가능한 값이라 시점을 단정하기는 어렵습니다. 다만 보조금은 연간 예산 소진에 영향을 받으므로, 구매를 결정했다면 거주 지역의 잔여 예산과 접수 일정을 무공해차 통합누리집에서 먼저 확인해보는 것이 좋습니다.",
          },
        ],
      },
    ],
  },
];

export default function ModelYLPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
            <Link href="/" className="transition-colors hover:text-gray-300">
              홈
            </Link>
            <span>/</span>
            <Link href="/models/model-y" className="transition-colors hover:text-gray-300">
              Model Y
            </Link>
            <span>/</span>
            <span className="text-white">Model Y L</span>
          </nav>
          <h1 className="mb-3 text-2xl font-bold leading-tight md:text-4xl">
            테슬라 Model Y L<br className="md:hidden" />
            <span className="md:ml-2">가격 · 주행거리 · 보조금 실구매가</span>
          </h1>
          <p className="text-sm text-gray-400 md:text-base">
            출고가 {man(myL.priceKrw)} · 주행거리 {myL.rangeKm}km · {myL.driveType} — 지역 보조금
            적용 실구매가와 월납입금을 계산합니다
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-8 md:px-6 md:py-12">
        {/* 핵심 스펙 */}
        <section>
          <h2 className="mb-4 text-lg font-bold md:text-xl">핵심 사양</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "출고가", value: formatWon(myL.priceKrw), sub: "보조금 적용 전" },
              { label: "주행거리", value: `${myL.rangeKm} km`, sub: "환경부 복합 인증" },
              { label: "0→100 km/h", value: `${myL.zeroToHundred} 초`, sub: "공식 사양" },
              { label: "구동 방식", value: myL.driveType, sub: "사륜 구동" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>
          <Link
            href="/?model=modely&trim=my-l-awd"
            className="mt-4 block rounded-xl bg-black px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            이 트림으로 실구매가 계산하기 →
          </Link>
        </section>

        {/* 지역별 계산기 */}
        <section>
          <h2 className="mb-2 text-lg font-bold md:text-xl">지역 선택 후 계산기로 이동</h2>
          <p className="mb-4 text-sm text-gray-500">
            거주 지역을 선택하면 해당 지방보조금이 자동 적용된 계산기로 이동합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {METRO_REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/?model=modely&trim=my-l-awd&region=${r.representativeCode ?? ""}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400"
              >
                {r.shortName}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 본문 */}
      <CalcContent
        sections={SECTIONS}
        currentHref="/models/model-y-l"
        dataDate={CALC_DATA_DATE}
        dataNote={`가격·주행거리·가속 수치는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}, 적재 용량 확인일은 ${CARGO_VERIFIED_AT}입니다. 가격과 사양은 예고 없이 바뀔 수 있으므로 계약 전 공식 홈페이지에서 다시 확인하세요.`}
        relatedHeading="Model Y L을 검토할 때 함께 볼 계산기"
        sources={[
          {
            name: "테슬라 공식 — Model Y",
            url: "https://www.tesla.com/ko_kr/modely",
            note: "가격·사양 원본",
          },
          {
            name: "무공해차 통합누리집",
            url: "https://www.ev.or.kr",
            note: "국고·지방보조금 공식 정보",
          },
        ]}
      />

      {/* 관련 페이지 */}
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-8">
        <section className="border-t border-gray-200 pt-8">
          <h2 className="mb-3 text-base font-bold text-gray-700">관련 페이지</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/models/model-y"
              className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
            >
              Model Y 전체 트림
            </Link>
            <Link
              href="/models/model-3"
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200"
            >
              Model 3 상세
            </Link>
            <Link
              href="/compare/model-3-vs-model-y"
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200"
            >
              Model 3 vs Model Y
            </Link>
            <Link
              href="/compare/rwd-vs-awd"
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200"
            >
              RWD vs AWD 비교
            </Link>
            <Link
              href="/calc/compare"
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200"
            >
              모델 비교 계산기
            </Link>
            {["seoul", "busan", "incheon", "daegu"].map((slug) => {
              const region = METRO_REGIONS.find((r) => r.slug === slug);
              if (!region) return null;
              return (
                <Link
                  key={slug}
                  href={`/subsidy/${slug}`}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-200"
                >
                  {region.shortName} 보조금
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
