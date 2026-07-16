import { google, type sheets_v4 } from "googleapis";

import { createOAuthClient } from "./oauth";

export function createSheetsClient(accessToken: string): sheets_v4.Sheets {
  const auth = createOAuthClient();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}

/**
 * A tab read as header row + data rows, turned into one object per row keyed
 * by a normalized version of its header cell (lowercased, spaces → underscores).
 * This is what makes "the Sheet is the source of truth" scale: Molly can add
 * columns or reorder them and the sync (src/lib/supplier-records/sync.ts)
 * keeps working off column names, not positions. Row 2 of the sheet is row
 * index 0 here; `rowNumber` is the real 1-based sheet row (header = row 1),
 * used as the stable identity for upserts.
 */
export interface SheetRow {
  rowNumber: number;
  values: Record<string, string>;
}

function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function readSheetTab(
  accessToken: string,
  spreadsheetId: string,
  tabName: string
): Promise<SheetRow[]> {
  const sheets = createSheetsClient(accessToken);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: tabName,
  });

  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row, index) => {
    const values: Record<string, string> = {};
    headers.forEach((header, columnIndex) => {
      if (!header) return;
      values[header] = (row[columnIndex] ?? "").toString().trim();
    });
    return { rowNumber: index + 2, values };
  });
}
