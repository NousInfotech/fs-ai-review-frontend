"use client";

import { usePathname, useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import { adminMenuItems } from "@/components/Sidebar";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";

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
  const { isAuthorized, loading, platformUser, signOut } = useAdminAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
    <PortalLayout
      menuItems={adminMenuItems}
      user={{
        displayName: platformUser?.name,
        email: platformUser?.role?.replace('_', ' ') + ' PORTAL'
      }}
      signOut={handleSignOut}
    >
      {children}
    </PortalLayout>
  );
}
