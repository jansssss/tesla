import "./globals.css";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import SiteNav from "@/components/SiteNav";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingCalcButton from "@/components/FloatingCalcButton";

export const metadata = {
  title: "테슬라 얼마?",
  description: "테슬라 실구매가 및 월 납입금 계산기",
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
