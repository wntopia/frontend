import {
  API_PATHS,
  apiFetch,
  type BacklinkResDto,
  type PageResDto,
} from "@/shared/api";

/**
 * 이 제목을 링크한 문서를 제목 순으로 한 페이지 받는다. 아직 없는 문서의 제목이어도 오류 없이 온다.
 * 로그인과 상관없는 조회라 서버에서도 쿠키 없이 부른다.
 */
export function fetchBacklinks(
  title: string,
  page: { page: number; size: number },
): Promise<PageResDto<BacklinkResDto>> {
  return apiFetch<PageResDto<BacklinkResDto>>(
    API_PATHS.articleBacklinks(title, page),
  );
}
