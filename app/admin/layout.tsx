"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { isAuthorized, loading } = useAdminAuth();

  // Note: loading is usually handled by AdminAuthProvider, but strictly safely check here
  if (loading) return null;

  if (isLoginPage) {
    if (isAuthorized) {
        return null; // Will redirect to dashboard
    }
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  if (!isAuthorized) {
      return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
