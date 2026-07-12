import { cn } from "@/lib/utils";

function CapsuleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="rotate(-45 16 16)">
        <rect x="6" y="11" width="20" height="10" rx="5" fill="currentColor" className="text-primary" />
        <path
          d="M11 11H21C23.7614 11 26 13.2386 26 16C26 18.7614 23.7614 21 21 21H11V11Z"
          fill="currentColor"
          className="text-mustard"
        />
        <rect x="6" y="11" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1" className="text-foreground/10" fill="none" />
        <line x1="16" y1="11" x2="16" y2="21" stroke="currentColor" strokeWidth="1" className="text-foreground/10" />
      </g>
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/5",
        className
      )}
    >
      <CapsuleMark className="h-5 w-5" />
    </div>
  );
}

export function Logo({
  className,
  subline = "Project HQ",
  tone = "light",
}: {
  className?: string;
  subline?: string | null;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-semibold tracking-tight",
            tone === "dark" ? "text-sidebar-foreground" : "text-foreground"
          )}
        >
          Sweet Disorder
        </span>
        {subline ? (
          <span
            className={cn(
              "text-[11px] font-medium uppercase tracking-wider",
              tone === "dark" ? "text-sidebar-foreground/50" : "text-muted-foreground"
            )}
          >
            {subline}
          </span>
        ) : null}
      </div>
    </div>
  );
}
