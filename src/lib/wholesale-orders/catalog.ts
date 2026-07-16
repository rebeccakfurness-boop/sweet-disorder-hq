import { readFile } from "fs/promises";
import path from "path";

import type { WholesaleOrderRegion } from "./types";

// Raw shapes exactly as exported from the product spreadsheets — kept
// separate from the normalized shape below so updating prices/products just
// means dropping a new export over /data/catalog-{nz,aus}.json, no code
// changes.
interface RawCatalogEntryNZ {
  itemCode: string | null;
  barcode: string | null;
  description: string;
  variant: string;
  minOrderQty: number;
  wholesalePrice: number;
  rrp: number | null;
}

interface RawCatalogEntryAUS {
  itemCode: string | null;
  barcode: string | null;
  description: string;
  variant: string;
  minOrderQty: number;
  wholesalePriceAUD: number;
  totalInclFreightAUD: number;
  rrpAUD: number | null;
}

/** The shape the extraction prompt actually needs — itemCode, description, variant, unitPrice. */
export interface CatalogEntry {
  itemCode: string | null;
  description: string;
  variant: string;
  unitPrice: number;
}

const CATALOG_FILENAMES: Record<WholesaleOrderRegion, string> = {
  NZ: "catalog-nz.json",
  AUS: "catalog-aus.json",
};

async function readCatalogFile<T>(region: WholesaleOrderRegion): Promise<T[]> {
  const filePath = path.join(process.cwd(), "data", CATALOG_FILENAMES[region]);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

export async function loadCatalog(region: WholesaleOrderRegion): Promise<CatalogEntry[]> {
  if (region === "NZ") {
    const entries = await readCatalogFile<RawCatalogEntryNZ>(region);
    return entries.map((entry) => ({
      itemCode: entry.itemCode,
      description: entry.description,
      variant: entry.variant,
      unitPrice: entry.wholesalePrice,
    }));
  }

  const entries = await readCatalogFile<RawCatalogEntryAUS>(region);
  return entries.map((entry) => ({
    itemCode: entry.itemCode,
    description: entry.description,
    variant: entry.variant,
    unitPrice: entry.wholesalePriceAUD,
  }));
}
