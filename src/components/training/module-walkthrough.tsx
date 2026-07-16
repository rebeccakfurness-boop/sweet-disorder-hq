"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, ShieldAlert, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionContent } from "@/components/training/section-content";
import { burstCelebration } from "@/lib/confetti";
import { cn } from "@/lib/utils";
import type { StaffTrainingProgress, TrainingModule } from "@/lib/training/types";

type WalkthroughStep = { kind: "section"; index: number } | { kind: "quiz" } | { kind: "complete" };

async function saveProgress(input: {
  staffName: string;
  moduleId: string;
  status: "in_progress" | "completed";
  quizScore?: number | null;
  quizAttempts?: number;
}): Promise<StaffTrainingProgress | null> {
  try {
    const res = await fetch("/api/training/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.progress as StaffTrainingProgress;
  } catch {
    return null;
  }
}

export function ModuleWalkthrough({
  module,
  staffName,
  onExit,
  onComplete,
}: {
  module: TrainingModule;
  staffName: string;
  onExit: () => void;
  onComplete: (progress: StaffTrainingProgress) => void;
}) {
  const [step, setStep] = useState<WalkthroughStep>({ kind: "section", index: 0 });

  // Quiz round state — retrying only replays the questions answered wrong,
  // rather than restarting the whole module.
  const [roundIndices, setRoundIndices] = useState<number[]>(() => module.quizQuestions.map((_, i) => i));
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submittedRound, setSubmittedRound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [firstAttemptScore, setFirstAttemptScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    saveProgress({ staffName, moduleId: module.id, status: "in_progress" });
    // Only fire once when a walkthrough is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSteps = module.sections.length + 1;
  const currentStepNumber = step.kind === "section" ? step.index + 1 : totalSteps;
  const progressPercent = step.kind === "complete" ? 100 : (currentStepNumber / totalSteps) * 100;

  const incorrectThisRound = useMemo(() => {
    if (!submittedRound) return [];
    return roundIndices.filter((i) => selected[i] !== module.quizQuestions[i].correctAnswerIndex);
  }, [submittedRound, roundIndices, selected, module.quizQuestions]);

  function goToNextSection() {
    if (step.kind !== "section") return;
    if (step.index + 1 < module.sections.length) {
      setStep({ kind: "section", index: step.index + 1 });
    } else {
      setStep({ kind: "quiz" });
    }
  }

  function goToPreviousSection() {
    if (step.kind === "quiz") {
      setStep({ kind: "section", index: module.sections.length - 1 });
    } else if (step.kind === "section" && step.index > 0) {
      setStep({ kind: "section", index: step.index - 1 });
    }
  }

  function handleSubmitRound() {
    const incorrect = roundIndices.filter((i) => selected[i] !== module.quizQuestions[i].correctAnswerIndex);
    if (attempts === 0) {
      const correctCount = roundIndices.length - incorrect.length;
      setFirstAttemptScore(Math.round((correctCount / roundIndices.length) * 100));
    }
    setAttempts((a) => a + 1);
    setSubmittedRound(true);
  }

  async function handleContinueAfterRound() {
    if (incorrectThisRound.length === 0) {
      const score = firstAttemptScore ?? 100;
      setSaving(true);
      const saved = await saveProgress({
        staffName,
        moduleId: module.id,
        status: "completed",
        quizScore: score,
        quizAttempts: attempts,
      });
      setSaving(false);
      burstCelebration();
      setStep({ kind: "complete" });
      onComplete(
        saved ?? {
          id: `local-${staffName}-${module.id}`,
          staffName,
          moduleId: module.id,
          status: "completed",
          quizScore: score,
          quizAttempts: attempts,
          completedAt: new Date().toISOString(),
          trainerInitial: null,
        }
      );
      return;
    }
    setRoundIndices(incorrectThisRound);
    setSelected({});
    setSubmittedRound(false);
  }

  if (step.kind === "complete") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <PartyPopper className="h-10 w-10 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Nice work, {staffName}!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ve completed <span className="font-medium text-foreground">{module.title}</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-full bg-mint/10 px-3 py-1 font-medium text-mint">Passed</span>
            <span className="text-muted-foreground">
              First attempt score: <span className="font-medium text-foreground">{firstAttemptScore ?? 100}%</span>
            </span>
            <span className="text-muted-foreground">
              Attempts: <span className="font-medium text-foreground">{attempts}</span>
            </span>
          </div>
          <Button onClick={onExit} className="mt-2">
            Back to My Training
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit
        </Button>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {step.kind === "section" ? `Step ${currentStepNumber} of ${totalSteps}` : `Quiz — step ${totalSteps} of ${totalSteps}`}
        </span>
      </div>
      <Progress value={progressPercent} />

      {step.kind === "section" ? (
        <Card>
          <CardHeader>
            <CardTitle
              className={cn(
                "text-base font-semibold",
                module.sections[step.index].isKeyRule ? "text-primary" : "text-foreground"
              )}
            >
              {module.sections[step.index].isKeyRule ? (
                <span className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  {module.sections[step.index].heading}
                </span>
              ) : (
                module.sections[step.index].heading
              )}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={cn(
              module.sections[step.index].isKeyRule &&
                "rounded-lg border border-primary/30 bg-primary/5 py-4"
            )}
          >
            <SectionContent content={module.sections[step.index].content} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              {roundIndices.length === module.quizQuestions.length
                ? "Quick check"
                : `Retry: ${roundIndices.length} question${roundIndices.length === 1 ? "" : "s"} to get right`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {roundIndices.map((qIndex) => {
              const question = module.quizQuestions[qIndex];
              const answer = selected[qIndex];
              const isCorrect = submittedRound && answer === question.correctAnswerIndex;
              const isWrong = submittedRound && answer !== undefined && answer !== question.correctAnswerIndex;

              return (
                <div key={qIndex} className="space-y-2.5">
                  <p className="text-sm font-medium text-foreground">{question.question}</p>
                  <div className="space-y-1.5">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = answer === optionIndex;
                      const revealCorrect = submittedRound && optionIndex === question.correctAnswerIndex;
                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={submittedRound}
                          onClick={() => setSelected((prev) => ({ ...prev, [qIndex]: optionIndex }))}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                            !submittedRound && isSelected && "border-primary bg-primary/5",
                            !submittedRound && !isSelected && "border-border hover:bg-accent/50",
                            submittedRound && revealCorrect && "border-mint bg-mint/10 text-mint-foreground",
                            submittedRound && isSelected && !revealCorrect && "border-destructive bg-destructive/5",
                            submittedRound && !isSelected && !revealCorrect && "border-border opacity-60"
                          )}
                        >
                          {submittedRound && revealCorrect ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />
                          ) : submittedRound && isSelected ? (
                            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                          ) : (
                            <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
                          )}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {isCorrect || isWrong ? (
                    <p className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      {question.explanation}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousSection}
          disabled={step.kind === "section" && step.index === 0}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>

        {step.kind === "section" ? (
          <Button type="button" onClick={goToNextSection} className="gap-1.5">
            {step.index + 1 < module.sections.length ? "Next" : "Start quiz"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : !submittedRound ? (
          <Button
            type="button"
            onClick={handleSubmitRound}
            disabled={roundIndices.some((i) => selected[i] === undefined)}
          >
            Submit answers
          </Button>
        ) : (
          <Button type="button" onClick={handleContinueAfterRound} disabled={saving} className="gap-1.5">
            {incorrectThisRound.length === 0 ? "Finish" : "Retry incorrect questions"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
