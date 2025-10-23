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
import { Loader2, DollarSign, TrendingUp, Wallet, Briefcase, Gift, PiggyBank, Award, Building, CreditCard, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { incomeApi } from '@/lib/api';

const formSchema = z.object({
  icon: z.string().min(1, 'Please select an icon'),
  source: z.string().min(1, 'Source is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
});

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const availableIcons = [
  { name: 'Salary', icon: DollarSign, color: 'text-emerald-600' },
  { name: 'Freelance', icon: Briefcase, color: 'text-cyan-600' },
  { name: 'Investment', icon: TrendingUp, color: 'text-indigo-600' },
  { name: 'Bonus', icon: Award, color: 'text-purple-600' },
  { name: 'Gift', icon: Gift, color: 'text-pink-600' },
  { name: 'Savings', icon: PiggyBank, color: 'text-blue-600' },
  { name: 'Wallet', icon: Wallet, color: 'text-teal-600' },
  { name: 'Business', icon: Building, color: 'text-slate-600' },
  { name: 'Refund', icon: CreditCard, color: 'text-amber-600' },
];

const defaultSources = [
  'Salary',
  'Freelance',
  'Investment Returns',
  'Bonus',
  'Business Income',
  'Rental Income',
  'Gift',
  'Refund',
  'Interest',
  'Dividend',
  'Commission',
  'Other',
];

export function AddIncomeModal({ open, onOpenChange, onSuccess }: AddIncomeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('Salary');
  const [customSource, setCustomSource] = useState('');
  const [showCustomSource, setShowCustomSource] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: 'Salary',
      source: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const payload = {
        icon: values.icon,
        source: showCustomSource ? customSource : values.source,
        amount: values.amount,
        date: new Date(values.date).toISOString(),
      };

      await incomeApi.add(payload);
      
      toast.success('Income added successfully!');
      form.reset();
      setSelectedIcon('Salary');
      setCustomSource('');
      setShowCustomSource(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add income. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSourceChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomSource(true);
      form.setValue('source', '');
    } else {
      setShowCustomSource(false);
      form.setValue('source', value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Add New Income</DialogTitle>
          <DialogDescription>
            Track your earnings by adding a new income entry
          </DialogDescription>
        </DialogHeader>

        {/* AI Feature Badge */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">AI Income Categorization</p>
              <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full">
                COMING SOON
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">Automatically categorize and track income patterns with AI</p>
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
                    <div className="grid grid-cols-9 gap-2">
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
                                ? 'border-emerald-500 bg-emerald-50 scale-110'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <IconComponent className={`w-6 h-6 ${isSelected ? 'text-emerald-600' : iconItem.color}`} />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Dropdown */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Income Source</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Select onValueChange={handleSourceChange} value={showCustomSource ? 'custom' : field.value}>
                        <SelectTrigger className="h-11 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
                          <SelectValue placeholder="Select income source" />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultSources.map((src) => (
                            <SelectItem key={src} value={src}>
                              {src}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add Custom Source
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {showCustomSource && (
                        <Input
                          placeholder="Enter custom income source"
                          value={customSource}
                          onChange={(e) => setCustomSource(e.target.value)}
                          className="h-11 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
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
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
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
                      className="h-11 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
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
                className="flex-1 h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Income'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
