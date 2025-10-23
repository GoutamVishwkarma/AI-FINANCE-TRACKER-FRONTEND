'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/layout/main-nav';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { AddIncomeModal } from '@/components/modals/add-income-modal';
import { ConfirmDialog } from '@/components/modals/confirm-dialog';
import { incomeApi } from '@/lib/api';
import { Plus, Calendar, DollarSign, Tag, TrendingUp, Loader2, AlertCircle, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Income {
  _id: string;
  userId: string;
  source: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      const data = await incomeApi.getAll();
      setIncomes(data);
    } catch (error: any) {
      toast.error('Failed to fetch income data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDeleteClick = (id: string) => {
    setIncomeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return;
    
    try {
      setDeletingId(incomeToDelete);
      await incomeApi.delete(incomeToDelete);
      toast.success('Income deleted successfully!');
      setShowDeleteConfirm(false);
      setIncomeToDelete(null);
      fetchIncomes();
    } catch (error: any) {
      toast.error('Failed to delete income');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      toast.loading('Preparing Excel file...', { id: 'download-excel' });
      
      const blob = await incomeApi.downloadExcel();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `income_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully!', { id: 'download-excel' });
    } catch (error: any) {
      toast.error('Failed to download Excel file', { id: 'download-excel' });
      console.error(error);
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
        <MainNav />
        <main className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-5xl font-black text-slate-900 mb-2">Income</h1>
              <p className="text-lg text-slate-600">Track and manage all your income sources</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleDownloadExcel}
                disabled={isDownloadingExcel || incomes.length === 0}
                variant="outline"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-bold rounded-xl px-6 h-12 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingExcel ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Export Excel
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setShowAddIncome(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/30 border-0 font-bold rounded-xl px-8 h-12 text-white transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Income
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-8 md:grid-cols-3 mb-10">
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">Total Income</p>
                  <p className="text-4xl font-black text-emerald-600">${totalIncome.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Tag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">Total Sources</p>
                  <p className="text-4xl font-black text-indigo-600">{incomes.length}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-2">This Month</p>
                  <p className="text-4xl font-black text-cyan-600">{incomes.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Income Table */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-8 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
              <h2 className="text-3xl font-black text-slate-900">All Income</h2>
              <p className="text-base text-slate-600 mt-2">Complete list of your income transactions</p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Loading income data...</p>
                </div>
              </div>
            ) : incomes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Income Yet</h3>
                <p className="text-slate-600 mb-6">Start tracking by adding your first income</p>
                <Button 
                  onClick={() => setShowAddIncome(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Income
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {incomes.map((income) => (
                      <tr key={income._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="font-semibold text-slate-900">{income.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-emerald-600">
                            ${income.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">{formatDate(income.date)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500">{formatDate(income.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(income._id)}
                            disabled={deletingId === income._id}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold"
                          >
                            {deletingId === income._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Add Income Modal */}
        <AddIncomeModal 
          open={showAddIncome} 
          onOpenChange={setShowAddIncome}
          onSuccess={fetchIncomes}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={handleDeleteConfirm}
          title="Delete Income?"
          description="Are you sure you want to delete this income entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deletingId !== null}
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
