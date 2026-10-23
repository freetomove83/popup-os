/**
 * 개인 연락처 마스킹.
 * 워커는 연락처를 입력할 수 있지만, 검카드에는 마스킹되어 표시된다.
 * (연락은 플랫폼 안에서만 — 마스킹으로 외부 직접 연락을 차단)
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return "****";
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
}

export function maskHandle(value: string): string {
  const handle = value.startsWith("@") ? value.slice(1) : value;
  if (handle.length <= 2) return "@***";
  return `@${handle.slice(0, 2)}***`;
}

export function maskContact(
  type: "phone" | "instagram",
  value: string,
): string {
  return type === "phone" ? maskPhone(value) : maskHandle(value);
}

export const CONTACT_LABEL: Record<"phone" | "instagram", string> = {
  phone: "휴대폰",
  instagram: "인스타그램",
};
