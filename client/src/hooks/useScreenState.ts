export type ScreenState = "default" | "empty" | "loading" | "error";

/**
 * 화면 상태 = 쿼리 상태(로딩/에러/빈 데이터)에서 계산한다.
 * 디자인 확인용으로 `?state=empty|loading|error` 를 붙이면 그 분기를 강제로 렌더한다.
 */
export function useScreenState(
  query?: { isLoading: boolean; isError: boolean },
  isEmpty = false,
): ScreenState {
  if (typeof window !== "undefined") {
    const v = new URLSearchParams(window.location.search).get("state");
    if (v === "empty" || v === "loading" || v === "error") return v;
  }
  if (!query) return "default";
  if (query.isLoading) return "loading";
  if (query.isError) return "error";
  return isEmpty ? "empty" : "default";
}
