"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCompany, companyTypeLabels } from "@/lib/mock/companies";
import type { Company, CompanyType } from "@/lib/types";

export function CompanyCombobox({
  companies,
  value,
  onChange,
  onCompanyCreated,
}: {
  companies: Company[];
  value: string | undefined;
  onChange: (companyId: string) => void;
  onCompanyCreated: (company: Company) => void;
}) {
  const selected = companies.find((company) => company.id === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CompanyType>("corporate");
  const [newContact, setNewContact] = useState("");
  const [newRegion, setNewRegion] = useState("");

  useEffect(() => {
    setQuery(selected?.name ?? "");
  }, [selected?.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim();
  const filtered = companies.filter((company) =>
    company.name.toLowerCase().includes(trimmedQuery.toLowerCase())
  );
  const exactMatch = companies.some(
    (company) => company.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  function startCreating() {
    setNewName(trimmedQuery);
    setCreating(true);
  }

  function cancelCreating() {
    setCreating(false);
    setNewName("");
    setNewContact("");
    setNewRegion("");
    setNewType("corporate");
  }

  function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newName.trim()) return;

    const company: Company = {
      id: `co-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      region: newRegion.trim() || "Unknown",
      country: "New Zealand",
      notes: "",
      lastActivityAt: new Date().toISOString(),
    };
    addCompany(company, newContact);
    onCompanyCreated(company);
    onChange(company.id);
    setQuery(company.name);
    setOpen(false);
    cancelCreating();
  }

  return (
    <div ref={containerRef} className="relative">
      {!creating ? (
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search or add a company…"
              className="pl-8"
            />
          </div>
          {open ? (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-popover">
              <div className="max-h-56 overflow-y-auto p-1">
                {filtered.map((company) => (
                  <button
                    type="button"
                    key={company.id}
                    onClick={() => {
                      onChange(company.id);
                      setQuery(company.name);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <span className="truncate">{company.name}</span>
                    {company.id === value ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    ) : null}
                  </button>
                ))}
                {filtered.length === 0 ? (
                  <p className="px-2 py-3 text-center text-xs text-muted-foreground">No companies match.</p>
                ) : null}
              </div>
              {trimmedQuery && !exactMatch ? (
                <button
                  type="button"
                  onClick={startCreating}
                  className="flex w-full items-center gap-1.5 border-t border-border px-2 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create new company &ldquo;{trimmedQuery}&rdquo;
                </button>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">New company</p>
          <div className="space-y-1.5">
            <Label htmlFor="new-company-name">Company name</Label>
            <Input
              id="new-company-name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-company-type">Type</Label>
              <Select value={newType} onValueChange={(next) => setNewType(next as CompanyType)}>
                <SelectTrigger id="new-company-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(companyTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-company-region">Region</Label>
              <Input
                id="new-company-region"
                value={newRegion}
                onChange={(event) => setNewRegion(event.target.value)}
                placeholder="e.g. Auckland"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-company-contact">Primary contact name</Label>
            <Input
              id="new-company-contact"
              value={newContact}
              onChange={(event) => setNewContact(event.target.value)}
              placeholder="e.g. Jane Smith"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={cancelCreating}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleCreateSubmit}>
              Add company
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
