import { Badge } from "@/components/ui/badge";
import type { WorkerFlags } from "@/data/workers";

export function WorkerBadges({ flags }: { flags: WorkerFlags }) {
  return (
    <>
      {flags.foreign && (
        <Badge tone="info" icon="Globe">
          외국인
        </Badge>
      )}
      {flags.verified && (
        <Badge tone="success" icon="BadgeCheck">
          검증 완료
        </Badge>
      )}
      {flags.newcomer && (
        <Badge tone="warning" icon="Sparkles">
          신규 · 검증 필요
        </Badge>
      )}
      {flags.caution && (
        <Badge tone="danger" icon="TriangleAlert">
          주의
        </Badge>
      )}
    </>
  );
}
