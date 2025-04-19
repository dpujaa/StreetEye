import * as React from "react"
import { cn } from "../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Setup variant styles
const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        outline: "border border-input bg-background text-foreground",
        destructive: "bg-destructive text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Extend props to accept `variant`
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Use variant in the component
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
