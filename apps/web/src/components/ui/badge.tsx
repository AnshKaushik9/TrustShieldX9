import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-text-primary hover:bg-surface-hover",
        secondary: "border-transparent bg-slate-700 text-text-primary hover:bg-slate-600",
        destructive: "border-transparent bg-red-900/50 text-danger-text hover:bg-red-900/70",
        success: "border-transparent bg-emerald-900/50 text-success-text hover:bg-emerald-900/70",
        warning: "border-transparent bg-amber-900/50 text-warning-text hover:bg-amber-900/70",
        outline: "text-text-primary border-border-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
