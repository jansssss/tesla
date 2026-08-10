import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerArticle from "@/components/answers/AnswerArticle";
import {
  getAnswer,
  getAnswerSlugs,
  getNextStop,
  getPrevStop,
  getStopPosition,
  ANSWERS_UPDATED_AT,
} from "@/lib/answers";

const BASE = "https://www.paytesla.kr";

export function generateStaticParams() {
  return getAnswerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const answer = getAnswer(slug);
  if (!answer) return {};

  const url = `${BASE}/answers/${answer.slug}`;
  return {
    title: answer.title,
    description: answer.description,
    keywords: answer.keywords,
    openGraph: {
      title: answer.title,
      description: answer.description,
      url,
      siteName: "하우머치 테슬라",
      locale: "ko_KR",
      type: "article",
    },
    alternates: { canonical: url },
  };
}

export default async function AnswerPage({ params }) {
  const { slug } = await params;
  const answer = getAnswer(slug);
  if (!answer) notFound();

  const nextStop = getNextStop(slug);
  const prevStop = getPrevStop(slug);
  const position = getStopPosition(slug);

  // FAQ 블록 → FAQPage 구조화 데이터
  const faqItems = answer.sections.flatMap((s) =>
    s.blocks.filter((b) => b.type === "faq").flatMap((b) => b.items)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: BASE },
          { "@type": "ListItem", position: 2, name: "질문과 답변", item: `${BASE}/answers` },
          { "@type": "ListItem", position: 3, name: answer.question, item: `${BASE}/answers/${answer.slug}` },
        ],
      },
      ...(faqItems.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — 질문을 그대로 H1으로 쓴다 */}
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] py-12 text-white md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link
              href="/answers"
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200 transition hover:bg-white/20"
            >
              구매 질문 {position ? `${position.n}` : ""}
            </Link>
            <span className="text-[11px] text-blue-200/70">
              최종 갱신 {ANSWERS_UPDATED_AT}
            </span>
          </div>
          <h1 className="text-2xl font-black leading-snug md:text-3xl">{answer.question}</h1>
          {answer.heroSub ? (
            <p className="mt-3 text-sm text-blue-200 md:text-base">{answer.heroSub}</p>
          ) : null}
        </div>
      </section>

      {/* 핵심 답변 — 스크롤 없이 결론부터 */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-8 md:px-8">
        <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            짧은 답
          </p>
          <p className="mt-3 text-sm leading-8 text-slate-800 md:text-base">{answer.answer}</p>
        </div>
      </div>

      <AnswerArticle answer={answer} nextStop={nextStop} prevStop={prevStop} />
    </main>
  );
}
