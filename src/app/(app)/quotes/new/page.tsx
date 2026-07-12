import { PageHeader } from "@/components/shared/page-header";
import { QuoteBuilderForm } from "@/components/quotes/quote-builder-form";

export default function NewQuotePage({
  searchParams,
}: {
  searchParams: { company?: string; opportunity?: string };
}) {
  return (
    <div>
      <PageHeader
        title="Quote Builder"
        description="Build a branded quote — bulk pricing kicks in automatically."
      />
      <QuoteBuilderForm
        defaultCompanyId={searchParams.company}
        defaultOpportunityId={searchParams.opportunity}
      />
    </div>
  );
}
