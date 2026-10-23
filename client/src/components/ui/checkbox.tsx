import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  size = 18,
  className,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={v => onCheckedChange?.(v === true)}
      disabled={disabled}
      className={cn(
        "inline-grid place-items-center rounded-[5px] border shrink-0 border-line-2 bg-surface text-white",
        "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-45",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <CheckboxPrimitive.Indicator>
        <Icon name="Check" size={size - 6} strokeWidth={3.2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
