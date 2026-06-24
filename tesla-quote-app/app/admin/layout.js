// 관리자 페이지는 SiteHeader/SiteNav/Breadcrumb 없이 단독 레이아웃
// 검색엔진 색인 제외 — 관리자는 직접 URL 입력 또는 즐겨찾기로 접속
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
