import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Financial Review AI</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
