import { PageHeader } from "@/components/shared/page-header";
import { CompaniesTable } from "@/components/crm/companies-table";
import { companies, contacts } from "@/lib/mock";

export default function CrmPage() {
  return (
    <div>
      <PageHeader
        title="Corporate CRM"
        description="Every corporate, wholesale, and retail stockist relationship in one place."
      />
      <CompaniesTable companies={companies} contacts={contacts} />
    </div>
  );
}
