import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-card ring-1 ring-black/5",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/sweet-disorder-logo.png"
        alt="Sweet Disorder"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority
      />
    </span>
  );
}

export function Logo({
  className,
  subline = "Project HQ",
  tone = "light",
  size = 40,
  stacked = false,
}: {
  className?: string;
  subline?: string | null;
  tone?: "light" | "dark";
  size?: number;
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        stacked && "flex-col gap-3 text-center",
        className
      )}
    >
      <LogoMark size={size} />
      {subline ? (
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            tone === "dark" ? "text-sidebar-foreground/60" : "text-muted-foreground"
          )}
        >
          {subline}
        </span>
      ) : null}
    </div>
  );
}
