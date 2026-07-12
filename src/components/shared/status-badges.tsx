import { Badge } from "@/components/ui/badge";
import { companyTypeLabels } from "@/lib/mock/companies";
import { stageLabels } from "@/lib/mock/opportunities";
import { quoteStatusLabels } from "@/lib/mock/quotes";
import { productionStatusLabels } from "@/lib/mock/production";
import { supplierComplianceLabels } from "@/lib/mock/suppliers";
import type {
  CompanyType,
  OpportunityStage,
  QuoteStatus,
  ProductionStatus,
  SupplierCompliance,
} from "@/lib/types";

export function CompanyTypeBadge({ type }: { type: CompanyType }) {
  const variant = type === "corporate" ? "default" : type === "wholesale" ? "mustard" : "mint";
  return <Badge variant={variant}>{companyTypeLabels[type]}</Badge>;
}

export function StageBadge({ stage }: { stage: OpportunityStage }) {
  const variant =
    stage === "won" ? "mint" : stage === "lost" ? "destructive" : stage === "quoted" ? "default" : "muted";
  return <Badge variant={variant}>{stageLabels[stage]}</Badge>;
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const variant =
    status === "accepted" ? "mint" : status === "declined" ? "destructive" : status === "sent" ? "mustard" : "muted";
  return <Badge variant={variant}>{quoteStatusLabels[status]}</Badge>;
}

export function ProductionStatusBadge({ status }: { status: ProductionStatus }) {
  const variant =
    status === "ready_to_dispatch"
      ? "mint"
      : status === "qc_check"
        ? "default"
        : status === "in_progress"
          ? "mustard"
          : "muted";
  return <Badge variant={variant}>{productionStatusLabels[status]}</Badge>;
}

export function SupplierComplianceBadge({ status }: { status: SupplierCompliance }) {
  const variant = status === "compliant" ? "mint" : "destructive";
  return <Badge variant={variant}>{supplierComplianceLabels[status]}</Badge>;
}
