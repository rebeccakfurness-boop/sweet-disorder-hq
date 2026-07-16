import { PageHeader } from "@/components/shared/page-header";
import { TrainingHub } from "@/components/training/training-hub";
import { isDatabaseConfigured } from "@/db";
import { trainingMock, trainingRepository } from "@/lib/training";

export default async function TrainingPage() {
  const modules = isDatabaseConfigured()
    ? await trainingRepository.listModules()
    : trainingMock.mockTrainingModules;
  const progress = isDatabaseConfigured()
    ? await trainingRepository.listProgress()
    : trainingMock.mockStaffTrainingProgress;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Training"
        description="Work through Sweet Disorder's training guides at your own pace, then let Molly know who's up to date."
      />
      <TrainingHub modules={modules} initialProgress={progress} staffRoster={trainingMock.trainingStaffRoster} />
    </div>
  );
}
