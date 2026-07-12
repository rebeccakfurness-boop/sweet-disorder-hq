import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductionStatusBadge } from "@/components/shared/status-badges";
import { productionJobs } from "@/lib/mock/production";
import { formatDate } from "@/lib/utils";

export default function ProductionPage() {
  return (
    <div>
      <PageHeader
        title="Production"
        description="Won opportunities as they move through the workshop, from jars to dispatch."
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Batch Code</TableHead>
              <TableHead>Best Before</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium text-foreground">{job.companyName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.productName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.quantity}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{job.batchCode}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(job.bestBeforeDate)}</TableCell>
                <TableCell>
                  <ProductionStatusBadge status={job.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
