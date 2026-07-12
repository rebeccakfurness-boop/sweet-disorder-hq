import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileTypeIcon } from "@/components/knowledge/file-type-icon";
import type { KnowledgeDocument } from "@/lib/knowledge/types";
import { formatDate } from "@/lib/utils";

export function CategorySection({
  title,
  documents,
}: {
  title: string;
  documents: KnowledgeDocument[];
}) {
  if (documents.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          {title}
          <Badge variant="muted">{documents.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileTypeIcon fileType={document.fileType} className="shrink-0 text-muted-foreground" />
                    <span className="font-medium text-foreground">{document.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{document.ownerName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(document.lastModifiedAt)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name} in Google Drive`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
