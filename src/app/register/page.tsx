'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { RegisterForm } from '@/components/auth/register-form';
import { Wallet } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Hero content */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium">
                <Wallet className="w-4 h-4" />
                Smart Finance Management
              </div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                Start Managing Your Finances Today
              </h1>
              <p className="text-lg text-slate-600">
                Join thousands of users who are taking control of their financial future.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Track Every Expense</h3>
                  <p className="text-sm text-slate-600">Never lose sight of where your money goes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Smart Categories</h3>
                  <p className="text-sm text-slate-600">Automatically organize your spending</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Insightful Reports</h3>
                  <p className="text-sm text-slate-600">Understand your spending patterns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Register form */}
          <div className="w-full">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold mb-4">
                <Wallet className="w-5 h-5" />
                FinancePath
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Get Started</h2>
              <p className="text-sm sm:text-base text-slate-600">Create your account to continue</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
