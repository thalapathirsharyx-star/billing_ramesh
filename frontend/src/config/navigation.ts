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
  TrendingUp,
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
  { name: "Bill Profit", href: "/reports/bill-profit", icon: ScrollText },
  { name: "Business P&L", href: "/reports/pnl", icon: PieChart },
  { name: "Item Performance", href: "/reports/item-profit", icon: TrendingUp },
  { name: "Stock Valuation", href: "/reports/stock-summary", icon: Warehouse },
  { name: "Invoice Center", href: "/invoices", icon: ScrollText },
];

export const allBottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];
