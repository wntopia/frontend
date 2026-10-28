import Link from "next/link";
import type { BacklinkResDto, PageResDto } from "@/shared/api";
import { ROUTES } from "@/shared/config";

type BacklinksProps = {
  /** 역링크 첫 페이지. 불러오지 못했으면 `null` */
  backlinks: PageResDto<BacklinkResDto> | null;
};

/**
 * '이 문서를 링크한 문서' 카드.
 *
 * 시안은 오른쪽에 링크가 걸린 문단을 적지만 백엔드가 위치를 주지 않아 제목만 보인다.
 */
export function Backlinks({ backlinks }: BacklinksProps) {
  return (
    <div className="rounded-xl bg-surface px-5 py-[18px] text-left elevate-1">
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[.1em] text-fg-subtle">
        이 문서를 링크한 문서
      </div>
      {backlinks === null ? (
        <p className="py-2 text-[13.5px] text-fg-subtle">
          링크한 문서를 불러오지 못했습니다.
        </p>
      ) : backlinks.items.length === 0 ? (
        <p className="py-2 text-[13.5px] text-fg-subtle">
          아직 이 문서를 링크한 문서가 없습니다.
        </p>
      ) : (
        <>
          <div className="divide-y divide-divider">
            {backlinks.items.map((backlink) => (
              <Link
                key={backlink.id}
                href={ROUTES.document(backlink.id)}
                // 문서 화면은 그릴 때마다 문서를 조회하고 백엔드는 그 조회를 조회수로 센다. 미리 가져오기도
                // 화면을 그려 문서를 조회하므로, 켜 두면 이 화면을 열기만 해도 목록의 문서들 조회수가 오른다.
                prefetch={false}
                // 띄어쓰기 없이 긴 제목이 카드 밖으로 넘치지 않게 한다
                className="block py-2 text-[13.5px] text-fg-muted [overflow-wrap:anywhere] hover:text-fg-muted"
              >
                {backlink.title}
              </Link>
            ))}
          </div>
          {backlinks.totalElements > backlinks.items.length && (
            <div className="mt-2 font-mono text-[11.5px] text-fg-subtle">
              {`외 ${(backlinks.totalElements - backlinks.items.length).toLocaleString("ko-KR")}개 문서`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
