import type { NextConfig } from "next";
import { API_BASE_URL, API_PREFIX } from "./src/shared/api/base-url";

const nextConfig: NextConfig = {
  /**
   * 브라우저의 API 호출을 같은 오리진으로 받아 백엔드로 넘긴다.
   * 세션 쿠키가 프론트 도메인에 붙어야 서버 컴포넌트에서도 로그인 여부를 볼 수 있어서,
   * 백엔드를 직접 부르는(CORS) 대신 프록시를 택했다. 자세한 배경은 README 참고.
   */
  async rewrites() {
    return [
      {
        source: `${API_PREFIX}/:path*`,
        destination: `${API_BASE_URL}${API_PREFIX}/:path*`,
      },
    ];
  },
};

export default nextConfig;
