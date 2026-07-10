import "./globals.css";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import SiteNav from "@/components/SiteNav";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingCalcButton from "@/components/FloatingCalcButton";

export const metadata = {
  title: {
    default: "하우머치 테슬라 — 실구매가·월납입금 계산기",
    template: "%s | 하우머치 테슬라",
  },
  description: "테슬라 Model 3·Model Y 지역별 보조금 자동 적용 실구매가·월납입금 계산기. 전국 17개 시·도 보조금 최신 반영.",
  metadataBase: new URL("https://www.paytesla.kr"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <div className="bg-slate-900 px-4 py-1.5 text-center text-[11px] font-medium text-slate-300 md:text-xs">
          Tesla 비공식 독립 구매비용 계산 플랫폼 · 테슬라(Tesla, Inc.)와 공식 관계 없음
        </div>
        <SiteHeader />
        <SiteNav />
        <Breadcrumb />
        {children}
        <FloatingCalcButton />
        <Footer />
      </body>
    </html>
  );
}
