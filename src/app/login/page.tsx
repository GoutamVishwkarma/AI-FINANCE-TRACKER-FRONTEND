'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoginForm } from '@/components/auth/login-form';
import { Wallet, Clock, FolderKanban, BarChart3, Target } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Hero content */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium">
                <Wallet className="w-4 h-4" />
                Smart Finance Management
              </div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Track Your Expenses,
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Grow Your Wealth</span>
              </h1>
              <p className="text-lg text-slate-600">
                Take control of your finances with intelligent expense tracking and insightful analytics.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group p-5 rounded-xl bg-white border border-indigo-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Real-time Tracking</h3>
                <p className="text-sm text-slate-600">Monitor expenses as they happen</p>
              </div>
              
              <div className="group p-5 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Smart Categories</h3>
                <p className="text-sm text-slate-600">Organize spending automatically</p>
              </div>
              
              <div className="group p-5 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Visual Reports</h3>
                <p className="text-sm text-slate-600">Beautiful charts and insights</p>
              </div>
              
              <div className="group p-5 rounded-xl bg-white border border-orange-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-default">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Budget Goals</h3>
                <p className="text-sm text-slate-600">Set and achieve financial targets</p>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold mb-4">
                <Wallet className="w-5 h-5" />
                ExpenseTracker
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
              <p className="text-slate-600">Sign in to continue managing your finances</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-8 sm:p-10">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
