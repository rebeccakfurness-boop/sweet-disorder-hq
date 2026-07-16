import {
  LayoutDashboard,
  Briefcase,
  Building2,
  KanbanSquare,
  FileText,
  Factory,
  Truck,
  Package,
  Camera,
  Plug,
  BookOpen,
  GraduationCap,
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
  { label: "Business Operations", href: "/business-operations", icon: Briefcase },
  { label: "Corporate CRM", href: "/crm", icon: Building2 },
  { label: "Opportunities", href: "/opportunities", icon: KanbanSquare },
  { label: "Quotes", href: "/quotes", icon: FileText },
  { label: "Wholesale Orders", href: "/wholesale-orders", icon: Camera },
  { label: "Production", href: "/production", icon: Factory },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Supplier Records", href: "/supplier-records", icon: Package },
  { label: "Knowledge Hub", href: "/knowledge", icon: BookOpen },
  { label: "Staff Training", href: "/training", icon: GraduationCap },
  { label: "Integrations", href: "/settings/integrations", icon: Plug },
];
