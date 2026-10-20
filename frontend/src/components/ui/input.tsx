import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border-2 border-ink bg-white px-3 py-1 font-mono text-sm shadow-brutal-sm transition-shadow outline-none placeholder:text-muted-foreground/70 focus-visible:bg-yellow/15 focus-visible:shadow-brutal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red aria-invalid:bg-red/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
