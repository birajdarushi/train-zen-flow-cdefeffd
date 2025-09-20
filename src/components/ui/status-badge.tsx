import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 status-indicator",
  {
    variants: {
      variant: {
        operational: "border-operational bg-operational/20 text-operational",
        critical: "border-critical bg-critical/20 text-critical pulse-glow",
        warning: "border-warning bg-warning/20 text-warning",
        maintenance: "border-maintenance bg-maintenance/20 text-maintenance",
        delayed: "border-delayed bg-delayed/20 text-delayed",
        default: "border-muted bg-muted/20 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  );
}

export { StatusBadge, statusBadgeVariants };