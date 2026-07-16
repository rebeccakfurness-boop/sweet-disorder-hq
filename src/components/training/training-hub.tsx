"use client";

import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleWalkthrough } from "@/components/training/module-walkthrough";
import { MyTrainingList } from "@/components/training/my-training-list";
import { AdminProgressGrid } from "@/components/training/admin-progress-grid";
import type { StaffTrainingProgress, TrainingModule } from "@/lib/training/types";

const CURRENT_STAFF_KEY = "sweet-disorder-training-staff";

export function TrainingHub({
  modules,
  initialProgress,
  staffRoster,
}: {
  modules: TrainingModule[];
  initialProgress: StaffTrainingProgress[];
  staffRoster: readonly string[];
}) {
  const [currentStaff, setCurrentStaff] = useState<string>(staffRoster[0]);
  const [progress, setProgress] = useState<StaffTrainingProgress[]>(initialProgress);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(CURRENT_STAFF_KEY);
    if (saved && staffRoster.includes(saved)) setCurrentStaff(saved);
    // Only read the saved staff member once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStaffChange(next: string) {
    setCurrentStaff(next);
    window.localStorage.setItem(CURRENT_STAFF_KEY, next);
  }

  function handleModuleComplete(result: StaffTrainingProgress) {
    // Key on (staffName, moduleId), not id — a freshly-saved record gets a
    // new id (DB-generated, or the ephemeral fallback's), which never
    // matches a seeded mock row's id, so filtering by id alone would leave
    // the stale row behind alongside the new one.
    setProgress((prev) => [
      ...prev.filter((row) => !(row.staffName === result.staffName && row.moduleId === result.moduleId)),
      result,
    ]);
  }

  if (activeModule) {
    return (
      <ModuleWalkthrough
        module={activeModule}
        staffName={currentStaff}
        onExit={() => setActiveModule(null)}
        onComplete={handleModuleComplete}
      />
    );
  }

  const myProgress = progress.filter((row) => row.staffName === currentStaff);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Training as</span>
        <Select value={currentStaff} onValueChange={handleStaffChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {staffRoster.map((staff) => (
              <SelectItem key={staff} value={staff}>
                {staff}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="my-training">
        <TabsList>
          <TabsTrigger value="my-training">My Training</TabsTrigger>
          <TabsTrigger value="admin">Admin: All Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="my-training">
          <MyTrainingList modules={modules} progress={myProgress} onStart={setActiveModule} />
        </TabsContent>

        <TabsContent value="admin">
          <AdminProgressGrid modules={modules} progress={progress} staffRoster={staffRoster} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
