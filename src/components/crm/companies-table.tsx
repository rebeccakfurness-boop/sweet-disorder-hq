"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyTypeBadge } from "@/components/shared/status-badges";
import type { Company, CompanyType, Contact } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type FilterValue = CompanyType | "all";

export function CompaniesTable({ companies, contacts }: { companies: Company[]; contacts: Contact[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const matchesFilter = filter === "all" || company.type === filter;
      const matchesQuery = company.name.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [companies, filter, query]);

  function primaryContactFor(companyId: string) {
    return contacts.find((c) => c.companyId === companyId && c.isPrimary) ?? contacts.find((c) => c.companyId === companyId);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterValue)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="wholesale">Wholesale</TabsTrigger>
            <TabsTrigger value="retail_stockist">Retail Stockist</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies…"
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((company) => {
              const contact = primaryContactFor(company.id);
              return (
                <TableRow key={company.id} className="group">
                  <TableCell>
                    <Link href={`/crm/${company.id}`} className="block font-medium text-foreground hover:text-primary">
                      {company.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{company.website}</span>
                  </TableCell>
                  <TableCell>
                    <CompanyTypeBadge type={company.type} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {company.region}, {company.country === "New Zealand" ? "NZ" : "AU"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {contact ? (
                      <div>
                        <div className="text-foreground">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.title}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(company.lastActivityAt)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/crm/${company.id}`}>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No companies match your search.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
