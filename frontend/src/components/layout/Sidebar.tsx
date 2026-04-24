import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  Phone,
  PhoneCall,
  BarChart3,
  Puzzle,
  Settings, CreditCard, Users, ChevronLeft,
  ChevronRight,
  Crown,
  Server,
  Library,
  Target,
  Megaphone,
  Database,
  Box,
  Layers,
  ScrollText, Palette,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CommonService } from "@/service/commonservice.page";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { allNavigation, allBottomNav } from "@/config/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";

import { useBranding } from "@/lib/branding";

// Navigation moved to src/config/navigation.ts
 

export const getNavSections = (nav: any[], bottomNav: any[]) => [
  {
    label: "Platform",
    items: nav.filter(item => ["Dashboard", "Analytics", "Provider Analytics"].includes(item.name ?? ""))
  },
  {
    label: "POS & Billing",
    items: nav.filter(item => [
      "POS Terminal", "Products", "Categories", "Sizes", "Customers", "Inventory", "Invoice Center"
    ].includes(item.name ?? ""))
  },
  {
    label: "Financial Management",
    items: nav.filter(item => [
      "Bank Accounts", "Expense Master", "Expenses", "Customer Khata"
    ].includes(item.name ?? ""))
  },
  {
    label: "Analysis & Reports",
    items: nav.filter(item => [
      "Bill Profit", "Business P&L", "Item Performance", "Stock Valuation",
      "Low Stock", "Category Report", "Batch Tracking", "Serial Tracking"
    ].includes(item.name ?? ""))
  },
  {
    label: "Settings & Management",
    items: bottomNav.filter(item => [
      "Settings", "Workspace", "Organization", "Team & Roles", "User Roles", "White Label", "Security", "Billing", "Audit Logs"
    ].includes(item.name ?? ""))
  },
];

export const NavItem = ({ item, isActive, isCollapsed = false, isMobile = false }: { item: any; isActive: boolean; isCollapsed?: boolean; isMobile?: boolean }) => (
  <Link
    href={item.href}
    className={cn(
      "group flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 relative overflow-hidden",
      isActive
        ? "bg-[#31203d] text-[#E04FB2]"
        : "text-white/60 hover:bg-[#252541] hover:text-white",
      isCollapsed ? "justify-center" : "",
      isMobile ? "py-3 px-4" : ""
    )}
  >
    <item.icon
      className={cn(
        "shrink-0 transition-all duration-300",
        isActive
          ? "text-[#E04FB2] scale-110"
          : "text-white/40 group-hover:text-white group-hover:scale-110",
        isCollapsed ? "h-6 w-6" : "mr-3 h-4 w-4",
        isMobile ? "h-5 w-5 mr-4" : ""
      )}
    />
    {(!isCollapsed || isMobile) && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap capitalize"
      >
        {item.name}
      </motion.span>
    )}
    {isActive && (
      <motion.div
        layoutId="activeNav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=""
      />
    )}
    {isActive && (
      <div className="absolute inset-0 bg-primary/5 -z-10" />
    )}
  </Link>
);

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { settings } = useBranding();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navSections = getNavSections(allNavigation, allBottomNav);

  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const normalizedUserRole = user?.role?.toLowerCase()?.replace(/\s+/g, '_') || "";
      if (item.roles && !item.roles.includes(normalizedUserRole || "")) return false;
      return true;
    })
  })).filter(section => section.items.length > 0);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="flex h-screen flex-col  bg-[linear-gradient(180deg,#2a1e38,#291e38,#281d37,#271d37,#261d36,#251d35,#231c34,#1d1b2f,#1a1a2e)] backdrop-blur-xl pt-6 pb-4 relative transition-all duration-300 ease-in-out z-50"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-[#f0e8e2] dark:border-[#f0e8e2] bg-white/80 dark:bg-black/60 shadow-lg shadow-black/10 hover:bg-white dark:hover:bg-black z-50 backdrop-blur-md text-muted-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <Link href="/">
          <div className={cn("px-6 pb-6 flex items-center gap-3 border-[#f0e8e2] dark:border-[#f0e8e2]/10 cursor-pointer", isCollapsed && "px-4 justify-center")}>
            <div className="h-10 w-10 flex items-center justify-center shrink-0 bg-primary/10 rounded-xl text-primary">
              <ScrollText className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold bg-gradient-to-r from-white/90 to-white/40 bg-clip-text text-transparent font-display whitespace-nowrap"
              >
                {settings?.platformName || "Billing POS"}
              </motion.h1>
            )}
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto px-4 scrollbar-none pb-20">
          {filteredSections.map((section, idx) => (
            <div key={section.label} className={cn("mb-6", idx === 0 ? "" : "mt-8")}>
              {!isCollapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 mb-3 text-[15px]  font-black text-white/60"
                >
                  {section.label}
                </motion.h2>
              )}
              {isCollapsed && idx !== 0 && (
                <div className="mx-4 my-4 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location === item.href;
                  return isCollapsed ? (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        <div>
                          <NavItem item={item} isActive={isActive} isCollapsed={isCollapsed} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-white/80 backdrop-blur-md border-[#f0e8e2] text-foreground">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <NavItem key={item.name} item={item} isActive={isActive} isCollapsed={isCollapsed} />
                  );
                })}
              </nav>
            </div>
          ))}

          {user?.role === "super_admin" && (
            <>
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <Link
                href="/admin"
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 relative overflow-hidden",
                  "bg-blue-500 text-white hover:bg-blue-400 border-[#f0e8e2] shadow-[0_0_15px_rgba(236,72,153,0.1)]",
                  isCollapsed ? "justify-center" : "",
                )}
              >
                <Crown className={cn("shrink-0 text-white", isCollapsed ? "h-6 w-6" : "mr-3 h-5 w-5")} />
                {!isCollapsed && <span className="whitespace-nowrap">Admin Portal</span>}
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

// getTourIdForRoute moved to config/conciergeData.ts
