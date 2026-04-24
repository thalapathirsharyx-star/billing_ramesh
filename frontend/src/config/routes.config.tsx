import { lazy } from "react";

// Lazy-loaded components
export const Home = lazy(() => import("@/pages/public/Home"));
export const Login = lazy(() => import("@/pages/auth/Login"));
export const Signup = lazy(() => import("@/pages/auth/Signup"));
export const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
export const ForgotPassword = lazy(() => import("@/pages/auth/forgetpassword"));
export const ResetPassword = lazy(() => import("@/pages/auth/resetpassword"));

export const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
export const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
export const AdminUserForm = lazy(() => import("@/pages/admin/AdminUserForm"));
export const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
export const AdminAuditLog = lazy(() => import("@/pages/admin/AdminAuditLog"));
export const AdminErrorLog = lazy(() => import("@/pages/admin/AdminErrorLog"));

export const POSPage = lazy(() => import("@/pages/pos/POSPage"));
export const ProductsPage = lazy(() => import("@/pages/products/ProductsPage"));
export const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
export const InventoryPage = lazy(() => import("@/pages/inventory/InventoryPage"));
export const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
export const BusinessDashboard = lazy(() => import("@/pages/BusinessDashboard"));
export const InvoicesPage = lazy(() => import("@/pages/invoices/InvoicesPage"));
export const CategoriesPage = lazy(() => import("@/pages/inventory/CategoriesPage"));
export const SizesPage = lazy(() => import("@/pages/inventory/SizesPage"));

export const Settings = lazy(() => import("@/pages/Settings"));
