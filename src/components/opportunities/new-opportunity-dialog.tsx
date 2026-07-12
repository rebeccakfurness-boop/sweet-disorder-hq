"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies } from "@/lib/mock/companies";
import type { Opportunity } from "@/lib/types";

export function NewOpportunityDialog({
  defaultCompanyId,
  onCreate,
}: {
  defaultCompanyId?: string;
  onCreate: (opportunity: Opportunity) => void;
}) {
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState(defaultCompanyId ?? companies[0]?.id);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [owner, setOwner] = useState("Molly");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyId || !title.trim()) return;
    onCreate({
      id: `opp-${Date.now()}`,
      companyId,
      title: title.trim(),
      stage: "new",
      estimatedValue: Number(value) || 0,
      nextFollowUpDate: followUp || null,
      ownerName: owner,
      createdAt: new Date().toISOString(),
    });
    setOpen(false);
    setTitle("");
    setValue("");
    setFollowUp("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Opportunity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New opportunity</DialogTitle>
          <DialogDescription>Add a fresh lead to the pipeline. It&apos;ll land in New.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="opp-company">Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger id="opp-company">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp-title">Opportunity title</Label>
            <Input
              id="opp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring Stockist Order"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="opp-value">Estimated value (NZD)</Label>
              <Input
                id="opp-value"
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="1200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opp-followup">Next follow-up</Label>
              <Input
                id="opp-followup"
                type="date"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opp-owner">Owner</Label>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger id="opp-owner">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Molly">Molly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add opportunity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
