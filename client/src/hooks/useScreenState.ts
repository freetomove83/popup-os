export type ScreenState = "default" | "empty" | "loading" | "error";

/**
 * 목데이터 프론트 단계에서 화면 상태를 URL 로 강제하기 위한 훅.
 * `?state=empty|loading|error` 로 진입하면 해당 분기를 렌더한다. (기본 default)
 */
export function useScreenState(): ScreenState {
  if (typeof window === "undefined") return "default";
  const v = new URLSearchParams(window.location.search).get("state");
  return v === "empty" || v === "loading" || v === "error" ? v : "default";
}
