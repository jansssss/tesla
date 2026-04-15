/**
 * 17개 광역시/도 정의 및 보조금 집계 헬퍼
 * - type 'si': 단일 코드로 직접 조회 (서울, 6대 광역시, 세종, 제주)
 * - type 'do': codePrefix로 기초자치단체 집계 (경기, 강원, 충북/충남, 전북/전남, 경북/경남)
 */

export const METRO_REGIONS = [
  { slug: 'seoul',     name: '서울특별시',       shortName: '서울', codePrefix: '11', representativeCode: '1100',  type: 'si' },
  { slug: 'busan',     name: '부산광역시',       shortName: '부산', codePrefix: '26', representativeCode: '2600',  type: 'si' },
  { slug: 'daegu',     name: '대구광역시',       shortName: '대구', codePrefix: '27', representativeCode: '2700',  type: 'si' },
  { slug: 'incheon',   name: '인천광역시',       shortName: '인천', codePrefix: '28', representativeCode: '2800',  type: 'si' },
  { slug: 'gwangju',   name: '광주광역시',       shortName: '광주', codePrefix: '29', representativeCode: '2900',  type: 'si' },
  { slug: 'daejeon',   name: '대전광역시',       shortName: '대전', codePrefix: '30', representativeCode: '3000',  type: 'si' },
  { slug: 'ulsan',     name: '울산광역시',       shortName: '울산', codePrefix: '31', representativeCode: '3100',  type: 'si' },
  { slug: 'sejong',    name: '세종특별자치시',   shortName: '세종', codePrefix: '36', representativeCode: '3611',  type: 'si' },
  { slug: 'gyeonggi',  name: '경기도',           shortName: '경기', codePrefix: '41', representativeCode: null,    type: 'do' },
  { slug: 'gangwon',   name: '강원특별자치도',   shortName: '강원', codePrefix: '42', representativeCode: null,    type: 'do' },
  { slug: 'chungbuk',  name: '충청북도',         shortName: '충북', codePrefix: '43', representativeCode: null,    type: 'do' },
  { slug: 'chungnam',  name: '충청남도',         shortName: '충남', codePrefix: '44', representativeCode: null,    type: 'do' },
  { slug: 'jeonbuk',   name: '전북특별자치도',   shortName: '전북', codePrefix: '45', representativeCode: null,    type: 'do' },
  { slug: 'jeonnam',   name: '전라남도',         shortName: '전남', codePrefix: '46', representativeCode: null,    type: 'do' },
  { slug: 'gyeongbuk', name: '경상북도',         shortName: '경북', codePrefix: '47', representativeCode: null,    type: 'do' },
  { slug: 'gyeongnam', name: '경상남도',         shortName: '경남', codePrefix: '48', representativeCode: null,    type: 'do' },
  { slug: 'jeju',      name: '제주특별자치도',   shortName: '제주', codePrefix: '50', representativeCode: '5000',  type: 'si' },
];

/** slug → 지역 객체 맵 */
export const METRO_BY_SLUG = Object.fromEntries(
  METRO_REGIONS.map((r) => [r.slug, r])
);

/** generateStaticParams용 슬러그 배열 */
export const ALL_SLUGS = METRO_REGIONS.map((r) => r.slug);

/**
 * 해당 광역시/도에 속하는 기초자치단체 목록 반환
 */
export function getDistrictsForMetro(rows, metro) {
  const filtered =
    metro.type === 'si'
      ? rows.filter((r) => r.local_code === metro.representativeCode)
      : rows.filter((r) => r.local_code.startsWith(metro.codePrefix));

  const districtMap = new Map();
  filtered.forEach((r) => {
    if (!districtMap.has(r.local_code)) {
      districtMap.set(r.local_code, { code: r.local_code, name: r.local_name });
    }
  });
  return [...districtMap.values()];
}

/** 트림 카탈로그 (보조금 계산 기준) */
export const TRIM_CATALOG = [
  { trimId: 'm3-rwd',  modelId: 'model3', label: 'Model 3 RWD',         price: 41990000, csvModel: 'Model 3 RWD' },
  { trimId: 'm3-lr',   modelId: 'model3', label: 'Model 3 Long Range',   price: 52990000, csvModel: 'Model 3 Premium Long Range RWD' },
  { trimId: 'm3-perf', modelId: 'model3', label: 'Model 3 Performance',  price: 59990000, csvModel: 'Model 3 Performance' },
  { trimId: 'my-rwd',   modelId: 'modely', label: 'Model Y RWD',          price: 49990000, csvModel: 'Model Y Premium RWD' },
  { trimId: 'my-lr',   modelId: 'modely', label: 'Model Y Long Range',   price: 59990000, csvModel: 'Model Y Premium Long Range' },
  { trimId: 'my-l-awd', modelId: 'modely', label: 'Model Y L AWD',       price: 69990000, csvModel: null, subsidyPending: true },
];

/**
 * 광역시/도 전체 보조금 통계 집계
 * - si: 단일 코드 실제값
 * - do: 기초자치단체 min/max/avg
 */
export function calcMetroSubsidyStats(rows, metro) {
  const districts = getDistrictsForMetro(rows, metro);

  const statsByModel = TRIM_CATALOG.map(({ trimId, label, price, csvModel, subsidyPending }) => {
    if (subsidyPending) {
      return { trimId, label, price, csvModel, min: 0, max: 0, avg: 0, repRow: null, repCode: null, subsidyPending: true };
    }
    const matchingRows = rows.filter(
      (r) =>
        r.local_code.startsWith(metro.codePrefix) &&
        r.model === csvModel
    );
    const totals = matchingRows.map((r) => Number(r.total_subsidy_manwon)).filter((v) => v > 0);
    const max = totals.length ? Math.max(...totals) : 0;
    const min = totals.length ? Math.min(...totals) : 0;
    const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;

    // 대표값: si는 representativeCode, do는 최대 보조금 기초자치단체
    const repCode = metro.representativeCode ?? matchingRows.sort((a, b) => b.total_subsidy_manwon - a.total_subsidy_manwon)[0]?.local_code;
    const repRow = matchingRows.find((r) => r.local_code === repCode);

    return { trimId, label, price, csvModel, min, max, avg, repRow, repCode };
  });

  return { districts, statsByModel };
}
