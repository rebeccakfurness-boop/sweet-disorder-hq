import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SupplierComplianceBadge } from "@/components/shared/status-badges";
import { suppliers } from "@/lib/mock/suppliers";
import { formatDate } from "@/lib/utils";

export default function SuppliersPage() {
  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Everyone who keeps the jars filled, labelled, and boxed."
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Compliance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{supplier.category}</TableCell>
                <TableCell className="text-sm">
                  <div className="text-foreground">{supplier.contactName}</div>
                  <div className="text-xs text-muted-foreground">{supplier.contactEmail}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(supplier.lastOrderDate)}
                </TableCell>
                <TableCell>
                  <SupplierComplianceBadge status={supplier.complianceStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
