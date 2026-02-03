import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning';
  description: string;
}

interface TestListProps {
  tests: TestResult[];
}

export default function TestList({ tests }: TestListProps) {
  return (
    <div className="audit-card rounded-xl overflow-hidden">
      <ul className="divide-y divide-[var(--color-border)]">
        {tests.map((test, index) => (
          <motion.li 
            key={test.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {test.status === 'passed' && <CheckCircle className="h-5 w-5 text-green-500 mr-3" />}
                  {test.status === 'failed' && <XCircle className="h-5 w-5 text-red-500 mr-3" />}
                  {test.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />}
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{test.name}</p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border 
                    ${test.status === 'passed' ? 'bg-green-50 text-green-700 border-green-200' : 
                      test.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-[var(--color-text-secondary)]">
                    {test.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
