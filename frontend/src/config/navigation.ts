import {
  LayoutDashboard,
  Settings,
  ScrollText,
  ShoppingCart,
  Shirt,
  Users,
  Warehouse,
  PieChart,
  Layers,
  Ruler,
} from "lucide-react";

export const allNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Terminal", href: "/pos", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Sizes", href: "/sizes", icon: Ruler },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Warehouse },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Invoice Center", href: "/invoices", icon: ScrollText },
];

export const allBottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];
