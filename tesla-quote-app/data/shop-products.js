/**
 * 테슬라/전기차 액세서리 제품 목록 + 본문 맥락 매칭
 *
 * - SHOP_PRODUCTS: ContextualShopCTA(글 하단 추천), ShopBanner 공용 데이터.
 *   (/shop 페이지는 현재 노출하지 않지만 데이터/컴포넌트는 보존)
 * - keywords: 글 "본문"에 등장하면 해당 상품을 추천하기 위한 트리거 키워드(부분 문자열 매칭).
 *   예) 본문에 "허리"·"장거리 운전"이 있으면 요추 받침대를 추천.
 * - affiliate 링크 변경 시 이 파일의 affiliate 필드만 수정하면 됩니다.
 *
 * rank 순서 = 노출 순서이자 본문 매칭이 없을 때의 폴백 우선순위.
 */
export const SHOP_PRODUCTS = [
  {
    rank: 1,
    id: "cargo-mat",
    name: "3D 카고 매트 (트렁크 라이너)",
    nameEn: "Cargo Mat / Trunk Liner",
    description: "레이저 스캔 맞춤 제작. 방수·방오 TPE 소재로 트렁크 바닥을 완벽 보호.",
    price: "89,000",
    priceNote: "가격은 판매처·옵션에 따라 다를 수 있습니다",
    badge: "압도적 1위",
    badgeColor: "bg-yellow-400 text-gray-900 ring-2 ring-yellow-600 shadow-md",
    category: "인테리어",
    tags: ["방수", "맞춤형", "필수"],
    emoji: "🧳",
    affiliate: "https://link.coupang.com/a/eEj1VoWNi0",
    keywords: ["트렁크", "카고", "적재", "바닥 매트", "방수", "수납공간", "러기지", "인테리어", "구매 가이드", "필수품"],
  },
  {
    rank: 2,
    id: "wireless-charger",
    name: "테슬라 전용 듀얼 무선 충전 패드",
    nameEn: "Dual Wireless Charger Console",
    description: "15W 고속 무선 충전. 콘솔 딱 맞는 커스텀 핏. MagSafe 호환.",
    price: "129,000",
    priceNote: "브랜드별 상이",
    badge: "베스트 2위",
    badgeColor: "bg-slate-300 text-slate-800 ring-2 ring-slate-500 shadow-md",
    category: "전자기기",
    tags: ["무선충전", "편의", "고속"],
    emoji: "⚡",
    affiliate: "https://link.coupang.com/a/eEjVqmOSJw",
    keywords: ["무선충전", "무선 충전", "충전 패드", "스마트폰", "휴대폰", "콘솔", "거치", "전자기기"],
  },
  {
    rank: 3,
    id: "sunshade",
    name: "앞유리 선쉐이드 (햇빛 가리개)",
    nameEn: "Windshield Sunshade",
    description: "유리 루프 전용 포함. 99% UV 차단. 접이식 수납 가능.",
    price: "38,000",
    priceNote: "차종별 전용 사이즈",
    badge: "베스트 3위",
    badgeColor: "bg-amber-700 text-white ring-2 ring-amber-900 shadow-md",
    category: "선케어",
    tags: ["여름필수", "UV차단", "실내온도"],
    emoji: "☀️",
    affiliate: "https://link.coupang.com/a/eEj9lmFGEw",
    keywords: ["여름", "햇빛", "햇볕", "자외선", "uv", "실내 온도", "실내온도", "유리 루프", "유리루프", "선쉐이드", "차열", "폭염"],
  },
  {
    rank: 4,
    id: "lumbar-support",
    name: "메모리폼 요추 받침대",
    nameEn: "Lumbar Support Cushion",
    description: "허리 곡선을 받쳐 장거리 운전 피로를 줄여주는 메모리폼 요추 지지대.",
    price: "25,000",
    priceNote: "시트 형태별 호환 확인",
    badge: "4위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "시트편의",
    tags: ["장거리", "허리", "운전피로"],
    emoji: "🪑",
    affiliate: "https://link.coupang.com/a/eEjLevJk7w",
    keywords: ["요추", "허리", "시트 포지션", "착좌감", "운전 자세", "장거리 운전", "운전 피로", "장시간 운전", "승차감", "디스크"],
  },
  {
    rank: 5,
    id: "back-cushion",
    name: "통풍 등받이 쿠션",
    nameEn: "Back Support Cushion",
    description: "메쉬 통풍 구조로 등을 받쳐 시트 각도와 자세를 보완하는 등받이 쿠션.",
    price: "22,000",
    priceNote: "탈부착 밴드 고정식",
    badge: "5위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "시트편의",
    tags: ["등받이", "통풍", "자세보완"],
    emoji: "🛋️",
    affiliate: "https://link.coupang.com/a/eEjM9YRUm4",
    keywords: ["등받이", "등 쿠션", "허리 받침", "시트백", "장거리", "편안한 자세", "승차감", "통풍 시트"],
  },
  {
    rank: 6,
    id: "neck-rest",
    name: "헤드레스트 넥 받침대",
    nameEn: "Neck Rest Pillow",
    description: "헤드레스트에 장착하는 메모리폼 목 받침. 장거리·오토파일럿 주행 시 목 부담 완화.",
    price: "19,000",
    priceNote: "2개 세트 기준",
    badge: "6위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "시트편의",
    tags: ["목받침", "장거리", "휴식"],
    emoji: "💺",
    affiliate: "https://link.coupang.com/a/eEjRt0pAqq",
    keywords: ["넥레스트", "넥 받침", "목 받침", "목받침", "목 디스크", "헤드레스트", "뒷목", "졸음운전", "졸음", "오토파일럿", "자율주행"],
  },
  {
    rank: 7,
    id: "portable-charger",
    name: "휴대용 충전 어댑터 / V2L 멀티탭",
    nameEn: "Portable EV Charger / V2L Adapter",
    description: "비상 완속 충전과 V2L 외부 전원 활용. 캠핑·아웃도어에서 전기차를 발전기처럼.",
    price: "49,000",
    priceNote: "차종·콘센트 규격 확인 필요",
    badge: "7위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "충전",
    tags: ["V2L", "비상충전", "아웃도어"],
    emoji: "🔌",
    affiliate: "https://link.coupang.com/a/eEjYkPow0W",
    keywords: ["v2l", "휴대용 충전", "비상 충전", "충전 케이블", "충전 어댑터", "완속 충전", "이동식 충전", "가정용 충전", "아웃도어 전원", "캠핑 전원"],
  },
  {
    rank: 8,
    id: "camping-mattress",
    name: "차박 전용 에어 매트리스",
    nameEn: "Car Camping Air Mattress",
    description: "트렁크 풀플랫에 맞춘 차박 전용 에어매트리스. 차크닉·오토캠핑 필수.",
    price: "79,000",
    priceNote: "차종별 사이즈 확인",
    badge: "8위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "차박·캠핑",
    tags: ["차박", "캠핑", "풀플랫"],
    emoji: "🏕️",
    affiliate: "https://link.coupang.com/a/eEj3Yp6Ofk",
    keywords: ["차박", "캠핑", "에어 매트리스", "차량 숙박", "풀플랫", "차크닉", "오토캠핑", "캠핑카", "차량용 침대"],
  },
  {
    rank: 9,
    id: "winter-kit",
    name: "전기차 겨울 관리 세트",
    nameEn: "EV Winter Care Kit",
    description: "성에 제거기·도어 결빙 방지·차량용 무릎담요 등 겨울철 필수 용품 구성.",
    price: "29,000",
    priceNote: "구성은 판매처별 상이",
    badge: "9위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "계절용품",
    tags: ["겨울", "성에제거", "보온"],
    emoji: "❄️",
    affiliate: "https://link.coupang.com/a/eEkid6J0Ls",
    keywords: ["겨울", "결빙", "성에", "한파", "제설", "영하", "폭설", "눈길", "보온", "히트펌프", "난방", "주행거리 감소", "배터리 효율"],
  },
  {
    rank: 10,
    id: "kickguard",
    name: "2열 시트백 킥가드",
    nameEn: "Rear Seat Back Kick Guard",
    description: "가죽 소재 대형 사이즈. 아이들 발차기로부터 앞좌석 시트 완벽 보호.",
    price: "42,000",
    priceNote: "2피스 세트",
    badge: "10위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "시트보호",
    tags: ["가족", "어린이", "시트보호"],
    emoji: "👟",
    affiliate: "https://link.coupang.com/a/eEkmAeIrlI",
    keywords: ["어린이", "유아", "아기", "패밀리", "2열", "뒷좌석", "킥가드", "발차기", "카시트"],
  },
  {
    rank: 11,
    id: "pet-cover",
    name: "방수 펫 시트 커버",
    nameEn: "Pet Seat Cover",
    description: "해먹형 방수 시트커버로 반려동물 털·스크래치·오염으로부터 시트 보호.",
    price: "35,000",
    priceNote: "뒷좌석 전용",
    badge: "11위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "시트보호",
    tags: ["반려동물", "방수", "시트보호"],
    emoji: "🐶",
    affiliate: "https://link.coupang.com/a/eEkpFbnOW4",
    keywords: ["반려동물", "강아지", "고양이", "반려견", "반려", "펫 시트", "시트 오염", "산책", "애견"],
  },
  {
    rank: 12,
    id: "car-vacuum",
    name: "차량용 무선 청소기",
    nameEn: "Cordless Car Vacuum",
    description: "강력 흡입 무선 핸디 청소기. 차량 실내·시트 틈새 먼지를 손쉽게 관리.",
    price: "59,000",
    priceNote: "배터리 사양별 상이",
    badge: "12위",
    badgeColor: "bg-blue-600 text-white shadow-md",
    category: "관리·세차",
    tags: ["세차", "청소", "무선"],
    emoji: "🧹",
    affiliate: "https://link.coupang.com/a/eEks9UDJFA",
    keywords: ["세차", "청소", "클리닝", "먼지", "무선 청소기", "핸디 청소기", "진공청소기", "실내 관리", "유지비 절약"],
  },
];

export const COUPANG_PARTNERS_NOTICE =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

/**
 * 글 본문 텍스트(또는 키워드 모음)에서 트리거 키워드가 가장 많이 등장하는 상품을 추천.
 * @param {string} text - 글 제목+요약+본문 등을 합친 문자열
 * @param {number} count - 추천 개수 (기본 2)
 * @returns {Array} 추천 상품 배열. 본문 매칭이 부족하면 rank 순으로 폴백.
 */
export function pickProductsByText(text, count = 2) {
  const hay = (text || "").toLowerCase();
  const scored = SHOP_PRODUCTS.map((p) => {
    const score = p.keywords.reduce(
      (acc, kw) => acc + (hay.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    return { product: p, score };
  });
  scored.sort((a, b) => b.score - a.score || a.product.rank - b.product.rank);

  const picked = scored.filter((x) => x.score > 0).slice(0, count).map((x) => x.product);

  // 본문 매칭이 count 미만이면 rank 낮은 베스트 상품으로 채움(맥락 매칭 우선 + 랭킹 폴백)
  if (picked.length < count) {
    const have = new Set(picked.map((p) => p.id));
    for (const p of [...SHOP_PRODUCTS].sort((a, b) => a.rank - b.rank)) {
      if (picked.length >= count) break;
      if (!have.has(p.id)) {
        picked.push(p);
        have.add(p.id);
      }
    }
  }
  return picked;
}
