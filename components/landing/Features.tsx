import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  BarChart3, 
  Zap, 
  Lock 
} from "lucide-react";

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
    <div className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Powerful Capabilities</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need for a flawless audit
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Stop manually ticking and bashing. Let our AI handle the tedious verification so you can focus on strategic judgment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
