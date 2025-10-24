'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainNav } from '@/components/layout/main-nav';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowRight, ShoppingBag, Utensils, Car, Film, Coffee, Plus, Sparkles, BarChart3, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddExpenseModal } from '@/components/modals/add-expense-modal';
import { expenseApi, incomeApi, dashboardApi } from '@/lib/api';
import { toast } from 'sonner';

interface Expense {
  _id: string;
  userId: string;
  icon?: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
}

interface Income {
  _id: string;
  userId: string;
  icon?: string;
  source: string;
  amount: number;
  date: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isLoadingIncomes, setIsLoadingIncomes] = useState(true);
  const [summary, setSummary] = useState<{
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    last30DaysExpenses: { total: number; transactions: any[] };
    last60DaysIncome: { total: number; transactions: any[] };
    recentTransactions: any[];
  } | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const fetchExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (error: any) {
      toast.error('Failed to fetch expenses');
      console.error(error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchIncomes = async () => {
    try {
      setIsLoadingIncomes(true);
      const data = await incomeApi.getAll();
      setIncomes(data);
    } catch (error: any) {
      toast.error('Failed to fetch income data');
      console.error(error);
    } finally {
      setIsLoadingIncomes(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setIsLoadingSummary(true);
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard summary');
      console.error(error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
    fetchSummary();
  }, []);

  const fallbackExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const fallbackIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = summary?.totalExpenses ?? fallbackExpense;
  const totalIncome = summary?.totalIncome ?? fallbackIncome;
  const totalBalance = summary?.totalBalance ?? (fallbackIncome - fallbackExpense);

  const stats = [
    {
      label: 'Total Balance',
      value: `$${totalBalance.toFixed(2)}`,
      change: '+20.1%',
      trend: 'up',
      icon: Wallet,
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-100'
    },
    {
      label: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      change: '+12.0%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Total Expense',
      value: `$${totalExpense.toFixed(2)}`,
      change: '+5.2%',
      trend: 'up',
      icon: TrendingDown,
      bgColor: 'bg-gradient-to-br from-rose-50 to-orange-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Recent transactions: prefer summary API, fallback to recent expenses
  const recentTransactions = summary?.recentTransactions && summary.recentTransactions.length > 0
    ? summary.recentTransactions.slice(0, 5)
    : [...expenses]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(e => ({
          _id: e._id,
          type: 'expense',
          category: e.category,
          amount: e.amount,
          date: e.date,
          createdAt: e.createdAt,
        }));

  // Function to get icon based on category or icon field
  const getCategoryIcon = (category: string, iconName?: string) => {
    // If icon field is provided, try to match it
    if (iconName) {
      const iconLower = iconName.toLowerCase();
      if (iconLower.includes('food') || iconLower.includes('utensil')) {
        return { Icon: Utensils, color: 'bg-amber-100 text-amber-700' };
      } else if (iconLower.includes('shop')) {
        return { Icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' };
      } else if (iconLower.includes('car') || iconLower.includes('transport')) {
        return { Icon: Car, color: 'bg-green-100 text-green-700' };
      } else if (iconLower.includes('film') || iconLower.includes('entertainment')) {
        return { Icon: Film, color: 'bg-red-100 text-red-700' };
      } else if (iconLower.includes('coffee')) {
        return { Icon: Coffee, color: 'bg-orange-100 text-orange-700' };
      }
    }
    
    // Fallback to category-based icon
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('food') || categoryLower.includes('dining') || categoryLower.includes('restaurant')) {
      return { Icon: Utensils, color: 'bg-amber-100 text-amber-700' };
    } else if (categoryLower.includes('shop') || categoryLower.includes('groceries') || categoryLower.includes('grocery')) {
      return { Icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' };
    } else if (categoryLower.includes('transport') || categoryLower.includes('uber') || categoryLower.includes('car') || categoryLower.includes('fuel')) {
      return { Icon: Car, color: 'bg-green-100 text-green-700' };
    } else if (categoryLower.includes('entertainment') || categoryLower.includes('movie') || categoryLower.includes('netflix')) {
      return { Icon: Film, color: 'bg-red-100 text-red-700' };
    } else if (categoryLower.includes('coffee') || categoryLower.includes('cafe')) {
      return { Icon: Coffee, color: 'bg-orange-100 text-orange-700' };
    } else if (categoryLower.includes('rent') || categoryLower.includes('house')) {
      return { Icon: Wallet, color: 'bg-purple-100 text-purple-700' };
    } else if (categoryLower.includes('cloth') || categoryLower.includes('fashion')) {
      return { Icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' };
    } else {
      return { Icon: Tag, color: 'bg-rose-100 text-rose-700' };
    }
  };

  // Process expenses by category from API data
  const expensesByCategory = () => {
    if (!summary?.last30DaysExpenses?.transactions) return [];
    
    const categoryMap = new Map<string, number>();
    summary.last30DaysExpenses.transactions.forEach((tx: any) => {
      const category = tx.category || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + tx.amount);
    });

    const total = summary.last30DaysExpenses.total || 0;
    
    return Array.from(categoryMap.entries())
      .map(([name, amount]) => {
        const { Icon, color } = getCategoryIcon(name);
        return {
          name,
          amount,
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
          color: color.replace('text-', 'bg-').replace('-700', '-500'),
          icon: Icon,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  // Process income by source from API data
  const incomeBySource = () => {
    if (!summary?.last60DaysIncome?.transactions) return [];
    
    const sourceMap = new Map<string, number>();
    summary.last60DaysIncome.transactions.forEach((tx: any) => {
      const source = tx.source || 'Other';
      sourceMap.set(source, (sourceMap.get(source) || 0) + tx.amount);
    });

    const total = summary.last60DaysIncome.total || 0;
    
    return Array.from(sourceMap.entries())
      .map(([name, amount]) => {
        return {
          name,
          amount,
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
          color: 'bg-emerald-500',
          icon: DollarSign,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const expensesByType = expensesByCategory();
  const incomeByType = incomeBySource();

  const financialOverview = [
    { label: 'Total Balance', value: totalBalance, color: 'indigo' },
    { label: 'Total Income', value: totalIncome, color: 'emerald' },
    { label: 'Total Expense', value: totalExpense, color: 'rose' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
        <MainNav />
        <main className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-1 sm:mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600">Welcome back! Here's your financial overview</p>
            </div>
            <Button 
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-indigo-500/30 border-0 font-bold rounded-xl px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base text-white transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Stats Grid - Top 3 Cards */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`rounded-xl sm:rounded-2xl border-2 ${stat.borderColor} ${stat.bgColor} p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all`}>
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur flex items-center justify-center shadow-md`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
                      stat.trend === 'up' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1 sm:mb-2">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">vs last month</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid - 2 Columns */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-10">
            {/* Recent Transactions */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Transactions</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Latest activity</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/expense')}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">See All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {isLoadingSummary ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Loading transactions...</p>
                    </div>
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Tag className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No recent transactions</p>
                  </div>
                ) : (
                  recentTransactions.map((tx) => {
                    const name = (tx.category || tx.source || 'Transaction') as string;
                    const { Icon, color } = getCategoryIcon(name, tx.icon);
                    return (
                      <div key={tx._id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{name}</p>
                            <p className="text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-sm sm:text-base ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>${Number(tx.amount).toFixed(2)}</p>
                          <p className="text-xs text-slate-400 hidden sm:block">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Financial Overview Chart */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Financial Overview</h2>
              <div className="space-y-4">
                {financialOverview.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className={`text-lg font-bold ${
                        item.color === 'indigo' ? 'text-indigo-600' : 
                        item.color === 'emerald' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.color === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 
                          item.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 
                          'bg-gradient-to-r from-rose-500 to-rose-600'
                        }`}
                        style={{ width: `${(item.value / 18450) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Net Savings</p>
                    <p className="text-xs text-slate-500 mt-0.5">This month</p>
                  </div>
                  <p className="text-2xl font-black text-indigo-600">
                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses and Income Overview */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-10">
            {/* Last 30 Days Expenses */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Last 30 Days Expenses</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">By category</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/expense')}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </div>
              <div className="space-y-4">
                {expensesByType.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Tag className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No expenses in the last 30 days</p>
                  </div>
                ) : (
                  expensesByType.map((expense, index) => {
                    const Icon = expense.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg ${expense.color} bg-opacity-10 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${expense.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="font-semibold text-slate-900 text-sm">{expense.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">${expense.amount.toFixed(2)}</span>
                        </div>
                        <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${expense.color} rounded-full`}
                            style={{ width: `${expense.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">{expense.percentage}% of total</p>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Total Expenses</span>
                  <span className="text-xl font-black text-rose-600">
                    ${(summary?.last30DaysExpenses?.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Last 60 Days Income */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Last 60 Days Income</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">By source</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/income')}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </div>
              <div className="space-y-4">
                {incomeByType.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <DollarSign className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No income in the last 60 days</p>
                  </div>
                ) : (
                  incomeByType.map((income, index) => {
                    const Icon = income.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg ${income.color} bg-opacity-10 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${income.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="font-semibold text-slate-900 text-sm">{income.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">${income.amount.toFixed(2)}</span>
                        </div>
                        <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${income.color} rounded-full`}
                            style={{ width: `${income.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">{income.percentage}% of total</p>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Total Income</span>
                  <span className="text-xl font-black text-emerald-600">
                    ${(summary?.last60DaysIncome?.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions - Coming Soon */}
          <div className="rounded-xl sm:rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">AI Financial Assistant</h2>
                  <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full self-start">
                    COMING SOON
                  </span>
                </div>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  Get personalized financial insights and smart recommendations to optimize your spending and boost your savings.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur rounded-xl border border-indigo-100">
                    <BarChart3 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Smart Expense Analysis</p>
                      <p className="text-xs text-slate-600 mt-1">AI-powered spending patterns and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur rounded-xl border border-indigo-100">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Personalized Suggestions</p>
                      <p className="text-xs text-slate-600 mt-1">Tailored advice to improve your finances</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Expense Modal */}
        <AddExpenseModal 
          open={showAddExpense} 
          onOpenChange={setShowAddExpense}
          onSuccess={() => {
            fetchExpenses();
            fetchIncomes();
            fetchSummary();
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
