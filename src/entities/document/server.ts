import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { isApiError } from "@/shared/api";
import { serverApiFetch } from "@/shared/api/server";
import { fetchArticle, fetchArticleRevisions } from "./api/article";
import { fetchArticleRevision } from "./api/revision";

/**
 * 서버 컴포넌트에서 문서를 조회한다. 없는 문서면 404 화면으로 끝낸다.
 *
 * 화면과 `generateMetadata`가 같은 문서를 읽으므로 한 번의 렌더링 안에서는 백엔드를 한 번만 호출한다 —
 * 조회마다 조회수가 오르기 때문에 중복 호출은 낭비일 뿐 아니라 집계도 흐린다.
 *
 * `next/headers`에 의존해 클라이언트 번들에 들어갈 수 없으므로 배럴이 아니라
 * `@/entities/document/server`로 import 한다.
 */
export const getArticle = cache(async (articleId: number) => {
  try {
    return await fetchArticle(articleId, serverApiFetch);
  } catch (error) {
    if (isApiError(error, 404)) notFound();
    throw error;
  }
});

/** 서버 컴포넌트에서 리비전 목록을 한 페이지 조회한다. 없는 문서면 404 화면으로 끝낸다. */
export const getArticleRevisions = cache(
  async (articleId: number, page: number, size: number) => {
    try {
      return await fetchArticleRevisions(
        articleId,
        { page, size },
        serverApiFetch,
      );
    } catch (error) {
      if (isApiError(error, 404)) notFound();
      throw error;
    }
  },
);

/**
 * 서버 컴포넌트에서 특정 리비전 시점의 문서를 조회한다. 없는 문서이거나 없는 리비전이면 404 화면으로 끝낸다.
 * 화면과 `generateMetadata`가 같은 리비전을 읽으므로 한 번의 렌더링 안에서는 백엔드를 한 번만 호출한다.
 */
export const getArticleRevision = cache(
  async (articleId: number, revision: number) => {
    try {
      return await fetchArticleRevision(articleId, revision, serverApiFetch);
    } catch (error) {
      if (isApiError(error, 404)) notFound();
      throw error;
    }
  },
);
