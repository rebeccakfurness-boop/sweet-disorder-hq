export type CompanyType = "corporate" | "wholesale" | "retail_stockist";

export interface Contact {
  id: string;
  companyId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  region: string;
  country: "New Zealand" | "Australia";
  website?: string;
  notes: string;
  lastActivityAt: string;
}

export type OpportunityStage = "new" | "contacted" | "quoted" | "won" | "lost";

export interface Opportunity {
  id: string;
  companyId: string;
  title: string;
  stage: OpportunityStage;
  estimatedValue: number;
  nextFollowUpDate: string | null;
  ownerName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  basePrice: number;
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export interface QuoteLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  companyId: string;
  opportunityId: string | null;
  status: QuoteStatus;
  lineItems: QuoteLineItem[];
  discountPercent: number;
  subtotal: number;
  total: number;
  validUntil: string;
  createdAt: string;
}

export type ProductionStatus = "not_started" | "in_progress" | "qc_check" | "ready_to_dispatch";
export type ProductionPriority = "low" | "medium" | "high";

// Production staff are a fixed roster for now; swap for a `staff` table + FK
// once this is backed by a real database.
export type ProductionStaffMember = "Ange" | "Charlie";

export interface ProductionJob {
  id: string;
  opportunityId: string | null;
  companyName: string;
  jobName: string;
  productName: string;
  quantity: number;
  status: ProductionStatus;
  priority: ProductionPriority;
  assignedTo: ProductionStaffMember;
  estimatedDurationHours: number;
  dueDate: string;
  batchCode: string;
  bestBeforeDate: string;
}


export type SupplierCompliance = "compliant" | "needs_update";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactName: string;
  contactEmail: string;
  lastOrderDate: string;
  complianceStatus: SupplierCompliance;
}

export interface StaffTask {
  id: string;
  title: string;
  assignedTo: string;
  companyId: string | null;
  dueDate: string;
  completed: boolean;
}

export type IntegrationStatus = "not_connected" | "connected" | "coming_soon";

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  capabilities: string[];
}
