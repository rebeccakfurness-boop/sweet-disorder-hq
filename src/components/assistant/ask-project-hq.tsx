"use client";

import { useState } from "react";
import { Sparkles, Send, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const examplePrompts = [
  "Summarise this week's opportunities",
  "Which quotes haven't had a follow-up in 7+ days?",
  "What's blocking Harbour City Insurance?",
  "Draft a follow-up email to Bondi Tech Collective",
];

const cannedResponses: Record<string, string> = {
  "summarise this week's opportunities":
    "This week you've got 9 open opportunities worth roughly $32k in the pipeline. Three fresh leads just came in (Bondi Tech Collective, Salt & Sea Gifts, Great Southern Wholesale), and the Harbour City Insurance Christmas quote ($6,480) is your biggest one still awaiting a response.",
  "which quotes haven't had a follow-up in 7+ days?":
    "Paper & Twine's Mother's Day pre-order quote (SD-Q-2026-042) was sent on 5 July with no reply yet — that's 7 days and counting. Worth a quick nudge before it goes cold.",
  "what's blocking harbour city insurance?":
    "Nothing blocking, just waiting — you sent the Christmas gifting quote on 10 July and it's valid until 10 August. A friendly check-in around day 5–7 tends to convert well for this account.",
  "draft a follow-up email to bondi tech collective":
    "Hi Chloe, just checking in on the Client Onboarding Welcome Jars proposal — happy to tweak quantities or flavours if the team wants something different. Let me know if a quick call this week suits! — Molly",
};

function getResponse(input: string) {
  const key = input.trim().toLowerCase();
  return (
    cannedResponses[key] ??
    "Good question — full AI integration is coming soon. For this demo, try one of the example prompts above to see what Project HQ's assistant will be able to do."
  );
}

export function AskProjectHQ() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the Project HQ assistant. Ask me about opportunities, quotes, or follow-ups — try one of the prompts below to get started.",
    },
  ]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: getResponse(text) },
    ]);
    setInput("");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Ask Project HQ
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Ask Project HQ
          </SheetTitle>
          <SheetDescription>Your AI assistant across the whole business, on call.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex gap-2.5", message.role === "user" && "flex-row-reverse")}
            >
              {message.role === "assistant" ? (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about opportunities, quotes, follow-ups…"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
