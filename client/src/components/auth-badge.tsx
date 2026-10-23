import { Badge } from "@/components/ui/badge";

/** 출퇴근 인증 방식 — 현장 매니저 QR 스캔이 기본(+선택 사진). GPS는 사용하지 않는다. */
export function AuthBadge({
  kind,
}: {
  kind?: "qr" | "qrphoto" | "manual";
}) {
  if (kind === "qrphoto")
    return (
      <Badge tone="success" icon="ShieldCheck">
        QR+사진
      </Badge>
    );
  if (kind === "qr")
    return (
      <Badge tone="success" icon="QrCode">
        QR 인증
      </Badge>
    );
  if (kind === "manual")
    return (
      <Badge tone="info" icon="UserCheck">
        매니저 확인
      </Badge>
    );
  return <Badge tone="neutral">미인증</Badge>;
}
