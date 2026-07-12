import type { ProductionStaffMember } from "@/lib/types";

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

export const checklistFocus: Record<ProductionStaffMember, string> = {
  Ange: "Christmas Corporate Order",
  Charlie: "Bulk Bullshit Blockers Run",
};

export const checklistItems: ChecklistItem[] = [
  // Ange — Christmas Corporate Order (batch SD-2607-A)
  { id: "chk-ange-1", staff: "Ange", label: "Print labels — mixed assortment", completed: true },
  { id: "chk-ange-2", staff: "Ange", label: "Fill 350 jars — mixed assortment", completed: true },
  { id: "chk-ange-3", staff: "Ange", label: "Apply labels", completed: true },
  { id: "chk-ange-4", staff: "Ange", label: "QC batch SD-2607-A", completed: false },
  { id: "chk-ange-5", staff: "Ange", label: "Pack into corporate gift boxes", completed: false },
  { id: "chk-ange-6", staff: "Ange", label: "Move to dispatch", completed: false },

  // Charlie — Bulk Bullshit Blockers Run (batch SD-2607-G)
  { id: "chk-charlie-1", staff: "Charlie", label: "Print Bullshit Blockers labels", completed: true },
  { id: "chk-charlie-2", staff: "Charlie", label: "Fill 150 Bullshit Blockers jars", completed: true },
  { id: "chk-charlie-3", staff: "Charlie", label: "Apply labels", completed: false },
  { id: "chk-charlie-4", staff: "Charlie", label: "QC batch SD-2607-G", completed: false },
  { id: "chk-charlie-5", staff: "Charlie", label: "Pack wholesale order", completed: false },
  { id: "chk-charlie-6", staff: "Charlie", label: "Book courier pickup", completed: false },
];
