# 테슬라 얼마? (CSV 기반 MVP)

## 로컬 실행
```bash
cd tesla-quote-app
npm install
npm run dev
```

`npm run dev` 실행 시 자동으로 `../보조금` 폴더의 최신 CSV(`tesla_subsidy_by_local_YYYYMMDD.csv`)를 `data/latest.csv`로 동기화합니다.

## 보조금 데이터 갱신 (업데이트할 때마다 이 절차를 따른다)

보조금 CSV는 사람이 내려받지 않고 `보조금/extract_tesla_subsidy.js`가 무공해차 통합누리집(ev.or.kr)에서 직접 수집한다.

### 1. 시험 수집 (저장 안 함)
```bash
cd 보조금
ONLY=1100 node extract_tesla_subsidy.js   # 서울만 수집해 JSON으로 출력, 파일 저장 없음
```
테슬라 행이 10개 이상 나오면 정상이다. 0행이거나 오류가 나면 아래 "수집이 실패할 때"를 본다.

### 2. 전국 수집
```bash
node extract_tesla_subsidy.js
```
- `보조금/tesla_subsidy_by_local_YYYYMMDD.csv`가 생성되고, `tesla-quote-app/data/latest.csv`에도 복사된다.
- 정상 규모: 161개 지자체(한국환경공단 9999 포함), 약 1,800~1,900행(2026-11-25 기준 1,872행).

### 3. 앱 동기화와 기준일
```bash
cd ../tesla-quote-app
npm run prepare:data
```
- `data/subsidy-meta.json`의 `dataDate`는 CSV 파일명 날짜로 자동 기록된다.
- `lib/calcExtra.js`의 `CALC_DATA_DATE`는 **수동**으로 같은 날짜로 바꾼다(계산기·모델·비교 페이지의 "데이터 기준일").

### 4. 이전 CSV와 국고보조금 비교 (필수)
모델별 국고 금액과 등장 지역 수를 이전 파일과 비교해 바뀐 트림·새 모델을 찾는다.
```bash
cd ../보조금
node -e '
const fs=require("fs");
function load(f){const L=fs.readFileSync(f,"utf8").replace(/^﻿/,"").split("\n").slice(1);const m={};for(const l of L){if(!l)continue;const c=l.slice(1,-1).split("\",\"");m[c[5]]??={g:new Set(),n:0};m[c[5]].g.add(c[6]);m[c[5]].n++;}return m;}
const [a,b]=process.argv.slice(1).map(load);
for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort())console.log(k.padEnd(45),(a[k]?[...a[k].g].join("/")+"("+a[k].n+")":"-").padEnd(12),"->",b[k]?[...b[k].g].join("/")+"("+b[k].n+")":"-");
' tesla_subsidy_by_local_<이전>.csv tesla_subsidy_by_local_<새>.csv
```

### 5. 모델명 매핑 확인 (csvModel)
앱은 CSV의 `model` 문자열이 **정확히 일치**해야 금액을 찾는다. 아래 세 곳의 `csvModel`이 새 CSV에 그대로 있는지, 현재 판매가에 맞는 항목인지 확인한다.
- `lib/vehicleData.js` (트림 마스터)
- `lib/regions.js` (`TRIM_CATALOG`)
- `components/QuoteWizard.js`

현재 매핑(2026-11-25):

| 앱 트림 | csvModel | 국고 |
|---|---|---|
| Model 3 RWD | `Model 3 RWD` | 168만 |
| Model 3 Long Range (5,999만원) | `Model 3 Premium Long Range RWD(5999만원)` | 210만 |
| Model 3 Performance | `Model 3 Performance` | 200만 |
| Model Y RWD | `Model Y Premium RWD` | 170만 |
| Model Y Long Range | `Model Y Premium Long Range` | 210만 |
| Model Y L AWD | `Model Y L AWD` | 215만 |

주의:
- 누리집은 같은 트림을 가격별로 나눠 올리기도 한다. 2026-11에는 `Model 3 Premium Long Range RWD`(가격 표기 없음, 420만)와 `...RWD(5999만원)`(210만)이 함께 있었다. **앱의 출고가와 맞는 항목**으로 매핑한다.
- 단종 모델은 사이트 화면에 `(단종)` 접두어가 붙지만, 스크립트는 기존 CSV와의 호환을 위해 접두어를 붙이지 않는다.
- 새로 등록된 연식(예: `Model 3 RWD (2027)`, `Model Y Premium Long Range AWD (2027)`)은 판매가를 확인하기 전까지 앱 트림에 넣지 않는다.

### 5-1. 지방비 0원 행 확인 (원칙: ev.or.kr 표기 그대로 사용)
금액은 **ev.or.kr 표기를 그대로** 쓰고 임의로 보정하지 않는다. 다만 앱 트림에 지방비 0원 행이 있으면 목록을 남겨 다음 수집 때 채워졌는지 본다.
- 2026-11-25: `Model 3 Premium Long Range RWD(5999만원)` 지방비 0원 10곳(영월·철원·양양·보령·청양·전주·정읍·무주·임실·봉화). 같은 지역의 가격 표기 없는 항목에는 지방비가 있어, 신규 항목에 지자체 금액이 아직 입력되지 않은 것으로 추정.

### 6. 하드코딩된 금액 점검
가이드 본문(`lib/guides.js`)에는 보조금 수치가 직접 적힌 표·문장이 있다. 국고가 바뀐 트림의 금액으로 검색해 함께 고친다.
```bash
cd ../tesla-quote-app
grep -n "<이전 금액>만" lib/guides.js
```
- 고친 가이드는 `updatedAt`을 갱신하고, 수치 출처 문구에 수집일을 적는다.
- 지역 순위·지방비 비교 표(서울 vs 나주, TOP 5 지역, 세금 감면 합산)는 국고가 그대로여도 지방비가 바뀌므로 새 CSV로 다시 계산한다.

### 7. 검증
```bash
npm test && npm run content:audit && npx next build
```
빌드 후 `.next/server/app/subsidy/seoul.html`에서 트림별 보조금 합계가 새 CSV와 같은지 확인한다.

### 수집이 실패할 때
- `No local targets found from init page` → 누리집 화면 구조가 바뀐 것이다. 스크립트가 해독한 페이지를 `보조금/_debug_init.html`로 저장하므로, 지역 목록과 차종 금액 요청 방식을 찾아 스크립트를 고친다(확인 후 이 파일은 삭제).
- 구조 변경 이력:
  - ~2026-07: 지역 목록은 `psPopupLocalCarModelPrice('연도','코드','이름')` 링크, 금액은 `psPopupLocalCarModelPrice.do` HTML 표.
  - 2026-11~: 지역 목록은 `#localListData`의 `data-json`, 연도는 `#pageInfo`의 `year1`, 금액은 `POST /nportal/buySupprt/getLocalCarModelPrice.ajax`(`year`, `local_cd`) JSON의 `list11`(전기승용). 필드: `MODEL_NM`, `MAKER_NM`, `TYPE_NM`, `SUM_GAMT`(국고), `LAMT`(지방), `TOTAL_AMT`.

## 상단 '많이 찾는 메뉴' 인기 순위 갱신

`components/SiteNav.js`는 `data/nav-popularity.json`으로 메뉴 순서와 색을 정한다.
- 상위 3개: 코랄 그라디언트 + 순위 숫자 / 다음 4개: 블루·바이올렛 그라디언트 / 나머지: 회색
- 한 줄 노출 개수: md 4 · lg 6 · xl 8, 나머지는 '전체 메뉴' 드롭다운(`components/SiteNavMore.js`)
- 헤더(SiteHeader)와 같은 목적지는 넣지 않는다.

인기 점수 = **GSC 검색 클릭 + Vercel 방문 수**. 검색 클릭 1건은 그 자체로 방문 1건이므로, 두 값의 **기간이 겹치지 않게** 나눠서 더한다(겹치면 검색 유입이 이중 집계됨).

| 필드 | 출처 | 기간 | 갱신 방법 |
|---|---|---|---|
| `analyticsStart` | Vercel Web Analytics 수집 시작일 | - | 대시보드에서 Web Analytics를 켠 날짜(YYYY-MM-DD) |
| `clicks` | GSC 검색 클릭 | `analyticsStart` 전날까지 90일 | `python -m scripts.analytics.nav_popularity` (Vercel 필드는 유지됨) |
| `pageviews` | Vercel Web Analytics 방문 | `analyticsStart`부터 | Claude Code에 "메뉴 인기 순위 갱신" 요청 → Vercel MCP `aggregate_pageviews`(by `requestPath`, since=`analyticsStart`)로 조회해 `{ window: {start, end, days}, counts: {"/경로": 수} }` 형식으로 기록 |

- Vercel 프로젝트: `tesla`(`prj_Y7Hozlxv5mmvJ48Rq1hJeOID4CP6`), 팀 `team_XuKR2FsTmPkbtA2ujV4xC0Vn`. Web Analytics는 `app/layout.js`의 `<Analytics />`로 수집한다(Hobby: 페이지뷰만, 커스텀 이벤트 불가, 월 5만 이벤트).
- 월 1회 정도 갱신하고 `data/nav-popularity.json`을 커밋한다.

## GitHub 푸시
```bash
git add -A
git commit -m "Add Next.js CSV-based Tesla quote MVP"
git push
```

## Vercel 배포
1. Vercel에서 저장소 Import
2. Root Directory를 `tesla-quote-app`으로 설정
3. Build Command: `npm run build` (기본값)
4. Output: `.next` (기본값)
5. Deploy

배포 시에도 `npm run build` 안에서 `npm run prepare:data`가 먼저 실행됩니다.
