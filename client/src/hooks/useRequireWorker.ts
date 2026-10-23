import * as React from "react";
import { useLocation } from "wouter";

import { session } from "@/lib/api";

/** 로그인이 필요한 워커 화면 — 토큰이 없으면 로그인으로 보내고 돌아올 경로를 넘긴다. */
export function useRequireWorker(): boolean {
  const [loc, go] = useLocation();
  const ok = !!session.get("worker");
  React.useEffect(() => {
    if (!ok) go(`/worker/login?next=${encodeURIComponent(loc + window.location.search)}`);
  }, [ok, go, loc]);
  return ok;
}
