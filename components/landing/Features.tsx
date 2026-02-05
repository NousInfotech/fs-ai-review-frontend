"use client"
import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  BarChart3, 
  Zap, 
  Lock 
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";

const features = [
  {
    name: 'Automated Compliance Checks',
    description: 'Instantly verify financial statements against thousands of regulatory rules (IFRS, GAAP) and internal policies.',
    icon: ShieldCheck,
  },
  {
    name: 'Intelligent Discrepancy Detection',
    description: 'Identify arithmetic errors, casting issues, and inconsistencies across different sections of your reports.',
    icon: Search,
  },
  {
    name: 'Visual Evidence Mapping',
    description: 'Click on any finding to see exactly where it appears in the source document with bounding box highlights.',
    icon: FileCheck,
  },
  {
    name: 'Detailed Analytics Dashboard',
    description: 'Track pass rates, critical failure trends, and team performance over time with interactive charts.',
    icon: BarChart3,
  },
  {
    name: 'Lightning Fast Processing',
    description: 'Process hundreds of pages in seconds. Reduce audit time from days to minutes.',
    icon: Zap,
  },
  {
    name: 'Enterprise Security',
    description: 'Your financial data is encrypted at rest and in transit. SOC2 Type II certified infrastructure.',
    icon: Lock,
  },
];

export default function Features() {
  return (
    <div className="py-10 bg-(--landing-background) relative overflow-hidden" id="features">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mx-auto mb-10">
          <FadeIn>
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest">Powerful Capabilities</h2>
          </FadeIn>
          <TextReveal
            text="Everything you need for a flawless audit"
            as="h2"
            delay={0.2}
            className="mt-3 text-4xl font-medium text-(--landing-text-heading) sm:text-5xl tracking-tight"
          />
          <FadeIn delay={0.4}>
            <p className="mt-3 text-xl text-(--landing-text-gray) leading-relaxed">
              Stop manually ticking and bashing. Let our AI handle the tedious verification so you can focus on strategic judgment.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn 
              key={feature.name} 
              delay={0.1 * (index + 1)}
              direction="up"
              distance={20}
            >
              <div className="group h-full bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 hover:border-(--landing-primary-blue)/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-(--landing-icon-bg) flex items-center justify-center mb-6 group-hover:bg-(--landing-primary-blue)/10 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-(--landing-primary-blue)" />
                </div>
                <h3 className="text-2xl font-medium text-(--landing-text-heading) mb-4 group-hover:text-(--landing-primary-blue) transition-colors tracking-tight">
                  {feature.name}
                </h3>
                <p className="text-(--landing-text-gray) leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
