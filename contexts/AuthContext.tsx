"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  credits: number;
  deductCredit: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(5); // Default credits for now
  const router = useRouter();
  const pathname = usePathname();

  const deductCredit = () => {
    setCredits((prev) => Math.max(0, prev - 1));
  };

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Protect Routes
  useEffect(() => {
    if (loading) return;

    // Define public routes that don't require authentication
    const publicRoutes = ["/login", "/signup"]; 
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

    if (!user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, credits, deductCredit, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
