import { AskProjectHQ } from "@/components/assistant/ask-project-hq";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-border bg-background/80 px-6 backdrop-blur print:hidden">
      <AskProjectHQ />
    </header>
  );
}
