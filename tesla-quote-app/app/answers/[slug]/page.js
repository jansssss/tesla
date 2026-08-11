import Link from "next/link";
import { notFound } from "next/navigation";
import AnswerArticle from "@/components/answers/AnswerArticle";
import {
  getAnswer,
  getAnswerSlugs,
  getNextStop,
  getPrevStop,
  getStopPosition,
  answersByGroup,
  ANSWER_GROUPS,
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

  // 같은 주제에서 이어서 묻게 되는 질문 — 여정(다음 단계)과 별개의 횡적 연결
  const siblings = answersByGroup(answer.group)
    .filter((a) => a.slug !== answer.slug)
    .slice(0, 4);
  const groupLabel = ANSWER_GROUPS.find((g) => g.id === answer.group)?.label;

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
    <main className="min-h-screen bg-tesla-mist/40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — 질문을 그대로 H1으로 쓴다 */}
      <section className="border-b border-tesla-line bg-white py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link
              href="/answers"
              className="inline-flex rounded-md bg-tesla-blueSoft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-tesla-blue transition hover:bg-tesla-blue hover:text-white"
            >
              구매 질문 {position ? `${position.n}` : ""}
            </Link>
            {groupLabel ? (
              <span className="inline-flex rounded-md bg-tesla-mist px-2.5 py-1 text-[11px] font-bold text-tesla-ink70">
                {groupLabel}
              </span>
            ) : null}
            <span className="text-[11px] text-slate-400">최종 갱신 {ANSWERS_UPDATED_AT}</span>
          </div>
          <h1 className="text-2xl font-black leading-snug tracking-tight text-tesla-ink md:text-3xl">
            {answer.question}
          </h1>
          {answer.heroSub ? (
            <p className="mt-3 text-sm text-tesla-ink70 md:text-base">{answer.heroSub}</p>
          ) : null}
        </div>
      </section>

      {/* 핵심 답변 — 스크롤 없이 결론부터 */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-8 md:px-8">
        <div className="rounded-2xl border border-tesla-line border-l-[3px] border-l-tesla-blue bg-white p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-blue">짧은 답</p>
          <p className="mt-3 text-sm leading-8 text-tesla-ink md:text-base">{answer.answer}</p>
        </div>
      </div>

      <AnswerArticle
        answer={answer}
        nextStop={nextStop}
        prevStop={prevStop}
        siblings={siblings}
        groupLabel={groupLabel}
      />
    </main>
  );
}
