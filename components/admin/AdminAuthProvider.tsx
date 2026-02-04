"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { PlatformUser, AdminRole } from "@/types/admin";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface AdminAuthContextType {
  user: User | null;
  platformUser: PlatformUser | null;
  loading: boolean;
  role: AdminRole | null;
  isAuthorized: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  platformUser: null,
  loading: true,
  role: null,
  isAuthorized: false,
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const { data } = await api.get('/api/v1/admin/profile');
          setPlatformUser(data);
        } catch (error) {
          console.error("Failed to fetch admin profile", error);
          setPlatformUser(null);
        }
      } else {
        setPlatformUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isLoginPage = pathname === '/admin/login';
      
      if (!user && !isLoginPage) {
        router.push('/admin/login');
      } else if (user && !platformUser && !isLoginPage) {
        // User is logged in but not an admin
        // Redirect to login to show they are unauthorized (or sign them out)
        router.push('/admin/login');
      } else if (user && platformUser && isLoginPage) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, platformUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider 
      value={{ 
        user, 
        platformUser, 
        loading, 
        role: platformUser?.role || null,
        isAuthorized: !!platformUser 
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
