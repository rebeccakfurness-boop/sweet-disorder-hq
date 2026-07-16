import { AskProjectHQ } from "@/components/assistant/ask-project-hq";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 print:hidden">
      <MobileNav />
      <AskProjectHQ />
    </header>
  );
}
