'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin@123',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { user, token } = await authApi.login(values.email, values.password);
      login(user, token);
      router.push('/dashboard');
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-600">Sign in to your account to continue</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium text-sm">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-700 font-medium text-sm">Password</FormLabel>
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => {}}
                  >
                    Forgot password?
                  </button>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium shadow-lg shadow-indigo-500/30 rounded-lg" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <button
            className="font-medium text-indigo-600 hover:text-indigo-700"
            onClick={() => router.push('/register')}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
