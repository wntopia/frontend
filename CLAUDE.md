@AGENTS.md

# G무위키

교내 나무위키 서비스의 프론트엔드다. 학생·교사가 함께 문서를 쓰고 고치는 위키로,
문서 열람 / 검색 / 편집 / 편집역사(리비전) 화면을 갖는다.

## 지금 이 저장소의 상태 — 읽고 시작할 것

**디자인 시안을 화면으로 옮긴 단계다. 아직 제품 내용이 아니다.**

- 백엔드·인증·실제 편집 기능이 없다. 모든 데이터는 각 슬라이스의 `model/mock.ts`에서 온다.
- 서비스 이름은 **G무위키**다. 화면에 보이는 학교 이름("금성고등학교", "금성고")은
  디자인 시안에 들어있던 **임시 문구**이며 실제 학교가 아니다. 문서 제목
  ("2026 체육대회", "방송부"), 사용자 이름, 조회수, 날짜도 전부 시안용 더미값이다.
  이걸 근거로 도메인 규칙을 추론하지 말 것.
- 상호작용도 대부분 시각적 상태만 있다 (예: 헤더 검색창은 입력이 되지 않는 표시용 상자).

즉 **구조와 스타일은 지켜야 할 것, 문자열과 데이터는 갈아끼울 것**으로 취급한다.

## 스택

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 — 설정 파일 없이 `src/app/globals.css`의 `@theme`에 토큰을 정의한다
- 폰트: Pretendard(본문, CDN) + JetBrains Mono(숫자·라벨, next/font)
- 다크 테마 전용 (`color-scheme: dark`)

```
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # eslint
```

## 아키텍처 — FSD (Feature-Sliced Design)

`src/` 아래 레이어는 위에서 아래로만 의존한다. 역방향·같은 레이어 간 import 금지.

```
app/       Next.js 라우트. 페이지 파일은 views의 컴포넌트를 re-export만 한다
views/     한 화면 전체. 위젯을 배치하고 여백/레이아웃만 담당한다
widgets/   화면의 한 덩어리 (최근 변경, 헤더, 리비전 타임라인 …)
entities/  도메인 단위 UI와 타입 (document: RecentChangeItem, SearchResultCard …)
shared/    어디서나 쓰는 것 (ROUTES, SidebarCard, WikiLink)
```

슬라이스 구조는 `<슬라이스>/{ui,model}/` + 배럴 `index.ts`.
슬라이스 밖에서는 반드시 배럴로만 import 한다 (`@/widgets/header`, `@/entities/document`).
슬라이스 안에서는 상대 경로를 쓴다 (`../model/mock`).

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

디자인에서 가져온 7개 화면이 모두 포팅되어 있다. 홈이 `/`가 아니라 `/home`에 있는 것은
`/`를 화면 목록이 쓰고 있기 때문이며, 임시 배치다.

문서 라우트가 아직 `/document` 하나로 고정되어 있다는 점에 주의한다. 실제 위키라면
문서별 동적 경로가 필요하고, 지금 목 데이터의 `href`는 대부분 `#`이거나 이 고정 경로를 가리킨다.

## 스타일 규칙

색은 `globals.css`의 토큰을 Tailwind 유틸로 쓴다 — `bg-bg`, `bg-surface`, `bg-surface-2`,
`bg-elevated`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`,
`text-accent`, `text-success`. 새 hex를 도입하기 전에 토큰이 있는지 먼저 확인한다
(미작성 문서의 붉은색처럼 토큰이 없는 1회성 색만 임의값을 쓴다).

`text-[13.5px]`, `rounded-[14px]` 같은 임의값이 많은 것은 시안 수치를 그대로 맞춘 결과다.
실수가 아니므로 임의로 반올림하지 않는다.

## 컴포넌트 관례

- **기본은 서버 컴포넌트.** `"use client"`는 실제 상태가 있는 3개 파일에만 있다. 새로 붙일
  때는 트리 최하단 컴포넌트에만 붙인다.
- **목 데이터는 슬라이스의 `model/mock.ts`에 격리한다.** 백엔드가 붙을 때 이 파일만 갈아끼우면
  되도록, UI 컴포넌트에 데이터 리터럴을 박지 않는다.
- **강조 위치는 데이터가 정한다.** 변경 요약(`ChangeSummarySegment`)과 검색 스니펫
  (`SnippetSegment`)은 문장을 조각 배열로 표현해 어디를 굵게/하이라이트할지 데이터가
  결정한다. 컴포넌트에서 문자열을 파싱하지 않는다.
- **주석은 한국어로, '무엇'이 아니라 '왜'를 적는다.** 기존 파일들이 그렇게 되어 있다.

## 디자인 원본

화면은 claude.ai 디자인 프로젝트의 `.dc.html` 시안에서 옮겨온 것이다 (DesignSync MCP).
시안과 달라 보이는 부분을 고칠 때는 원본을 먼저 확인한다.
