import { PageHeader } from "@/components/shared/page-header";
import { WholesaleOrderUploadForm } from "@/components/wholesale-orders/upload-form";

export default function WholesaleOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Wholesale Orders"
        description="Snap a photo of a paper wholesale order form and read it straight into Project HQ."
      />
      <WholesaleOrderUploadForm />
    </div>
  );
}
