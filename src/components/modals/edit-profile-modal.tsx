'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, User, Mail, Lock, Image } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  profileImageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      profileImageUrl: user?.profileImageUrl || '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Prepare the payload, excluding empty optional fields
      const payload: any = {
        fullName: values.fullName,
        email: values.email,
      };
      
      if (values.profileImageUrl) {
        payload.profileImageUrl = values.profileImageUrl;
      }
      
      if (values.password) {
        payload.password = values.password;
      }

      const response = await authApi.updateUser(payload);
      
      // Update local user state with the response
      if (response.user) {
        updateUser(response.user);
      }
      
      toast.success('Profile updated successfully!');
      onOpenChange(false);
      
      // Reset password field
      form.setValue('password', '');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and preferences
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </FormLabel>
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

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile Image URL Field */}
            <FormField
              control={form.control}
              name="profileImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Profile Image URL
                    <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                    <span className="text-xs text-slate-500 font-normal">(Optional - leave blank to keep current)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg font-semibold"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
