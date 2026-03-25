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
  X,
  Settings2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code
} from "lucide-react";
import { TestCase } from "@/types/admin";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full h-full flex flex-col pt-2 pb-8 scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Settings2 className="w-8 h-8 text-blue-600" />
             AI Test Cases
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure validation rules, prompt templates, and system logic</p>
        </div>
        
        {canEdit && (
          <button 
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-bold gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            New Test Case
          </button>
        )}
      </div>

      <div className="audit-card flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>

        {/* Table — scroll horizontally when content is wider than the card */}
        <div className="overflow-x-auto min-w-0">
          <table className="min-w-[920px] w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Test Logic Identifier</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Functional Group</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Severity Impact</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Version Control</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Functional Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] sticky right-0 bg-slate-50/95 backdrop-blur-sm z-[2] shadow-[-8px_0_12px_-8px_rgba(15,23,42,0.08)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" strokeWidth={3} />
                    <p className="mt-4 text-slate-500 font-bold">Synchronizing validation rules...</p>
                  </td>
                </tr>
              ) : filteredCases?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                       <Search className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">No test cases found matching your search</p>
                  </td>
                </tr>
              ) : (
                filteredCases?.map((tc, idx) => (
                  <motion.tr 
                    key={tc._id} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group/row hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mr-4">
                           <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-blue-600 font-mono tracking-tighter">{tc.test_id}</div>
                          <div className="text-[13px] font-medium text-slate-500 max-w-[min(320px,55vw)] sm:max-w-md line-clamp-2 mt-0.5">{tc.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {tc.category?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border",
                        tc.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' :
                        tc.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      )}>
                        {tc.severity}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-400">
                      v{tc.version}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={cn(
                          "h-2.5 w-2.5 rounded-full mr-2.5 animate-pulse",
                          tc.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'
                        )} />
                        <span className={cn(
                          "text-xs font-black tracking-widest uppercase",
                          tc.enabled ? 'text-emerald-700' : 'text-slate-400'
                        )}>{tc.enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right align-middle sticky right-0 bg-white group-hover/row:bg-slate-50/50 z-[1] shadow-[-8px_0_12px_-8px_rgba(15,23,42,0.12)]">
                      <div className="flex justify-end gap-2">
                        <button title="View History" className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                          <History className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <>
                            <button 
                              onClick={() => handleToggleStatus(tc)}
                              title="Toggle Status" 
                              className={cn(
                                "w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl transition-all shadow-sm",
                                tc.enabled ? 'text-emerald-500 hover:text-emerald-600 hover:border-emerald-200' : 'text-slate-400 hover:text-emerald-500 hover:border-emerald-200'
                              )}
                              disabled={toggleStatusMutation.isPending}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openEditModal(tc)}
                              title="Edit" 
                              className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-[min(42rem,calc(100vw-2rem))] shadow-2xl relative z-10 border border-slate-100 overflow-y-auto overflow-x-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <Plus className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingCase ? 'Update Rule Logic' : 'New Validation Rule'}</h3>
                       <p className="text-slate-500 text-sm font-medium">Define logic templates for AI analysis</p>
                    </div>
                 </div>
                 <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Name</label>
                     <input
                       type="text"
                       required
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                       placeholder="e.g. Audit Report Compliance"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Logic ID</label>
                     <input
                       type="text"
                       required
                       value={formData.test_id}
                       onChange={(e) => setFormData({...formData, test_id: e.target.value})}
                       disabled={!!editingCase}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-60 font-mono"
                       placeholder="e.g. TC-001"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Functional Category</label>
                     <select
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                     >
                       {CATEGORY_OPTIONS.map(cat => (
                         <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                     <select
                       value={formData.severity}
                       onChange={(e) => setFormData({...formData, severity: e.target.value})}
                       className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                     >
                       {SEVERITY_OPTIONS.map(sev => (
                         <option key={sev} value={sev}>{sev}</option>
                       ))}
                     </select>
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Functional Description</label>
                   <textarea
                     required
                     rows={2}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                     placeholder="How does this rule help in auditing?"
                   />
                </div>

                <div className="space-y-1.5">
                   <div className="flex items-center justify-between px-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Logic Template (Prompt)</label>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg tracking-widest uppercase">
                         <Code className="w-3.5 h-3.5" />
                         Markdown Supported
                      </div>
                   </div>
                   <textarea
                     required
                     rows={6}
                     value={formData.promptTemplate}
                     onChange={(e) => setFormData({...formData, promptTemplate: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500/40 outline-none transition-all border-none"
                     placeholder="Enter the AI logic template..."
                   />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE RULE CONFIGURATION'}
                  </button>
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="py-4 px-8 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-200 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}