import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Financial Review AI</span>
            </Link>
            <p className="text-gray-400 text-sm">
              The next generation of automated financial auditing and compliance verification.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Financial Review AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
