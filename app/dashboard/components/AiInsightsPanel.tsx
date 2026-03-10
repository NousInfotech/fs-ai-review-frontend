"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Revenue Anomalies', value: 30, color: '#3b82f6' }, // blue-500
  { name: 'Missing Disclosures', value: 45, color: '#f59e0b' }, // amber-500
  { name: 'Accounting Standard Issues', value: 25, color: '#ef4444' }, // red-500
];

export default function AiInsightsPanel() {
  const insights = [
    "Revenue growth anomaly detected",
    "2 Reports missing key IFRS disclosures",
    "Minor accounting standard deviation"
  ];

  return (
    <div className="audit-card w-full p-6 h-full flex flex-col relative overflow-hidden">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-2">AI Insights Distribution</h2>
      
      {/* Chart Section */}
      <div className="h-44 w-full flex-shrink-0 -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={5}
              dataKey="value"
              animationBegin={200}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '13px', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* List Section */}
      <ul className="space-y-3 flex-1 flex flex-col justify-end mt-4 border-t border-slate-100 pt-4">
        {insights.map((insight, i) => (
          <motion.li 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.5 }}
            className="flex items-start gap-2.5 group"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125`} style={{ backgroundColor: data[i]?.color || '#cbd5e1' }}></div>
            <span className="text-sm font-medium text-slate-600 leading-snug group-hover:text-slate-800 transition-colors">{insight}</span>
          </motion.li>
        ))}
      </ul>
      
      {/* Subtle Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
