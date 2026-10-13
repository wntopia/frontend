import type { NextConfig } from "next";
import {
  API_BASE_URL,
  API_PREFIX,
  OAUTH_REDIRECT_PATH,
} from "./src/shared/api/base-url";
import { API_PATHS } from "./src/shared/api/endpoints";

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
      {
        // DataGSM은 로그인 후 브라우저를 `<프론트 오리진>/callback`으로 돌려보낸다.
        // 로그인을 시작할 때 붙은 세션 쿠키와 함께 백엔드에 닿아야 state 검증을 통과하므로,
        // 쿼리(code·state)를 그대로 실어 백엔드 callback으로 넘긴다.
        source: OAUTH_REDIRECT_PATH,
        destination: `${API_BASE_URL}${API_PATHS.oauthCallback}`,
      },
    ];
  },
};

export default nextConfig;
