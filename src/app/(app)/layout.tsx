import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:pl-64 print:pl-0">
          <Topbar />
          <main className="mx-auto max-w-7xl px-6 py-8 print:max-w-none print:p-0">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
