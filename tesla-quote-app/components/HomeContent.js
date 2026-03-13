import Link from "next/link";
import { getFeaturedGuides } from "@/lib/guides";

const HOW_TO_USE_STEPS = [
  {
    title: "1. 모델과 트림을 고릅니다",
    body:
      "먼저 Model 3 또는 Model Y를 선택한 뒤, 원하는 트림을 고릅니다. 차량가가 달라지면 국비 반영 구간과 최종 실구매가 체감이 달라질 수 있으므로, 한 가지 트림만 보지 말고 2개 정도를 함께 비교하는 편이 좋습니다."
  },
  {
    title: "2. 실제 등록 지역을 선택합니다",
    body:
      "보조금은 차량을 어디서 등록하고 신청하는지에 따라 지방비가 달라집니다. 생활권이 아닌 행정상 실제 기준 지역으로 확인해야 하며, 거주기간이나 사업장 등록지 요건이 있는 지역은 공고문을 함께 확인해야 합니다."
  },
  {
    title: "3. 추가 혜택과 금융 조건을 넣어봅니다",
    body:
      "청년 생애 첫차, 저소득층, 전기차 전환지원, 다자녀 혜택처럼 본인에게 해당할 수 있는 조건을 체크합니다. 이후 선수금, 금리, 할부개월을 조정해 월 납입금이 생활비 구조 안에서 감당 가능한지 확인합니다."
  },
  {
    title: "4. 계산 결과를 공고문과 함께 검토합니다",
    body:
      "계산기는 빠른 비교용 도구입니다. 최종 계약 전에는 반드시 무공해차 통합누리집, 지자체 공고문, 차량 가격표를 다시 확인해 신청 자격과 예산 소진 여부를 함께 체크해야 합니다."
  }
];

const FAQS = [
  {
    question: "보조금은 언제 신청해야 하나요?",
    answer:
      "차량 계약이 끝났다고 자동으로 보조금이 확보되는 것은 아닙니다. 지역별 공고문에 따라 접수 시점, 제출 서류, 승인 순서가 다르므로 계약 직후 바로 관련 안내를 확인해야 합니다. 특히 예산 소진이 빠른 지역은 접수 타이밍이 실제 수령 가능성을 좌우합니다."
  },
  {
    question: "법인과 개인 구매는 무엇이 다른가요?",
    answer:
      "개인은 거주지와 자격 요건 중심으로 판단하는 경우가 많고, 법인이나 개인사업자는 등록지, 사업 목적, 증빙 서류, 비용 처리 방식까지 함께 검토해야 합니다. 계산기는 동일하게 사용할 수 있지만 실제 신청 서류와 해석은 다를 수 있습니다."
  },
  {
    question: "계산 결과와 실제 수령 금액이 다른 이유는 무엇인가요?",
    answer:
      "보조금 정책은 연도 중에도 조정될 수 있고, 지자체 예산 잔량, 접수 시점, 차량 출고 일정, 추가 지원금 자격 판단에 따라 실제 결과가 달라질 수 있습니다. 그래서 계산값은 현재 기준 비교값으로 보고, 최종 신청 전에 반드시 공고문과 담당 부서 안내를 교차 확인해야 합니다."
  },
  {
    question: "모델3와 모델Y 중 무엇이 더 유리한가요?",
    answer:
      "정답은 고정되어 있지 않습니다. 총예산, 월 납입금, 가족 구성, 적재 공간, 주행거리, 충전 환경을 함께 봐야 합니다. 기본 가격만 보면 모델3가 가벼워 보일 수 있지만, 장기 보유와 활용도를 감안하면 모델Y가 더 맞는 경우도 많습니다."
  }
];

const featuredGuides = getFeaturedGuides();

export default function HomeContent() {
  return (
    <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_35%,#ffffff_100%)] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-10">
            <span className="inline-flex rounded-full bg-brandRed/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-brandRed">
              서비스 소개
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              지역과 조건을 바꾸며 실구매가와 월 납입금을 직접 계산해볼 수 있습니다
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700 md:text-base">
              <p>
                하우머치 테슬라는 <strong>무공해차 통합누리집 공개 데이터</strong>, 지자체 전기차 보급 공고,
                테슬라 국내 판매 가격 정보, 전기차 추가 지원 제도 안내를 바탕으로 지역별 실구매가를 빠르게
                비교하는 계산기입니다. 앱 내부에서는 최신 CSV 스냅샷을 불러와 지역 코드별 보조금을 계산하고,
                추가 지원금과 선수금, 금리, 할부 개월 수까지 함께 반영해 월 납입금 시나리오를 확인할 수 있게
                구성했습니다.
              </p>
              <p>
                이 계산기는 계약을 대체하는 도구가 아니라, 복잡한 자료를 한 화면에서 읽을 수 있도록 돕는
                의사결정 도구입니다. 최종 신청 가능 여부는 예산 잔액, 접수 순번, 출고 일정, 자격 증빙에 따라
                달라질 수 있으므로 실제 계약 전에는 반드시 지자체 공고문과 담당 부서 안내를 다시 확인해야
                합니다.
              </p>
              <p>
                핵심은 단순히 보조금 숫자를 보여주는 데서 끝나지 않는 것입니다. 지역과 트림을 바꿨을 때
                실구매가가 얼마나 달라지는지, 추가 혜택이 월 납입금에 어떤 영향을 주는지, 어떤 경우에 계산값과
                실제 수령액이 달라질 수 있는지를 함께 읽을 수 있어야 구매 판단에 도움이 됩니다.
              </p>
            </div>
          </article>

          <aside className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-10">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-200">
              데이터 기준
            </span>
            <h3 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
              계산값을 해석할 때 함께 봐야 할 기준
            </h3>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
              <li>무공해차 통합누리집과 지자체 공고를 기준으로 지역별 보조금 스냅샷을 반영합니다.</li>
              <li>트림별 차량가와 추가 혜택 가정값을 조합해 실구매가와 할부 원금을 계산합니다.</li>
              <li>청년, 저소득층, 전환지원, 다자녀 조건은 공고문 자격 심사 전제의 예시 계산입니다.</li>
              <li>실제 계약 전에는 예산 잔액, 접수 마감, 제출 서류, 출고 일정을 반드시 교차 확인해야 합니다.</li>
            </ul>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              계산기는 빠른 비교용, 공고문은 최종 확정용입니다. 둘을 함께 봐야 오차를 줄일 수 있습니다.
            </div>
          </aside>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                이용 방법
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                처음 보는 사용자도 순서대로 따라가면 됩니다
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              계산기는 빠르지만, 제대로 쓰려면 순서가 중요합니다. 모델, 지역, 추가 혜택, 금융 조건을 순서대로
              넣고 마지막에 공고문까지 교차 확인해야 실제 구매 판단에 가까워집니다.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {HOW_TO_USE_STEPS.map((step) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5"
              >
                <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">{step.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              자주 묻는 질문
            </h2>
            <div className="mt-6 space-y-4">
              {FAQS.map((item) => (
                <article key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-black text-slate-950 md:text-lg">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:p-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-200">
                  정보성 가이드
                </span>
                <h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
                  계산기만으로 부족한 설명은 별도 가이드에서 다룹니다
                </h2>
              </div>
              <Link
                href="/guides"
                className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                가이드 전체 보기
              </Link>
            </div>
            <div className="mt-8 grid gap-4">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    <span>{guide.category}</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-base font-black leading-tight">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
