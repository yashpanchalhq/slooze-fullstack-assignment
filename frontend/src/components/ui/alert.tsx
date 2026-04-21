import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-sm transition-all duration-300 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-[#0d0d0d]/90 border-[#1a1a1a] text-[#fafafa] shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        destructive:
          "border-red-500/20 text-red-500 bg-red-500/5 shadow-[0_8px_30px_rgb(185,28,28,0.05)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  // Check if we have an icon as the first child
  const hasIcon = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type as any).displayName === 'Icon' || (child.type as any).name?.includes('Icon') || (child.type as any).displayName?.includes('Icon') || ['svg', 'AlertCircle', 'CheckCircle2', 'Info'].some(n => (child.type as any).name === n)
  );

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), "flex gap-3.5 items-start", className)}
      {...props}
    >
      {children}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-[0.9rem] mb-1.5", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[0.8rem] text-[#888] leading-relaxed font-medium", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-auto shrink-0", className)}
    {...props}
  />
))
AlertAction.displayName = "AlertAction"

export { Alert, AlertTitle, AlertDescription, AlertAction }
