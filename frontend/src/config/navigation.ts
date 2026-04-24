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
  AlertTriangle,
  Hash,
  Box,
} from "lucide-react";

export const allNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Terminal", href: "/pos", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Sizes", href: "/sizes", icon: Ruler },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Warehouse },
  { name: "Bill Profit", href: "/reports/bill-profit", icon: ScrollText },
  { name: "Business P&L", href: "/reports/pnl", icon: PieChart },
  { name: "Item Performance", href: "/reports/item-profit", icon: TrendingUp },
  { name: "Stock Valuation", href: "/reports/stock-summary", icon: Warehouse },
  { name: "Low Stock", href: "/reports/low-stock", icon: AlertTriangle },
  { name: "Category Report", href: "/reports/category", icon: Layers },
  { name: "Batch Tracking", href: "/reports/batch", icon: Box },
  { name: "Serial Tracking", href: "/reports/serial", icon: Hash },
  { name: "Invoice Center", href: "/invoices", icon: ScrollText },
];

export const allBottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];
