-- ================================================
-- guides 공개 모델 전환: source / status 도입
-- Supabase SQL Editor에 붙여넣고 1회 실행.
-- 기본 원칙: status = 'published' 인 글만 공개. 그 외(draft/archived)는 비공개.
-- 파이프라인 insert는 status를 지정하지 않으므로 DEFAULT 'draft'로 저장됨(=기본 비공개).
-- ================================================

-- 1) 컬럼 추가 (기본값으로 신규/파이프라인 글은 자동 draft)
ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'automated_pipeline'
    CHECK (source IN ('manual_editor', 'automated_pipeline')),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived'));

CREATE INDEX IF NOT EXISTS idx_guides_status ON guides(status);

COMMENT ON COLUMN guides.source IS 'manual_editor(사람 직접 작성) | automated_pipeline(자동 생성)';
COMMENT ON COLUMN guides.status IS 'draft(검토 전·비공개) | published(공개) | archived(영구 비공개·404)';

-- 2) 기존 행 분류
--    ※ 베이스라인(automated_pipeline/draft)은 위 ADD COLUMN의 DEFAULT가
--      첫 실행 시 기존 행 전부에 자동 백필한다. 따라서 "전체를 draft로 리셋"하는
--      구문은 두지 않는다 — 재실행 시 그 사이 사람이 발행한 다른 글이
--      초기화되지 않도록(재실행 안전). 아래는 지정한 slug만 명시적으로 갱신한다.

--    사람이 직접 작성·공개할 글 → manual_editor / published
UPDATE guides
  SET source = 'manual_editor', status = 'published'
  WHERE slug IN ('20260619-jvovmc', '20260616-3-6');

--    이미 404 archived 처리된 과거 자동글 → automated_pipeline / archived
UPDATE guides
  SET source = 'automated_pipeline', status = 'archived'
  WHERE slug IN (
    '20260421-ioniq-3-640km-electric-hatchback-guide',
    '20260414-tesla-model3-price-cut-subsidy-2026'
  );

-- 3) 실행 후 검증 쿼리 (아래를 별도로 실행해 결과 확인)

-- (a) 상태별 건수 요약
-- SELECT status, source, COUNT(*) FROM guides GROUP BY status, source ORDER BY status, source;

-- (b) 공개되는 글이 사람 작성 2개뿐인지
-- SELECT slug, source, status FROM guides WHERE status = 'published' ORDER BY slug;
--   기대: 20260616-3-6 (manual_editor), 20260619-jvovmc (manual_editor) 만

-- (c) 지정한 4개 분류 확인
-- SELECT slug, source, status FROM guides
--  WHERE slug IN ('20260619-jvovmc','20260616-3-6',
--                 '20260421-ioniq-3-640km-electric-hatchback-guide',
--                 '20260414-tesla-model3-price-cut-subsidy-2026')
--  ORDER BY status, slug;

-- (d) 전체 분류 한눈에
-- SELECT slug, source, status, (content_html IS NOT NULL) AS has_html FROM guides ORDER BY status, slug;
