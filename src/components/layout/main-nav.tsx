'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { LayoutDashboard, Receipt, TrendingUp, LogOut, Wallet } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Income', href: '/income', icon: TrendingUp },
    { name: 'Expense', href: '/expense', icon: Receipt },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span>ExpenseTracker</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
