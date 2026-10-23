import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Laravel API 클라이언트. 개발 중엔 Vite 가 /api 를 8000 으로 프록시한다.
 * 관리자/워커 토큰을 따로 보관하고, 경로(/admin/*)로 어느 토큰을 쓸지 고른다.
 */
type Side = "admin" | "worker";

const KEY: Record<Side, string> = { admin: "popupos.admin", worker: "popupos.worker" };
const LOGIN: Record<Side, string> = { admin: "/admin/login", worker: "/worker/login" };

export const session = {
  get(side: Side): { token: string; name?: string } | null {
    try {
      const raw = localStorage.getItem(KEY[side]);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(side: Side, value: { token: string; name?: string }) {
    try {
      localStorage.setItem(KEY[side], JSON.stringify(value));
    } catch {
      /* 저장 불가(시크릿 모드 등) — 이번 탭에서만 유지 */
    }
  },
  clear(side: Side) {
    try {
      localStorage.removeItem(KEY[side]);
    } catch {
      /* noop */
    }
  },
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const side: Side = path.startsWith("/admin") ? "admin" : "worker";
  const token = session.get(side)?.token;
  const isForm = opts.body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: {
      Accept: "application/json",
      ...(opts.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isForm ? (opts.body as FormData) : opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 401 && token) {
    session.clear(side);
    window.location.assign(LOGIN[side]);
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = data.errors ? (Object.values(data.errors)[0] as string[])[0] : undefined;
    throw new ApiError(first ?? data.message ?? "요청을 처리하지 못했어요.", res.status);
  }
  return data as T;
}

/** GET 조회. path 가 null 이면 대기. */
export function useApi<T>(path: string | null) {
  return useQuery({
    queryKey: [path],
    queryFn: () => api<T>(path!),
    enabled: path !== null,
  });
}

/** 변경 요청 — 성공 시 모든 조회를 새로고침하고, 실패 메시지는 토스트로 보여준다. */
export function useAction<A = void, R = unknown>(
  fn: (arg: A) => Promise<R>,
  onDone?: string | ((result: R) => void),
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: result => {
      qc.invalidateQueries();
      if (typeof onDone === "string") toast.success(onDone);
      else onDone?.(result);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export const won = (n: number) => n.toLocaleString("ko-KR");
