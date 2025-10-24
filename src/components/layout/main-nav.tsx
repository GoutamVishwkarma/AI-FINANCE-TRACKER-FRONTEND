'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { EditProfileModal } from '@/components/modals/edit-profile-modal';
import { LayoutDashboard, Receipt, TrendingUp, LogOut, Wallet, Menu, X } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-slate-900">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="hidden xs:inline sm:inline">ExpenseTracker</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
        <div className="hidden md:flex items-center gap-3">
          {user && (
            <button 
              onClick={() => setShowEditProfile(true)}
              className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-2 transition-colors cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-slate-300 hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              {user && (
                <button 
                  onClick={() => {
                    setShowEditProfile(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-full transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                    <span className="text-xs font-semibold text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-slate-300 hover:bg-slate-100 hover:text-slate-900 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        open={showEditProfile} 
        onOpenChange={setShowEditProfile}
      />
    </header>
  );
}
