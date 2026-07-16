import { Info } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemsTab } from "@/components/supplier-records/items-tab";
import { SuppliersTab } from "@/components/supplier-records/suppliers-tab";

export default function SupplierRecordsPage() {
  return (
    <div>
      <PageHeader
        title="Supplier Records"
        description="Every item and supplier Sweet Disorder buys from — synced straight from the shared Google Sheet."
      />

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Not connected to Google Sheets yet — this is sample content shaped exactly like what will appear once the
          Sheet is connected in Integrations. Add or edit rows in the Sheet and the next sync picks them up
          automatically — nothing here needs typing twice.
        </p>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <ItemsTab />
        </TabsContent>
        <TabsContent value="suppliers">
          <SuppliersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
