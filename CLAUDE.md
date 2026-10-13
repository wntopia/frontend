@AGENTS.md

# 지무위키

교내 나무위키 서비스의 프론트엔드다. 학생·교사가 함께 문서를 쓰고 고치는 위키로,
문서 열람 / 검색 / 편집 / 편집역사(리비전) 화면을 갖는다.

## 지금 이 저장소의 상태 — 읽고 시작할 것

**디자인 시안을 화면으로 옮긴 단계에서, 백엔드를 하나씩 붙여 가는 중이다.**

- 백엔드와 연결된 것은 **로그인·세션뿐이다** (DataGSM OAuth). 문서·검색·편집 저장은 아직 없고,
  화면의 데이터는 여전히 각 슬라이스의 `model/mock.ts`에서 온다.
- 서비스 이름은 **지무위키**다. 화면에 보이는 학교 이름("금성고등학교", "금성고")은
  디자인 시안에 들어있던 **임시 문구**이며 실제 학교가 아니다. 문서 제목
  ("2026 체육대회", "방송부"), 사용자 이름, 조회수, 날짜도 전부 시안용 더미값이다.
  이걸 근거로 도메인 규칙을 추론하지 말 것.
- 상호작용도 대부분 시각적 상태만 있다 (예: 헤더 검색창은 입력이 되지 않는 표시용 상자).

즉 **구조와 스타일은 지켜야 할 것, 문자열과 데이터는 갈아끼울 것**으로 취급한다.

## 스택

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 — 설정 파일 없이 `src/app/globals.css`의 `@theme`에 토큰을 정의한다
- 폰트: Pretendard(본문, CDN) + JetBrains Mono(숫자·라벨, next/font)
- 라이트/다크 모드 — 기본은 다크. `<html>`의 `data-mode`로 전환하고 선택값은 `localStorage`에 저장한다

```
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # eslint
```

백엔드 주소는 `.env.local`의 `API_BASE_URL`로 준다 (`.env.example` 참고). 빌드할 때도 필요하다.

## 아키텍처 — FSD (Feature-Sliced Design)

`src/` 아래 레이어는 위에서 아래로만 의존한다. 역방향·같은 레이어 간 import 금지.

```
app/       Next.js 라우트. 페이지 파일은 views의 컴포넌트를 re-export만 한다
views/     한 화면 전체. 위젯을 배치하고 여백/레이아웃만 담당한다
widgets/   화면의 한 덩어리 (최근 변경, 헤더, 리비전 타임라인 …)
features/  사용자 동작 단위 (theme-switcher: 라이트/다크 전환, auth: 로그인·로그아웃·접근 제어)
entities/  도메인 단위 UI와 타입 (document: RecentChangeItem …, session: 로그인한 사용자)
shared/    어디서나 쓰는 것 (ROUTES, SidebarCard, WikiLink, Logo, api: 백엔드 호출)
```

슬라이스 구조는 `<슬라이스>/{ui,model,api}/` + 배럴 `index.ts`. `api`는 백엔드를 호출하는 함수 자리다.
슬라이스 밖에서는 반드시 배럴로만 import 한다 (`@/widgets/header`, `@/entities/document`).
슬라이스 안에서는 상대 경로를 쓴다 (`../model/mock`).

배럴의 유일한 예외는 **서버 전용 진입점 `server.ts`** 다. `next/headers`에 의존하는 코드는 클라이언트
번들에 들어갈 수 없어 배럴에 실을 수 없으므로 `@/shared/api/server`, `@/entities/session/server`,
`@/features/auth/server`처럼 따로 import 한다.

```tsx
// src/app/home/page.tsx — 라우트 파일은 이 이상 하지 않는다
import { HomePage } from "@/views/home";
export default HomePage;
```

## 라우팅

경로는 `src/shared/config/routes.ts`의 `ROUTES`로만 참조한다. 문자열 하드코딩 금지.

| 경로 | 화면 |
|---|---|
| `/` | 화면 목록 허브 (`views/screen-index`) — 초기 세팅용 임시 진입점 |
| `/home` | 홈 (최근 변경, 인기 문서, 위키 현황, 분류) |
| `/document` | 문서 상세 |
| `/search` | 검색 결과 |
| `/missing-document` | 미작성 문서 안내 화면 (404 핸들러가 아니다) |
| `/edit` | 문서 편집 |
| `/history` | 편집역사 |
| `/mypage` | 마이페이지 |
| `/signin` | 로그인. 실패하면 백엔드가 `?error&reason=…`을 붙여 이리로 돌려보낸다 |
| `/signin/callback` | 로그인 성공 후 착지 지점. 로그인 전에 보던 화면으로 곧바로 넘긴다 |

디자인에서 가져온 7개 화면이 모두 포팅되어 있다. 로그인 화면 둘은 시안 없이 만들었다.
홈이 `/`가 아니라 `/home`에 있는 것은 `/`를 화면 목록이 쓰고 있기 때문이며, 임시 배치다.

문서 라우트가 아직 `/document` 하나로 고정되어 있다는 점에 주의한다. 실제 위키라면
문서별 동적 경로가 필요하고, 지금 목 데이터의 `href`는 대부분 `#`이거나 이 고정 경로를 가리킨다.

`/api/v1/**`와 `/callback`은 Next 라우트가 아니다. `next.config.ts`의 rewrites가 백엔드로 넘기는 프록시 경로다. `/callback`은 DataGSM이 로그인 후 돌려보내는 주소(`OAUTH_REDIRECT_PATH`)로, 백엔드 callback으로 이어진다.

## 백엔드 연동과 인증

배경과 백엔드 쪽 설정값은 README에 있다. 코드를 쓸 때 지킬 것만 적는다.

- **백엔드 호출은 `shared/api`로만 한다.** 브라우저에서는 `apiFetch`(`@/shared/api`), 서버 컴포넌트에서
  현재 사용자로서 호출할 때는 `serverApiFetch`(`@/shared/api/server`). 경로는 `API_PATHS`로만 참조한다.
- **실패는 `ApiError`로 온다.** `isApiError(error, 404)`처럼 상태로 갈라 처리한다. 응답 타입은
  `shared/api/types.ts`에 백엔드 DTO와 같은 이름으로 둔다.
- **401은 화면에서 에러가 아니다.** 세션 조회(`entities/session`)는 401을 '비로그인'(`null`)으로 바꿔 준다.
- **로그인이 필요한 화면**은 view의 서버 컴포넌트 첫 줄에서 `await requireSession(ROUTES.xxx)`를 부른다
  (`views/edit`, `views/mypage` 참고). 레이아웃에서 검사하지 않는다 — 화면 이동 때 다시 실행되지 않는다.
- **헤더처럼 정적인 화면에 섞이는 곳**은 `useSession()`으로 브라우저에서 세션을 읽는다. 서버에서 읽으면
  그 화면 전체가 동적 렌더링이 된다.
- 로그인 시작은 `fetch`가 아니라 페이지 이동이다 (`SigninButton`). 복귀 주소는 외부 주소로 새지 않도록
  `sanitizeReturnTo`를 거친 것만 쓴다.
- `student`가 없는 계정(교사 등)도 로그인한 사용자다. 다만 백엔드의 문서 수정 API는 이런 계정에 401을 준다.

## 스타일 규칙

색은 `globals.css`의 토큰을 Tailwind 유틸로 쓴다 — `bg-bg`, `bg-surface`, `bg-surface-2`,
`bg-elevated`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`,
`text-accent`, `text-success`, `text-danger`, `text-on-accent`. 컴포넌트에 hex를 직접 쓰지 않는다.

`@theme`의 값이 다크 모드이고 `:root[data-mode="light"]` 블록이 같은 변수를 덮어써 라이트
모드가 된다. 색을 추가할 때는 **두 블록 모두**에 정의한다. 한쪽 모드에서만 보일 요소는
`light:` 커스텀 variant로 가른다 (예: `light:hidden`).

영역 구분은 테두리 대신 그림자 유틸로 한다 — `elevate-control`(입력창·보조 버튼),
`elevate-1`/`elevate-2`(카드 기본/hover), `elevate-3`(드롭다운), `elevate-inset`(에디터),
`elevate-header`(고정 헤더). 위키 링크 밑줄이나 목록 구분선처럼 의미가 있는 테두리만 남긴다.

`text-[13.5px]`, `rounded-[14px]` 같은 임의값이 많은 것은 시안 수치를 그대로 맞춘 결과다.
실수가 아니므로 임의로 반올림하지 않는다.

## 컴포넌트 관례

- **기본은 서버 컴포넌트.** `"use client"`는 실제 상태가 있는 파일에만 있다 (편집 화면 본체,
  문서 상단 내비, 리비전 카드, 테마 전환, 계정 버튼). 새로 붙일 때는 트리 최하단 컴포넌트에만 붙인다.
- **목 데이터는 슬라이스의 `model/mock.ts`에 격리한다.** 백엔드가 붙을 때 이 파일만 갈아끼우면
  되도록, UI 컴포넌트에 데이터 리터럴을 박지 않는다.
- **강조 위치는 데이터가 정한다.** 변경 요약(`ChangeSummarySegment`)과 검색 스니펫
  (`SnippetSegment`)은 문장을 조각 배열로 표현해 어디를 굵게/하이라이트할지 데이터가
  결정한다. 컴포넌트에서 문자열을 파싱하지 않는다.
- **주석은 한국어로, '무엇'이 아니라 '왜'를 적는다.** 기존 파일들이 그렇게 되어 있다.

## 디자인 원본

화면은 claude.ai 디자인 프로젝트의 `.dc.html` 시안에서 옮겨온 것이다 (DesignSync MCP).
시안과 달라 보이는 부분을 고칠 때는 원본을 먼저 확인한다.
