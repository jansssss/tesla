import "./globals.css";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";

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
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
