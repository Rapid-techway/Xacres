'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HARYANA_DISTRICTS } from '@/lib/static';
import { CheckCircle2, User, Phone, MapPin, Compass, Briefcase, Loader2 } from 'lucide-react';

interface LeadFormProps {
  landId: string;
  landTitle: string;
}

export default function LeadForm({ landId, landTitle }: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [buyerDistrict, setBuyerDistrict] = useState('');
  const [interestedDistrict, setInterestedDistrict] = useState('');
  const [purchasePurpose, setPurchasePurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !buyerDistrict || !interestedDistrict || !purchasePurpose) {
      setError('Please provide all required qualification fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/buyer-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          landId,
          name: name.trim(),
          phoneNumber: phone.trim(),
          buyerDistrict,
          interestedDistrict,
          purchasePurpose,
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

        {/* Buyer District select */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <MapPin size={15} />
          </span>
          <select
            value={buyerDistrict}
            onChange={(e) => setBuyerDistrict(e.target.value)}
            disabled={isLoading}
            required
            className="w-full h-11 pl-11 pr-10 bg-gray-50/50 border border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
          >
            <option value="" disabled hidden>District You Live In</option>
            {HARYANA_DISTRICTS.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Interested District select */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Compass size={15} />
          </span>
          <select
            value={interestedDistrict}
            onChange={(e) => setInterestedDistrict(e.target.value)}
            disabled={isLoading}
            required
            className="w-full h-11 pl-11 pr-10 bg-gray-50/50 border border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
          >
            <option value="" disabled hidden>District of Interest</option>
            {HARYANA_DISTRICTS.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Purchase Purpose select */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Briefcase size={15} />
          </span>
          <select
            value={purchasePurpose}
            onChange={(e) => setPurchasePurpose(e.target.value)}
            disabled={isLoading}
            required
            className="w-full h-11 pl-11 pr-10 bg-gray-50/50 border border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
          >
            <option value="" disabled hidden>Purpose of Purchase</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Investment">Investment</option>
            <option value="Commercial">Commercial</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
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
