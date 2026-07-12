import {
  LayoutDashboard,
  Building2,
  KanbanSquare,
  FileText,
  Factory,
  Truck,
  Plug,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Corporate CRM", href: "/crm", icon: Building2 },
  { label: "Opportunities", href: "/opportunities", icon: KanbanSquare },
  { label: "Quotes", href: "/quotes", icon: FileText },
  { label: "Production", href: "/production", icon: Factory },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
];
