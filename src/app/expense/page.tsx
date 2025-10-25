'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/layout/main-nav';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { AddExpenseModal } from '@/components/modals/add-expense-modal';
import { ConfirmDialog } from '@/components/modals/confirm-dialog';
import { expenseApi } from '@/lib/api';
import { Plus, Trash2, Calendar, DollarSign, Tag, Loader2, AlertCircle, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (error: any) {
      toast.error('Failed to fetch expenses');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    
    try {
      setDeletingId(expenseToDelete);
      await expenseApi.delete(expenseToDelete);
      toast.success('Expense deleted successfully!');
      setShowDeleteConfirm(false);
      setExpenseToDelete(null);
      fetchExpenses(); // Refresh the list
    } catch (error: any) {
      toast.error('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      toast.loading('Preparing Excel file...', { id: 'download-excel' });
      
      const blob = await expenseApi.downloadExcel();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <MainNav />
        <main className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Expenses</h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600">Track and manage your spending</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button 
                onClick={handleDownloadExcel}
                disabled={isDownloadingExcel || expenses.length === 0}
                variant="outline"
                className="border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold flex-1 sm:flex-initial text-xs sm:text-sm h-10 sm:h-11"
              >
                {isDownloadingExcel ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Downloading...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Export Excel</span>
                    <span className="sm:hidden">Export</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="bg-rose-600 hover:bg-rose-700 shadow-md font-semibold flex-1 sm:flex-initial text-xs sm:text-sm h-10 sm:h-11"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid gap-8 md:grid-cols-3 mb-10">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="w-14 h-14 rounded-lg bg-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">Total Expenses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">${totalExpenses.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">Expense records</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-indigo-600">{expenses.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Expense Entries</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-emerald-600">{expenses.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Expense Transactions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">All Expenses</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Your complete expense history</p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Loading expenses...</p>
                </div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Expenses Yet</h3>
                <p className="text-slate-600 mb-6">Start tracking by adding your first expense</p>
                <Button 
                  onClick={() => setShowAddExpense(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Expense
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Category
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
                      {expenses.map((expense) => (
                        <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                                <Tag className="w-5 h-5 text-rose-600" />
                              </div>
                              <span className="font-semibold text-slate-900">{expense.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-rose-600">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-600">{formatDate(expense.date)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-500">{formatDate(expense.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(expense._id)}
                              disabled={deletingId === expense._id}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold"
                            >
                              {deletingId === expense._id ? (
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
                
                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{expense.category}</p>
                            <p className="text-xs text-slate-500">{formatDate(expense.createdAt)}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-rose-600">
                          ${expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-xs text-slate-600">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(expense.date)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(expense._id)}
                          disabled={deletingId === expense._id}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 font-semibold h-8 px-3 text-xs"
                        >
                          {deletingId === expense._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

        {/* Add Expense Modal */}
        <AddExpenseModal 
          open={showAddExpense} 
          onOpenChange={setShowAddExpense}
          onSuccess={fetchExpenses}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={handleDeleteConfirm}
          title="Delete Expense?"
          description="Are you sure you want to delete this expense? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deletingId !== null}
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
