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
import { Loader2, User, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  confirmPassword: z.string(),
  profileImageUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImageUrl: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('profileImageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { user, token } = await authApi.register(
        values.fullName,
        values.email,
        values.password,
        values.profileImageUrl
      );
      login(user, token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Create an account</h1>
        <p className="text-slate-600">Enter your details to get started</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-indigo-400" />
                )}
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 shadow-lg transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium text-sm">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
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
                <FormLabel className="text-slate-700 font-medium text-sm">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Create a password" 
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-medium text-sm">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Confirm your password" 
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <button
            className="font-medium text-indigo-600 hover:text-indigo-700"
            onClick={() => router.push('/login')}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
