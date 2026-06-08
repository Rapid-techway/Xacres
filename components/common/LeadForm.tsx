'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, User, Phone, Wallet, MessageSquare, Loader2 } from 'lucide-react';

interface LeadFormProps {
  landId: string;
  landTitle: string;
}

export default function LeadForm({ landId, landTitle }: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide both your name and phone number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landId,
          name: name.trim(),
          phone: phone.trim(),
          budget: budget.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Lead submission error:', err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 size={24} strokeWidth={2.5} />
        </div>
        <h4 className="font-bold text-gray-900 text-base">Inquiry Submitted</h4>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Thank you, <strong>{name}</strong>! We have received your inquiry for <em>{landTitle}</em>. Our land advisor will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-3.5 bg-blue-500 rounded-full" />
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Register Your Interest
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={15} />
          </span>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            className="h-11 pl-11 pr-4 bg-gray-50/50 border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
          />
        </div>

        {/* Phone input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Phone size={15} />
          </span>
          <Input
            type="tel"
            placeholder="Phone Number (e.g. +91...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            required
            className="h-11 pl-11 pr-4 bg-gray-50/50 border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
          />
        </div>

        {/* Budget input (Optional) */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Wallet size={15} />
          </span>
          <Input
            type="text"
            placeholder="Your Budget (Optional)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            disabled={isLoading}
            className="h-11 pl-11 pr-4 bg-gray-50/50 border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all"
          />
        </div>

        {/* Message / Requirements input (Optional) */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-400">
            <MessageSquare size={15} />
          </span>
          <Textarea
            placeholder="Notes or specific requirements..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading}
            rows={2}
            className="pl-11 pr-4 py-2.5 bg-gray-50/50 border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all resize-none min-h-[70px]"
          />
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 px-1">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Request Callback'
          )}
        </Button>
      </form>
    </div>
  );
}
