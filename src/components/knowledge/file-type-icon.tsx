import { FileText, FileSpreadsheet, Presentation, FileImage, FileVideo, Folder, File } from "lucide-react";

import type { FileType } from "@/lib/knowledge/file-types";
import { cn } from "@/lib/utils";

const ICONS: Record<FileType, typeof FileText> = {
  doc: FileText,
  pdf: FileText,
  sheet: FileSpreadsheet,
  slide: Presentation,
  image: FileImage,
  video: FileVideo,
  folder: Folder,
  other: File,
};

export function FileTypeIcon({ fileType, className }: { fileType: FileType; className?: string }) {
  const Icon = ICONS[fileType];
  return <Icon className={cn("h-4 w-4", className)} />;
}
