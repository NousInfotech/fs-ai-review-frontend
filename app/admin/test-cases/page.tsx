"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  Filter, 
  History, 
  Edit, 
  Power, 
  FileText,
  Loader2,
  X
} from "lucide-react";
import { TestCase } from "@/types/admin";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import api from "@/lib/api";

const fetchTestCases = async (): Promise<TestCase[]> => {
  const { data } = await api.get('/api/v1/admin/test-cases');
  return data;
};

const SEVERITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const CATEGORY_OPTIONS = [
  'AUDIT_REPORT', 
  'BALANCE_SHEET', 
  'INCOME_STATEMENT', 
  'GENERAL', 
  'NOTES_AND_POLICY', 
  'CROSS_STATEMENT', 
  'PRESENTATION'
];
const ACCOUNTING_STANDARD_OPTIONS = ["IFRS", "GAPSME"];

export default function TestCasesPage() {
  const { role } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const queryClient = useQueryClient();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<TestCase | null>(null);
  const [formData, setFormData] = useState<any>({
    test_id: '',
    name: '',
    description: '',
    promptTemplate: '',
    severity: 'MEDIUM',
    category: 'GENERAL',
    enabled: true,
    accountingStandard: 'GAPSME'
  });

  const { data: testCases, isLoading } = useQuery({
    queryKey: ['testCases'],
    queryFn: fetchTestCases
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await api.patch(`/api/v1/admin/test-cases/${id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newCase: any) => {
      await api.post('/api/v1/admin/test-cases', newCase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/api/v1/admin/test-cases/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCases'] });
      closeModal();
    }
  });

  const handleToggleStatus = (tc: TestCase) => {
    toggleStatusMutation.mutate({ id: tc._id, enabled: !tc.enabled });
  };

  const openCreateModal = () => {
    setEditingCase(null);
    setFormData({
      test_id: '',
      name: '',
      description: '',
      promptTemplate: '',
      severity: 'MEDIUM',
      category: 'GENERAL',
      enabled: true,
      accountingStandard: 'GAPSME'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tc: TestCase) => {
    setEditingCase(tc);
    setFormData({
      test_id: tc.test_id,
      name: tc.name || '',
      description: tc.description,
      promptTemplate: tc.promptTemplate || '',
      severity: tc.severity,
      category: tc.category,
      enabled: tc.enabled,
      accountingStandard: tc.applicableAccountingStandards?.[0] || 'GAPSME'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map singular UI fields to backend array fields
    const submissionData = {
      ...formData,
      applicableAccountingStandards: [formData.accountingStandard],
    };

    // Remove the temporary singular fields before sending to backend
    delete (submissionData as any).accountingStandard;

    if (editingCase) {
      updateMutation.mutate({ id: editingCase._id, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const canEdit = role === 'SUPER_ADMIN' || role === 'ADMIN';

  const filteredCases = testCases?.filter(tc => {
    const matchesSearch = (tc.test_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (tc.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || tc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-500 mt-1">Configure validation rules and logic</p>
        </div>
        
        {canEdit && (
          <button 
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Test Case
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="ALL">All Categories</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ver.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredCases?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No test cases found.
                  </td>
                </tr>
              ) : (
                filteredCases?.map((tc) => (
                  <tr key={tc._id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-indigo-600 font-mono">{tc.test_id}</div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">{tc.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tc.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tc.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        tc.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tc.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{tc.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${tc.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-700">{tc.enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="View History" className="text-gray-400 hover:text-gray-600 p-1">
                          <History className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <>
                            <button 
                              onClick={() => handleToggleStatus(tc)}
                              title="Toggle Status" 
                              className={`${tc.enabled ? 'text-green-600' : 'text-gray-400'} hover:text-green-700 p-1`}
                              disabled={toggleStatusMutation.isPending}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openEditModal(tc)}
                              title="Edit" 
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full z-[101] relative">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingCase ? 'Edit Test Case' : 'Create Test Case'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form id="testCaseForm" onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Test Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                      placeholder="e.g. Audit Report Compliance Check"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1">
                      <label htmlFor="test_id" className="block text-sm font-semibold text-gray-700">Test ID</label>
                      <input
                        type="text"
                        id="test_id"
                        required
                        value={formData.test_id}
                        onChange={(e) => setFormData({...formData, test_id: e.target.value})}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="e.g. TC-FIN-001"
                        disabled={!!editingCase}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                      >
                        {CATEGORY_OPTIONS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="severity" className="block text-sm font-semibold text-gray-700">Severity</label>
                      <select
                        id="severity"
                        value={formData.severity}
                        onChange={(e) => setFormData({...formData, severity: e.target.value})}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                      >
                        {SEVERITY_OPTIONS.map(sev => (
                          <option key={sev} value={sev}>{sev}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="accountingStandard" className="block text-sm font-semibold text-gray-700">Accounting Standard</label>
                      <select
                        id="accountingStandard"
                        value={formData.accountingStandard}
                        onChange={(e) => setFormData({...formData, accountingStandard: e.target.value as any})}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                      >
                        {ACCOUNTING_STANDARD_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      id="description"
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                      placeholder="Briefly describe what this test case validates..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="promptTemplate" className="block text-sm font-semibold text-gray-700">AI Instructions (Prompt Template)</label>
                    <textarea
                      id="promptTemplate"
                      required
                      rows={5}
                      value={formData.promptTemplate}
                      onChange={(e) => setFormData({...formData, promptTemplate: e.target.value})}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3.5 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm font-mono text-xs leading-relaxed transition-all"
                      placeholder="Enter the AI instructions or prompt template here..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="enabled"
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                      Enabled
                    </label>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  form="testCaseForm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}