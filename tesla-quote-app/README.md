# 테슬라 얼마? (CSV 기반 MVP)

## 로컬 실행
```bash
cd tesla-quote-app
npm install
npm run dev
```

`npm run dev` 실행 시 자동으로 `../보조금` 폴더의 최신 CSV(`tesla_subsidy_by_local_YYYYMMDD.csv`)를 `data/latest.csv`로 동기화합니다.

## CSV 갱신
1. 루트에서 수집 실행:
```bash
cd 보조금
node extract_tesla_subsidy.js
```
2. 앱 동기화:
```bash
cd ../tesla-quote-app
npm run prepare:data
```

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
