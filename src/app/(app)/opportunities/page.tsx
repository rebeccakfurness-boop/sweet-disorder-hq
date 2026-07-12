import { KanbanBoard } from "@/components/opportunities/kanban-board";

export default function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { company?: string };
}) {
  return <KanbanBoard defaultCompanyId={searchParams.company} />;
}
