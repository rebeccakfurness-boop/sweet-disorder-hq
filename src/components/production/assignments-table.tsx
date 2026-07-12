import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductionStatusBadge, ProductionPriorityBadge } from "@/components/shared/status-badges";
import { productionJobs } from "@/lib/mock/production";
import { formatDate, initials } from "@/lib/utils";

export function AssignmentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Daily Production Assignments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Production Job</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Duration</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{job.jobName}</div>
                  <div className="text-xs text-muted-foreground">{job.productName}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.companyName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{initials(job.assignedTo)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{job.assignedTo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ProductionPriorityBadge priority={job.priority} />
                </TableCell>
                <TableCell>
                  <ProductionStatusBadge status={job.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {job.estimatedDurationHours}h
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(job.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
