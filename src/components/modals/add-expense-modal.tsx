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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ShoppingBag, Utensils, Car, Film, Coffee, Home, Smartphone, Shirt, Heart, Briefcase, Gift, Plane, Book, Zap, Plus, Sparkles, Scan } from 'lucide-react';
import { toast } from 'sonner';
import { expenseApi } from '@/lib/api';

const formSchema = z.object({
  icon: z.string().min(1, 'Please select an icon'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
});

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const availableIcons = [
  { name: 'Shopping', icon: ShoppingBag, color: 'text-blue-600' },
  { name: 'Food', icon: Utensils, color: 'text-amber-600' },
  { name: 'Transport', icon: Car, color: 'text-green-600' },
  { name: 'Entertainment', icon: Film, color: 'text-red-600' },
  { name: 'Coffee', icon: Coffee, color: 'text-orange-600' },
  { name: 'Home', icon: Home, color: 'text-indigo-600' },
  { name: 'Phone', icon: Smartphone, color: 'text-purple-600' },
  { name: 'Clothing', icon: Shirt, color: 'text-pink-600' },
  { name: 'Health', icon: Heart, color: 'text-rose-600' },
  { name: 'Work', icon: Briefcase, color: 'text-slate-600' },
  { name: 'Gift', icon: Gift, color: 'text-teal-600' },
  { name: 'Travel', icon: Plane, color: 'text-cyan-600' },
  { name: 'Education', icon: Book, color: 'text-emerald-600' },
  { name: 'Utilities', icon: Zap, color: 'text-yellow-600' },
];

const defaultCategories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
  'Clothing',
  'Gifts',
  'Other',
];

export function AddExpenseModal({ open, onOpenChange, onSuccess }: AddExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('Shopping');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: 'Shopping',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const payload = {
        icon: values.icon,
        category: showCustomCategory ? customCategory : values.category,
        amount: values.amount,
        date: new Date(values.date).toISOString(),
      };

      await expenseApi.add(payload);
      
      toast.success('Expense added successfully!');
      form.reset();
      setSelectedIcon('Shopping');
      setCustomCategory('');
      setShowCustomCategory(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      form.setValue('category', '');
    } else {
      setShowCustomCategory(false);
      form.setValue('category', value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Add New Expense</DialogTitle>
          <DialogDescription>
            Track your spending by adding a new expense entry
          </DialogDescription>
        </DialogHeader>

        {/* OCR Feature Badge */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">AI Receipt Scanner</p>
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                COMING SOON
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">Scan receipts and auto-fill expense details with AI</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Icon Picker */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Choose Icon</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-7 gap-2">
                      {availableIcons.map((iconItem) => {
                        const IconComponent = iconItem.icon;
                        const isSelected = selectedIcon === iconItem.name;
                        return (
                          <button
                            key={iconItem.name}
                            type="button"
                            onClick={() => {
                              setSelectedIcon(iconItem.name);
                              field.onChange(iconItem.name);
                            }}
                            className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 scale-110'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <IconComponent className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : iconItem.color}`} />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Dropdown */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Category</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Select onValueChange={handleCategoryChange} value={showCustomCategory ? 'custom' : field.value}>
                        <SelectTrigger className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add Custom Category
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {showCustomCategory && (
                        <Input
                          placeholder="Enter custom category name"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
                    Adding...
                  </>
                ) : (
                  'Add Expense'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
