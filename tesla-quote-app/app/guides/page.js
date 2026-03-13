import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

const guides = getAllGuides();

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

export const metadata = {
  title: "정보성 가이드 - 하우머치 테슬라",
  description:
    "테슬라 구매, 지역별 보조금, 세제 혜택, 충전 환경, 신청 전략을 깊이 있게 정리한 정보성 가이드 모음입니다."
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_28%,#ffffff_100%)] py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.2)] md:p-12">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">
            정보성 가이드
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
            계산기에서 끝나지 않는 구매 판단을 위한 해설 아카이브
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
            지역별 보조금 차이, 모델3와 모델Y 비교, 세제 혜택, 충전 환경, 접수 타이밍 같은 주제를 글로 풀어낸
            가이드 모음입니다. 단순 계산값보다 중요한 해석과 준비 순서를 중심으로 정리했습니다.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  {guide.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-blue-700">
                {guide.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{guide.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>{formatDate(guide.updatedAt)}</span>
                <span>{guide.readTime}</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
