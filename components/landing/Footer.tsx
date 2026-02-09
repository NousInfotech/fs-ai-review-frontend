import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--landing-footer-hero-bg) text-white border-t border-white/10">
      <div className="mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo & Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="#hero" className="flex items-center gap-2 group w-fit">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image 
                  src="/images/Logo.png" 
                  alt="Financial Review AI Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-medium tracking-tight group-hover:text-blue-400 transition-colors">
                Financial Review AI
              </span>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              The next generation of automated financial auditing. 
              Built for forward-thinking firms to ensure 100% compliance and deterministic accuracy.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors text-base font-medium">Features</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-base font-medium">How it Works</Link></li>
              <li><Link href="#registry" className="text-gray-400 hover:text-white transition-colors text-base font-medium">MBR Registry</Link></li>
              <li><Link href="#pricing" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Pricing</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Support</h3>
            <ul className="space-y-4">
              <li><Link href="#faq" className="text-gray-400 hover:text-white transition-colors text-base font-medium">FAQ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-base font-medium">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-base font-medium">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-base font-medium">Contact Us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Newsletter</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Get the latest updates on AI in auditing and regulatory compliance.
            </p>
            <form className="relative flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button className="absolute right-2 p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {currentYear} Financial Review AI. All rights reserved.
          </p>
          <div className="flex items-center gap-8 whitespace-nowrap">
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors font-medium">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors font-medium">Terms of Service</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors font-medium">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
