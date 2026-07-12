"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 rounded-full bg-mustard/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-popover">
          <div className="mb-6 text-center">
            <h1 className="text-lg font-semibold text-foreground">Sign in to Project HQ</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Prescribing fun gifts for everyone — and the internal tools to run it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="molly@sweetdisorder.co.nz" defaultValue="molly@sweetdisorder.co.nz" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••••" defaultValue="chillpills123" />
            </div>
            <Button type="submit" className="w-full gap-1.5">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Internal tool for Sweet Disorder staff · Silverdale, NZ
        </p>
      </div>
    </div>
  );
}
