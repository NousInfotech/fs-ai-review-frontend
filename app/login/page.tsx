"use client";

import { useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const syncUserWithBackend = async (user: User) => {
    try {
      // Force token refresh to ensure we have a valid token before sync
      await user.getIdToken(true);
      
      await api.post('/users/sync', {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } catch (err) {
      console.error("Failed to sync user with backend", err);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserWithBackend(result.user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const userCredential = isSignUp 
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      
      await syncUserWithBackend(userCredential.user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Auth failed", err);
      let errorMessage = "Authentication failed.";
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') errorMessage = "Invalid email or password.";
      if (err.code === 'auth/user-not-found') errorMessage = "No user found with this email.";
      if (err.code === 'auth/email-already-in-use') errorMessage = "Email is already in use.";
      if (err.code === 'auth/weak-password') errorMessage = "Password too weak.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-slate-800 to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-800" />
        
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4"
          >
            <UserIcon className="w-6 h-6 text-gray-800" />
          </motion.div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            AI Financial Statement Review SaaS
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleEmailAuth}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-red-50 border border-red-200 p-4"
            >
              <p className="text-sm text-red-600 text-center">{error}</p>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Email address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                {isSignUp ? "Sign Up" : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-sm text-gray-400">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </button>
          </div> */}

        {/* <div className="mt-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-gray-900 hover:text-black transition-colors"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div> */}
      </motion.div>
    </div>
  );
}
