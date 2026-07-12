import { PageHeader } from "@/components/shared/page-header";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { integrations } from "@/lib/mock/integrations";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="What Project HQ connects to — today, and where we&apos;re taking it next."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
