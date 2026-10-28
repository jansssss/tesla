import NextLink from "next/link";

// next/link 기본값은 화면에 보이는 링크를 전부 미리 불러와(prefetch) 방문 1회에 CDN 요청이 ~200건까지 늘어난다.
// Vercel Hobby CDN 요청 한도(월 100만 건, 계정 공유)를 지키기 위해 기본값을 끈다.
// 꼭 필요한 링크만 prefetch 를 명시해서 켠다.
export default function Link({ prefetch = false, ...props }) {
  return <NextLink prefetch={prefetch} {...props} />;
}
