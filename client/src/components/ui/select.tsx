import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onChange,
  options,
  icon,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center h-10 rounded-lg border border-input bg-surface transition-colors",
        "focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/20",
        className,
      )}
    >
      {icon && (
        <Icon name={icon} size={15} className="text-muted-foreground ml-3 shrink-0" />
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none bg-transparent text-body text-ink outline-none flex-1 min-w-0 h-full pl-3 pr-8 cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="ChevronDown"
        size={16}
        className="text-muted-foreground absolute right-3 pointer-events-none"
      />
    </div>
  );
}
