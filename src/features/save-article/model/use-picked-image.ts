import { useCallback, useEffect, useRef, useState } from "react";

/** 대표 이미지로 고른 파일과 미리보기용 `blob:` 주소 */
export type PickedImage = {
  file: File;
  previewUrl: string;
};

/**
 * 대표 이미지로 고른 파일을 들고 있는다.
 *
 * 미리보기 주소(`URL.createObjectURL`)는 해제하기 전까지 파일 내용을 메모리에 붙잡아 두므로,
 * 다른 파일로 바꾸거나 선택을 취소하거나 화면을 떠날 때 해제한다. 주소는 렌더링이 아니라 고르는 순간에
 * 만든다 — 렌더링 중에 만들면 다시 그릴 때마다 새 주소가 생기고 해제할 시점을 잡기 어렵다.
 */
export function usePickedImage() {
  const [image, setImage] = useState<PickedImage | null>(null);
  // 화면을 떠날 때 해제할 주소. state는 정리 함수에서 최신 값을 읽을 수 없어 ref에 함께 둔다.
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  /** 파일을 고르거나(`File`) 선택을 취소한다(`null`). */
  const pick = useCallback((file: File | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const next = file ? { file, previewUrl: URL.createObjectURL(file) } : null;
    urlRef.current = next?.previewUrl ?? null;
    setImage(next);
  }, []);

  return [image, pick] as const;
}
