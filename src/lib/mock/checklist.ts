import type { ProductionPriority, ProductionStaffMember } from "@/lib/types";

// A flat, ordered checklist per staff member — the floor-facing "what do I do
// next" view. Deliberately separate from the management-facing production
// jobs list. Maps to a future `checklist_items` table: staff_id, order,
// label, completed.
export interface ChecklistItem {
  id: string;
  staff: ProductionStaffMember;
  label: string;
  completed: boolean;
}

export interface ChecklistBoard {
  staff: ProductionStaffMember;
  jobName: string;
  batchCode: string;
  priority: ProductionPriority;
  estimatedFinishTime: string;
}

export const checklistBoards: Record<ProductionStaffMember, ChecklistBoard> = {
  Ange: {
    staff: "Ange",
    jobName: "Christmas Corporate Order",
    batchCode: "SD-2607-A",
    priority: "high",
    estimatedFinishTime: "2:30 PM",
  },
  Charlie: {
    staff: "Charlie",
    jobName: "Bulk Bullshit Blockers Run",
    batchCode: "SD-2607-G",
    priority: "high",
    estimatedFinishTime: "11:45 AM",
  },
};

export const checklistItems: ChecklistItem[] = [
  // Ange — Christmas Corporate Order, Chill Pills component (batch SD-2607-A)
  { id: "chk-ange-1", staff: "Ange", label: "Print Chill Pills labels (48)", completed: true },
  { id: "chk-ange-2", staff: "Ange", label: "Check labels for print quality", completed: true },
  { id: "chk-ange-3", staff: "Ange", label: "Apply labels to 48 empty jars", completed: true },
  { id: "chk-ange-4", staff: "Ange", label: "Fill jars with Chill Pills", completed: true },
  { id: "chk-ange-5", staff: "Ange", label: "Attach lids", completed: true },
  { id: "chk-ange-6", staff: "Ange", label: "Wipe jars clean", completed: false },
  { id: "chk-ange-7", staff: "Ange", label: "Place jars into QC area", completed: false },
  { id: "chk-ange-8", staff: "Ange", label: "Complete QC checklist", completed: false },
  { id: "chk-ange-9", staff: "Ange", label: "Pack 24 jars into Carton A", completed: false },
  { id: "chk-ange-10", staff: "Ange", label: "Pack 24 jars into Carton B", completed: false },
  { id: "chk-ange-11", staff: "Ange", label: "Move cartons to Dispatch shelf", completed: false },
  { id: "chk-ange-12", staff: "Ange", label: "Mark batch complete", completed: false },

  // Charlie — Bulk Bullshit Blockers Run (batch SD-2607-G)
  { id: "chk-charlie-1", staff: "Charlie", label: "Print Bullshit Blockers labels (150)", completed: true },
  { id: "chk-charlie-2", staff: "Charlie", label: "Apply labels to jars", completed: true },
  { id: "chk-charlie-3", staff: "Charlie", label: "Fill jars with Bullshit Blockers", completed: true },
  { id: "chk-charlie-4", staff: "Charlie", label: "Attach lids", completed: false },
  { id: "chk-charlie-5", staff: "Charlie", label: "Check seal on every jar", completed: false },
  { id: "chk-charlie-6", staff: "Charlie", label: "Bundle into wholesale cartons", completed: false },
  { id: "chk-charlie-7", staff: "Charlie", label: "Print courier labels", completed: false },
  { id: "chk-charlie-8", staff: "Charlie", label: "Attach courier labels", completed: false },
  { id: "chk-charlie-9", staff: "Charlie", label: "Stage cartons by dispatch door", completed: false },
  { id: "chk-charlie-10", staff: "Charlie", label: "Confirm order ready for collection", completed: false },
];
