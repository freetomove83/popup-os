import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold whitespace-nowrap transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-brand hover:bg-brand-600",
        dark: "bg-ink text-white hover:bg-ink-2",
        outline:
          "bg-surface text-ink-2 border border-line-2 hover:bg-surface-2 hover:border-subtle",
        soft: "bg-secondary text-secondary-foreground hover:bg-brand-100",
        success: "bg-success-700 text-white hover:bg-[#055C38]",
        pop: "bg-pop text-ink hover:bg-[#F59100]",
        ghost: "bg-transparent text-ink-3 hover:bg-surface-3 hover:text-ink",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#B42318]",
      },
      size: {
        sm: "h-8 px-3 text-[12px] rounded-md gap-1.5",
        md: "h-10 px-4 text-[13px] rounded-lg gap-2",
        lg: "h-12 px-5 text-[15px] rounded-lg gap-2",
        xl: "h-14 px-6 text-[16px] rounded-[14px] gap-2.5",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: string;
  iconRight?: string;
  block?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      icon,
      iconRight,
      block,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconSize = size === "sm" ? 14 : size === "xl" || size === "lg" ? 18 : 16;
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          buttonVariants({ variant, size }),
          block && "w-full",
          loading && "cursor-wait",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Icon name="LoaderCircle" size={iconSize} className="animate-spin" />
        ) : icon ? (
          <Icon name={icon} size={iconSize} />
        ) : null}
        {children}
        {iconRight && !loading ? <Icon name={iconRight} size={iconSize} /> : null}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
