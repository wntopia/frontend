# frontend

지무위키(교내 위키) 프론트엔드. 구조와 규칙은 [CLAUDE.md](./CLAUDE.md)에 있다.

## 실행

```bash
cp .env.example .env.local   # 백엔드 주소를 채운다
npm install
npm run dev
```

## 백엔드 연동

백엔드는 [`wntopia/gikipedia-server`](https://github.com/wntopia/gikipedia-server)이고,
호출 코드는 `src/shared/api`에 모여 있다.

| 환경 변수 | 설명 |
|---|---|
| `API_BASE_URL` | 백엔드 오리진 (예: `http://localhost:8080`). 서버 전용 값이며 **빌드 시점에도 필요하다** |

### 브라우저는 백엔드를 직접 부르지 않는다 (rewrites 프록시)

브라우저는 프론트 오리진의 `/api/v1/**`를 호출하고, `next.config.ts`의 `rewrites`가 이를
`API_BASE_URL`로 넘긴다. 백엔드를 직접 호출(CORS)하지 않고 프록시를 택한 이유는 다음과 같다.

- 백엔드 인증은 세션 쿠키다. 프록시를 거치면 쿠키가 **프론트 도메인**에 붙어, 서버 컴포넌트가
  요청 쿠키를 그대로 백엔드에 전달해 로그인 여부를 확인할 수 있다. 덕분에 편집·마이페이지 같은
  화면을 그리기 전에 서버에서 막을 수 있다.
- 직접 호출 방식은 프론트와 백엔드의 도메인이 다르면 Next 서버가 쿠키를 볼 수 없어 접근 제어를
  브라우저에서만 할 수 있고, 서드파티 쿠키 제한의 영향도 받는다.

호출 함수는 실행 위치에 따라 둘로 나뉜다.

| 함수 | import | 용도 |
|---|---|---|
| `apiFetch` | `@/shared/api` | 브라우저(프록시 경유, 쿠키 포함), 그리고 서버에서 로그인과 무관한 조회 |
| `serverApiFetch` | `@/shared/api/server` | 서버 컴포넌트에서 현재 사용자로서 호출 (요청 쿠키를 옮겨 싣는다) |

둘 다 the-sdk의 응답 봉투(`{ status, code, message, data }`)를 벗겨 `data`만 돌려주고,
2xx가 아니면 HTTP 상태를 담은 `ApiError`를 던진다. `isApiError(error, 404)`처럼 갈라 쓴다.

### 로그인이 동작하려면 백엔드 설정이 맞아야 한다

로그인은 `fetch`가 아니라 페이지 이동이다. 브라우저가 `/api/v1/oauth/datagsm/signin`(프록시)으로
이동하면 백엔드가 DataGSM으로 보내고, DataGSM은 로그인이 끝나면 `redirect_uri`로 돌려보낸다. 세션 쿠키가
프론트 도메인에 있으므로 **`redirect_uri`도 프론트 오리진이어야** 한다. 프론트는 `/callback`으로 돌아온
요청을 `code`·`state`째로 백엔드 callback에 넘긴다 (`next.config.ts`). 백엔드 도메인으로 돌려보내면
쿠키가 따라가지 않아 `OAuth state가 올바르지 않습니다`로 실패한다.

| 백엔드 환경 변수 | 값 |
|---|---|
| `DATAGSM_OAUTH_REDIRECT_URI` | `<프론트 오리진>/callback` — DataGSM 클라이언트에도 등록. 글자 하나까지 같아야 통과한다 |
| `DATAGSM_OAUTH_SCOPE` | 비워 두거나 `datagsm:self_read` |
| `DATAGSM_OAUTH_SUCCESS_REDIRECT_URI` | `/signin/callback` |
| `DATAGSM_OAUTH_FAILURE_REDIRECT_URI` | `/signin?error` (기본값 그대로) |

성공·실패 주소는 상대 경로라 브라우저가 프론트 오리진 기준으로 해석한다. 로그인 전에 보던 화면은
백엔드가 기억해 주지 않으므로 프론트가 `sessionStorage`에 맡겨 두었다가 `/signin/callback`에서 꺼내 이동한다.
