"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { flushSync } from "react-dom";
import { useSession } from "@/entities/session";
import { signinHref } from "@/features/auth";
import {
  useArticleFavorite,
  type FavoriteToggleResult,
} from "@/features/favorite-article";
import { ROUTES } from "@/shared/config";
import { copyDocumentLink } from "../model/copy-link";

/** 메뉴 항목. 시안의 크기·간격·hover는 그대로 두고 키보드 포커스 표시를 더했다. */
const ITEM =
  "w-full cursor-pointer rounded-[7px] px-[11px] py-[9px] text-left text-[13.5px] text-fg-muted hover:bg-hover focus-visible:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent aria-disabled:cursor-default aria-disabled:opacity-60";

/** 성공 알림이 보이는 시간. 실패는 읽고 다시 시도할 수 있도록 다른 곳을 누르거나 Esc를 누를 때까지 둔다. */
const SUCCESS_NOTICE_MS = 2500;

type Notice = { tone: "success" | "error"; text: string };

/**
 * 문서 상단의 케밥 메뉴. WAI-ARIA 메뉴 버튼 패턴을 따른다.
 *
 * - 열면 첫 항목(↑로 열면 끝 항목)에 포커스가 가고, ↑↓·Home·End로 옮긴다. Esc와 항목 선택은 메뉴를 닫고
 *   포커스를 트리거로 돌린다. Tab으로 벗어나거나 바깥을 누르면 닫힌다.
 * - 항목을 고르면 메뉴가 닫히므로 결과는 트리거 아래의 알림으로 알린다. 알림 자리는 늘 두어
 *   (`role="status"`) 화면 낭독기가 바뀐 글자를 읽게 한다.
 */
export function DocumentMenu({ articleId }: { articleId: number }) {
  const session = useSession();
  const favorite = useArticleFavorite(articleId);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<(Notice & { id: number }) | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const noticeCount = useRef(0);
  const triggerId = useId();
  const menuId = useId();

  const favoriteChecking =
    session.status === "loading" || favorite.state.status === "loading";
  const favorited =
    favorite.state.status === "ready" && favorite.state.favorited;
  const favoriteDisabled = favoriteChecking || favorite.pending;

  // 바깥을 누르면 닫는다. 포커스는 누른 곳으로 가도록 트리거로 되돌리지 않는다.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    if (notice.tone === "success") {
      const timer = setTimeout(() => setNotice(null), SUCCESS_NOTICE_MS);
      return () => clearTimeout(timer);
    }
    const dismiss = () => setNotice(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [notice]);

  function announce(next: Notice) {
    // 같은 글자를 다시 알릴 때도 화면 낭독기가 읽도록 매번 새 요소로 바꿔 끼운다.
    noticeCount.current += 1;
    setNotice({ ...next, id: noticeCount.current });
  }

  /**
   * 메뉴를 열려는 기색(포인터를 올리거나 포커스)이 보이면 즐겨찾기 상태를 미리 읽는다.
   * 문서를 열 때마다 읽지 않으면서도, 메뉴를 열었을 때는 대개 맞는 글자가 이미 보인다.
   *
   * 세션을 아직 확인하는 중이어도 읽는다. 기다렸다 읽으려면 세션이 정해지는 때를 따로 지켜봐야 하는데,
   * 백엔드는 비로그인에게 401 대신 `false`를 주므로 먼저 읽어도 틀린 값이 오지 않는다.
   */
  function prepareFavorite() {
    if (session.status !== "unauthenticated") favorite.load();
  }

  function menuItems() {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
  }

  function openMenu(focus: "first" | "last") {
    prepareFavorite();
    setNotice(null);
    // 숨겨 둔 메뉴는 포커스를 받지 못하므로, 보이게 그린 다음에 항목으로 옮긴다.
    flushSync(() => setOpen(true));
    const items = menuItems();
    items[focus === "first" ? 0 : items.length - 1]?.focus();
  }

  function closeMenu({ restoreFocus }: { restoreFocus: boolean }) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    // Enter·Space는 버튼의 클릭으로 들어온다.
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    openMenu(event.key === "ArrowDown" ? "first" : "last");
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = menuItems();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const last = items.length - 1;

    switch (event.key) {
      case "ArrowDown":
        items[current >= last ? 0 : current + 1]?.focus();
        break;
      case "ArrowUp":
        items[current <= 0 ? last : current - 1]?.focus();
        break;
      case "Home":
        items[0]?.focus();
        break;
      case "End":
        items[last]?.focus();
        break;
      case "Escape":
        closeMenu({ restoreFocus: true });
        break;
      case "Tab":
        // 항목은 탭 순서에 없으므로 트리거로 포커스를 돌려 두고, Tab은 브라우저에 맡겨 트리거 다음으로
        // 가게 한다. Shift+Tab은 트리거에서 멈춘다.
        closeMenu({ restoreFocus: true });
        if (event.shiftKey) event.preventDefault();
        return;
      case " ":
        // 링크는 Space로 눌리지 않고 페이지가 스크롤되므로, 버튼 항목처럼 누른 것으로 친다.
        if (!(document.activeElement instanceof HTMLAnchorElement)) return;
        document.activeElement.click();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  async function handleFavorite() {
    if (favoriteDisabled) return;
    // 닫기보다 먼저 시작한다 — 닫으며 트리거로 돌아간 포커스가 상태 읽기(prepareFavorite)를 부르기 전에
    // 진행 중 표시가 서 있어야 두 요청이 겹치지 않는다.
    const toggling = favorite.toggle();
    closeMenu({ restoreFocus: true });
    const result = await toggling;
    if (result) announce(describeFavoriteResult(result));
  }

  function handleCopyLink() {
    // 닫기보다 먼저 부른다 — 클릭 처리 중이어야 브라우저가 클립보드 쓰기를 허락한다.
    const copying = copyDocumentLink(articleId);
    closeMenu({ restoreFocus: true });
    void copying.then((copied) =>
      announce(
        copied
          ? { tone: "success", text: "링크를 복사했습니다." }
          : {
              tone: "error",
              text: "링크를 복사하지 못했습니다. 주소창의 주소를 복사해 주세요.",
            },
      ),
    );
  }

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label="문서 메뉴"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() =>
          open ? closeMenu({ restoreFocus: true }) : openMenu("first")
        }
        onKeyDown={onTriggerKeyDown}
        onPointerEnter={prepareFavorite}
        onFocus={prepareFavorite}
        className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[9px] bg-surface-2 text-fg-soft elevate-control transition hover:elevate-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
        <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
        <span className="h-[3.5px] w-[3.5px] rounded-full bg-current" />
      </button>

      {/* aria-controls가 가리킬 수 있도록 닫혀 있어도 그려 두고 숨긴다. */}
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        hidden={!open}
        onKeyDown={onMenuKeyDown}
        className="absolute right-0 top-11 z-[60] w-[210px] rounded-xl bg-surface-2 p-1.5 elevate-3"
      >
        {session.status === "unauthenticated" ? (
          // 누르자마자 DataGSM으로 넘기지 않고 로그인 화면을 거친다 — 헤더의 로그인 버튼과 같은 길이다.
          <Link
            role="menuitem"
            tabIndex={-1}
            href={signinHref(ROUTES.document(articleId))}
            onClick={() => closeMenu({ restoreFocus: false })}
            className={`${ITEM} flex items-center justify-between gap-2`}
          >
            즐겨찾기에 추가
            <span className="text-[11.5px] text-fg-subtle">로그인 필요</span>
          </Link>
        ) : (
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            aria-disabled={favoriteDisabled || undefined}
            onClick={handleFavorite}
            className={`${ITEM} block`}
          >
            {favoriteChecking
              ? "즐겨찾기 확인 중…"
              : favorited
                ? "즐겨찾기 해제"
                : "즐겨찾기에 추가"}
          </button>
        )}
        <button
          type="button"
          role="menuitem"
          tabIndex={-1}
          onClick={handleCopyLink}
          className={`${ITEM} block`}
        >
          링크 복사
        </button>
        <Link
          role="menuitem"
          tabIndex={-1}
          href={ROUTES.documentHistory(articleId)}
          onClick={() => closeMenu({ restoreFocus: false })}
          className={`${ITEM} block`}
        >
          편집 역사 전체 보기
        </Link>
        {/*
          시안의 '문서 신고'는 백엔드 API가 생길 때까지(wntopia/gikipedia-server#30) 숨긴다. 비활성으로 두면
          눌러도 아무 일이 없는 항목에 포커스가 멈추고, 언제 쓸 수 있는지도 알릴 수 없다.
        */}
      </div>

      <div role="status" className="absolute right-0 top-11 z-[60]">
        {notice && (
          <p
            key={notice.id}
            className={`flex w-max max-w-[260px] items-start gap-2 rounded-[9px] bg-surface-2 px-3 py-2 text-[12.5px] leading-[1.5] elevate-3 ${
              notice.tone === "error" ? "text-danger-fg" : "text-fg-muted"
            }`}
          >
            <span
              aria-hidden
              className={`mt-[6px] h-[7px] w-[7px] flex-shrink-0 rounded-full ${
                notice.tone === "error" ? "bg-danger" : "bg-success"
              }`}
            />
            {notice.text}
          </p>
        )}
      </div>
    </div>
  );
}

function describeFavoriteResult(result: FavoriteToggleResult): Notice {
  if (result.ok) {
    return {
      tone: "success",
      text: result.favorited
        ? "즐겨찾기에 추가했습니다."
        : "즐겨찾기에서 해제했습니다.",
    };
  }
  switch (result.reason) {
    case "signed-out":
      return {
        tone: "error",
        text: "로그인이 만료되어 즐겨찾기를 바꾸지 못했습니다. 다시 로그인해 주세요.",
      };
    case "not-found":
      return {
        tone: "error",
        text: "문서를 찾을 수 없어 즐겨찾기에 추가하지 못했습니다.",
      };
    case "failed":
      return {
        tone: "error",
        text: "즐겨찾기를 바꾸지 못했습니다. 잠시 후 다시 시도해 주세요.",
      };
  }
}
