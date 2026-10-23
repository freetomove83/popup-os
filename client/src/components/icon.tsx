import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof Lucide;

interface IconProps extends Omit<LucideProps, "ref" | "name"> {
  name: string;
}

/** 이름으로 lucide 아이콘을 렌더한다(목록 데이터에서 아이콘 이름을 문자열로 다루기 위함). */
export function Icon({ name, size = 16, className, strokeWidth = 2, ...rest }: IconProps) {
  const Cmp = (Lucide as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Cmp) {
    return <span style={{ width: size, height: size, display: "inline-block" }} aria-hidden="true" />;
  }
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...rest}
    />
  );
}
