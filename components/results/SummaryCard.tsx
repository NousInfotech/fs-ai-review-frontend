import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function SummaryCard({ title, value, icon: Icon, color }: SummaryCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="audit-card rounded-xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-lg bg-gray-50">
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-[var(--color-text-secondary)] truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
