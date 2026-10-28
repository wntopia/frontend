import type { NextConfig } from "next";
import {
  API_BASE_URL,
  API_PREFIX,
  OAUTH_REDIRECT_PATH,
  WS_PREFIX,
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
        // 실시간 공동편집 WebSocket. Next 서버는 바깥 주소로 가는 rewrites에 온 업그레이드 요청을 그대로 프록시한다
        // (문서화되지 않은 동작이라 Next를 올릴 때 다시 확인한다). 같은 오리진이라야 핸드셰이크에 세션 쿠키가 실린다.
        // 백엔드는 Origin 헤더를 검사하므로 프론트 오리진이 백엔드의 허용 목록(CORS 설정)에 있어야 한다.
        source: `${WS_PREFIX}/:path*`,
        destination: `${API_BASE_URL}${WS_PREFIX}/:path*`,
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
