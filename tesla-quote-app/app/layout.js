import "./globals.css";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import SiteNav from "@/components/SiteNav";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingCalcButton from "@/components/FloatingCalcButton";

export const metadata = {
  title: {
    default: "테슬라 얼마? — 실구매가·월납입금 계산기",
    template: "%s | 테슬라 얼마?",
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
