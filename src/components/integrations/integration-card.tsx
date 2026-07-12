"use client";

import { useState } from "react";
import { ShoppingBag, Landmark, Megaphone, FolderOpenDot, Printer, Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Integration } from "@/lib/types";
import { cn } from "@/lib/utils";

const tintClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  mustard: "bg-mustard/15 text-mustard-foreground",
  mint: "bg-mint/10 text-mint",
  muted: "bg-muted text-muted-foreground",
};

const integrationVisuals: Record<string, { icon: typeof ShoppingBag; tint: keyof typeof tintClasses }> = {
  shopify: { icon: ShoppingBag, tint: "mint" },
  xero: { icon: Landmark, tint: "mustard" },
  hubspot: { icon: Megaphone, tint: "primary" },
  "google-drive": { icon: FolderOpenDot, tint: "muted" },
  "oki-printer": { icon: Printer, tint: "primary" },
};

export function IntegrationCard({ integration }: { integration: Integration }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, tint } = integrationVisuals[integration.id] ?? { icon: Sparkles, tint: "primary" as const };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tintClasses[tint])}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{integration.name}</p>
              <p className="text-xs text-muted-foreground">{integration.category}</p>
            </div>
          </div>
          <Badge variant="muted" className="shrink-0">
            Not Connected
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <p className="text-sm leading-relaxed text-muted-foreground">{integration.description}</p>
          <ul className="mt-4 space-y-2">
            {integration.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                {capability}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-5 w-full" onClick={() => setOpen(true)}>
            Connect {integration.name}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {integration.name} is on the roadmap
            </DialogTitle>
            <DialogDescription>
              This connection isn&apos;t wired up in the demo yet, but the groundwork&apos;s ready — Project HQ&apos;s
              data model already knows exactly what it&apos;ll sync. Flip it on when you&apos;re ready to go live.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
