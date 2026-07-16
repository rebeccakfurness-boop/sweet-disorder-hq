export interface SupplierRecordSupplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  productsSupplied: string;
  notes: string;
  lastUpdated: string;
}

export interface SupplierRecordItem {
  id: string;
  name: string;
  category: string;
  supplierName: string;
  supplierContact: string;
  sku: string;
  costPrice: number | null;
  packSize: string;
  notes: string;
  lastUpdated: string;
}
