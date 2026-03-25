"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Shield, 
  CheckCircle, 
  Loader2,
  UserPlus,
  Filter,
  MoreVertical,
  XCircle,
  ShieldCheck,
  Users
} from "lucide-react";
import { PlatformUser, AdminRole } from "@/types/admin";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const fetchUsers = async (): Promise<PlatformUser[]> => {
  const { data } = await api.get('/api/v1/admin/platform-users');
  return data;
};

export default function PlatformUsersPage() {
  const { role: myRole } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE" as AdminRole,
    active: true
  });

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['platformUsers'],
    queryFn: fetchUsers
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/admin/platform-users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformUsers'] });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingUser) {
        await api.patch(`/api/v1/admin/platform-users/${editingUser._id}`, data);
      } else {
        await api.post('/api/v1/admin/platform-users', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformUsers'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "EMPLOYEE",
      active: true
    });
  };

  const openModal = (user?: PlatformUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email,
        role: user.role || "EMPLOYEE",
        active: user.active !== undefined ? user.active : true
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const filteredUsers = users?.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const canManageUsers = myRole === 'SUPER_ADMIN';

  return (
    <div className="w-full h-full flex flex-col pt-2 pb-8 scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-blue-600" />
             Platform Users
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage internal team access, roles, and platform permissions</p>
        </div>
        
        {canManageUsers && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm font-bold gap-2 group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add New User
          </button>
        )}
      </div>

      <div className="audit-card overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                Filter
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">User Information</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Access Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Account Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Joined Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" strokeWidth={3} />
                    <p className="mt-4 text-slate-500 font-bold">Synchronizing user data...</p>
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                       <Search className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">No users matching "{searchTerm}"</p>
                    <p className="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user, idx) => (
                  <motion.tr 
                    key={user._id} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name || 'Unnamed User'}</div>
                          <div className="text-[13px] font-medium text-slate-500">{user.email || 'No Email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all",
                        user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        user.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      )}>
                        {user.role === 'SUPER_ADMIN' ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <Shield className="w-3 h-3 mr-1.5" />}
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {user.active ? (
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black tracking-widest uppercase">
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[10px] font-black tracking-widest uppercase">
                          <XCircle className="w-3 h-3 mr-1.5" /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-500">
                      {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      {canManageUsers && (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openModal(user)}
                            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.role !== 'SUPER_ADMIN' && (
                            <button 
                              onClick={() => handleDelete(user._id)}
                              className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <UserPlus className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                    <p className="text-slate-500 text-sm font-medium">Configure team access and permissions</p>
                 </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@vacei.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Access Level</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as AdminRole})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="EMPLOYEE">Primary Team Member</option>
                      <option value="ADMIN">System Administrator</option>
                      <option value="SUPER_ADMIN">Platform Owner (Super Admin)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input
                      type="checkbox"
                      id="active-toggle"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                    />
                    <label htmlFor="active-toggle" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Grant active account access</label>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-8">
                  <button 
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : editingUser ? 'UPDATE PERMISSIONS' : 'PROVISION USER'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-200 transition-all"
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
