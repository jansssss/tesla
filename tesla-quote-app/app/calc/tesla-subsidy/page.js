import { redirect } from "next/navigation";

// 대표 계산기 URL은 /subsidy 로 통일했다.
// 실사용 트래픽은 next.config.mjs의 301 리다이렉트가 처리하며,
// 이 컴포넌트는 정적 생성/직접 접근에 대한 백스톱 역할을 한다.
export default function TeslaSubsidyCalculatorPage() {
  redirect("/subsidy");
}
