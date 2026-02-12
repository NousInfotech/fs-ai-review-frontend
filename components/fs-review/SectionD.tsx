"use client";

import { ReconciliationTable } from "@/types/review";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/utils";

function formatValue(value: number | string | null) {
  if (value === null || value === undefined) return "-";

  // Auto-detect formatting for numbers
  if (typeof value === "number") {
    const style =
      value < 0
        ? "text-red-600 font-medium"
        : value > 0
        ? "text-gray-900"
        : "text-gray-700";
    return <span className={style}>{value.toLocaleString()}</span>;
  }

  return value;
}

function ReconciliationTableView({ table }: { table: ReconciliationTable }) {
  if (!table?.rows?.length) {
    return (
      <div className="text-sm text-gray-500 px-3 py-4">
        No reconciliation data available.
      </div>
    );
  }

  return (
    <Card className="p-0 border shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md">
      <ScrollArea className="w-full">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              {Array.isArray(table.columns) && table.columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "p-3 font-semibold text-slate-700",
                    idx === 0 ? "text-left" : "text-right"
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table.rows.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  "border-b border-slate-100 transition-colors",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50",
                  "hover:bg-blue-50/50"
                )}
              >
                {Array.isArray(row) ? row.map((v, jdx) => (
                  <td key={jdx} className={cn("p-3", jdx === 0 ? "text-left font-medium text-slate-800" : "text-right")}>
                    {formatValue(v)}
                  </td>
                )) : (
                  <td colSpan={table.columns?.length || 1} className="p-3 text-right text-gray-400 italic">
                    Invalid row format
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  );
}

export default function SectionD({
  tables,
  content,
}: {
  tables: Record<string, ReconciliationTable>;
  content?: string;
}) {
  const safeTables = tables || {};

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-blue-700 tracking-tight">
          Reconciliation Tables
        </h2>
        {content && <p className="text-xs text-gray-500">{content}</p>}
      </div>

      <div className="space-y-10">
        {Object.entries(safeTables).map(([key, table]) => (
            <div key={key} className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 capitalize">
                    {table.title || key.replace(/_/g, " ")}
                </h3>
                <ReconciliationTableView table={table} />
            </div>
        ))}
      </div>
    </section>
  );
}
