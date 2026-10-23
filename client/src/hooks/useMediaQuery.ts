import { useEffect, useState } from "react";

/** SSR 안전한 matchMedia 훅. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** 관리자 콘솔: 1200px 미만이면 레일 사이드바 + 좁은 레이아웃. */
export function useIsNarrow(): boolean {
  return useMediaQuery("(max-width: 1199px)");
}
