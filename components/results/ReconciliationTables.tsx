import { SectionD } from "@/types/review";
import { Table, TableProperties } from "lucide-react";

interface ReconciliationTablesProps {
  data: SectionD;
}

export default function ReconciliationTables({ data }: ReconciliationTablesProps) {
  const tableKeys = Object.keys(data.tables);
  if (tableKeys.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <TableProperties className="h-6 w-6 text-indigo-600 mr-2" />
        {data.title}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tableKeys.map((key) => {
          const table = data.tables[key];
          return (
            <div key={key} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 uppercase text-sm tracking-wide">
                {key.replace(/_/g, " ")}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      {table.columns.map((col, idx) => (
                        <th key={idx} scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.description}
                        </td>
                        {row.values.map((val, valIdx) => (
                          <td key={valIdx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                            {typeof val === 'number' ? val.toLocaleString() : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
