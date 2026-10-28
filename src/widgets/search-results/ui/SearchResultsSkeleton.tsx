/** 결과 카드 자리. 카드 수는 화면을 대충 채울 만큼이면 된다. */
const CARD_COUNT = 3;

/** 검색 결과를 기다리는 동안 건수 줄과 결과 카드 자리를 잡아 둔다. */
export function SearchResultsSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">검색하는 중…</span>
      <Bar className="mb-6 h-5 w-44" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <div
            key={index}
            className="rounded-xl bg-surface px-5 py-4 elevate-1"
          >
            <Bar className="h-[22px] w-1/3" />
            <Bar className="mt-2 h-4 w-full" />
            <Bar className="mt-1.5 h-4 w-4/5" />
            <Bar className="mt-2.5 h-3.5 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** 움직임 줄이기를 켠 사용자에게는 깜빡이지 않는다. */
function Bar({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`block rounded-md bg-elevated motion-safe:animate-pulse ${className}`}
    />
  );
}
