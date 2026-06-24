'use client'

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    id: "charging",
    text: "자택 또는 직장에서 완속 충전이 가능한가요?",
    options: [
      { label: "가능 (전용 주차 공간·콘센트)", score: 30 },
      { label: "가능 예정 (설치 계획 있음)", score: 20 },
      { label: "어려움 (공용 주차장, 거리 주차)", score: 5 },
    ],
  },
  {
    id: "distance",
    text: "하루 평균 주행거리는 얼마인가요?",
    options: [
      { label: "30km 이하 (단거리 출퇴근 위주)", score: 25 },
      { label: "30~80km (평균 출퇴근)", score: 20 },
      { label: "80~150km (장거리 출퇴근·업무)", score: 10 },
      { label: "150km 초과 (장거리 이동 잦음)", score: 5 },
    ],
  },
  {
    id: "longtrip",
    text: "장거리 이동(왕복 300km 이상) 빈도는?",
    options: [
      { label: "거의 없음 (연 2~3회 이하)", score: 20 },
      { label: "가끔 (월 1~2회)", score: 15 },
      { label: "자주 (주 1회 이상)", score: 5 },
    ],
  },
  {
    id: "budget",
    text: "구매 예산 범위는?",
    options: [
      { label: "5,000만원 이상 (출고가 기준)", score: 20 },
      { label: "4,000~5,000만원 (보조금 적용 후 고려)", score: 15 },
      { label: "4,000만원 미만 (보조금 후 실구매가 기준)", score: 5 },
    ],
  },
  {
    id: "patience",
    text: "충전 대기 시간에 대한 수용도는?",
    options: [
      { label: "문제없음 (충전 계획 세워서 이동)", score: 5 },
      { label: "가끔 기다릴 수 있음", score: 3 },
      { label: "빠른 주유 습관에 익숙해 어려울 것 같음", score: 1 },
    ],
  },
];

function getLevel(score) {
  if (score >= 80) return { label: "구매 준비 완료", color: "text-green-600", bg: "bg-green-50 border-green-200", emoji: "✅" };
  if (score >= 55) return { label: "대체로 준비됨", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", emoji: "👍" };
  if (score >= 35) return { label: "조건부 권장", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", emoji: "⚠️" };
  return { label: "신중한 검토 필요", color: "text-red-600", bg: "bg-red-50 border-red-200", emoji: "🔍" };
}

function getRecommendations(answers) {
  const recs = [];
  if (answers.charging === 5) recs.push("완속 충전 환경이 없으면 충전비가 높아지고 불편함이 증가합니다. 이사·설치 가능 여부를 먼저 확인하세요.");
  if (answers.longtrip === 5) recs.push("장거리 이동이 잦다면 주행거리가 긴 Long Range 트림을 고려하세요. 급속 충전 인프라 위치도 미리 파악해두는 것이 좋습니다.");
  if (answers.budget === 5) recs.push("예산이 빠듯하다면 지역 보조금 잔여 예산을 먼저 확인하고, 선수금과 할부 조건을 계산기로 시뮬레이션해보세요.");
  if (answers.distance === 5) recs.push("하루 150km를 초과하는 경우, 충전 인프라와 급속 충전소 위치를 미리 파악해 불편 없이 사용할 수 있는지 검토하세요.");
  if (recs.length === 0) recs.push("전반적인 조건이 전기차 구매에 적합합니다. 지역별 보조금 금액과 월 실제 부담금을 계산기로 확인해보세요.");
  return recs;
}

export default function EvPurchaseReadinessCalculator() {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers);
  const totalScore = answered.reduce((sum, id) => sum + (answers[id] || 0), 0);
  const maxScore = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0);
  const pct = answered.length === QUESTIONS.length ? Math.round((totalScore / maxScore) * 100) : null;
  const level = pct !== null ? getLevel(pct) : null;
  const recs = pct !== null ? getRecommendations(answers) : [];

  return (
    <div className="space-y-4">
      {QUESTIONS.map((q, qi) => (
        <div key={q.id} className="rounded-[24px] bg-white shadow-[0_2px_20px_rgba(15,23,42,0.07)] border border-slate-100 p-5 md:p-6">
          <p className="text-sm font-bold text-slate-800 mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black mr-2">{qi + 1}</span>
            {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.score;
              return (
                <button
                  key={opt.label}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                  className={`w-full text-left rounded-xl px-4 py-3 text-sm border transition-all ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 결과 */}
      {pct !== null && (
        <div className={`rounded-[28px] border p-6 md:p-8 ${level.bg}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{level.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-0.5">구매 준비도 점수</p>
              <p className={`text-2xl font-black ${level.color}`}>{pct}점 — {level.label}</p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {recs.map((r, i) => (
              <p key={i} className="text-sm text-slate-700 leading-relaxed flex gap-2">
                <span className="shrink-0 mt-0.5">•</span>{r}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-blue-500 transition-colors"
            >
              지역별 보조금·월납입금 계산하기 →
            </Link>
            <Link
              href="/calc/monthly-real-cost"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2.5 text-sm font-semibold hover:border-slate-500 transition-colors"
            >
              월 실제 부담금 계산기
            </Link>
          </div>
        </div>
      )}

      {answered.length < QUESTIONS.length && (
        <p className="text-center text-xs text-slate-400 py-2">
          {QUESTIONS.length - answered.length}개 질문에 답하면 결과를 확인할 수 있습니다.
        </p>
      )}
    </div>
  );
}
