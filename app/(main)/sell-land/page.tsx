'use client';

import { useState } from 'react';
import { HARYANA_DISTRICTS } from '@/lib/static';
import { CheckCircle2, User, Phone, MapPin, Globe, Compass, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SellLandPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !district || !locationName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/seller-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phone.trim(),
          district,
          locationName: locationName.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit details.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Seller lead submission error:', err);
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      title: 'Quick Submission',
      description: 'Submit your land details in under 2 minutes. Simple and straightforward form.',
      icon: Sparkles,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50/50 border-blue-100/50',
    },
    {
      title: 'Direct Contact',
      description: 'Connect directly with verified Xacres advisors. No middleman spam or unsolicited calls.',
      icon: Phone,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50 border-emerald-100/50',
    },
    {
      title: 'Haryana Focused',
      description: 'Dedicated marketplace for Haryana properties. Local buyers looking for local land.',
      icon: MapPin,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/50 border-amber-100/50',
    },
    {
      title: 'Free Consultation',
      description: 'Complimentary estimation, title verification, and guidance from our team.',
      icon: Globe,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50/50 border-indigo-100/50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/40 pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Success State */}
        {isSuccess ? (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-10 md:p-16 text-center space-y-6 shadow-xl shadow-gray-250/20 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-sans font-black tracking-tight text-gray-900">
                Land Details Received
              </h2>
              <p className="text-gray-500 font-medium text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Our team has received your submission and will reach out to you shortly to review your property details.
              </p>
            </div>

            <div className="h-[1px] w-24 bg-gray-200 mx-auto" />

            <div className="pt-2">
              <button 
                onClick={() => {
                  setIsSuccess(false);
                  setName('');
                  setPhone('');
                  setDistrict('');
                  setLocationName('');
                  setNotes('');
                }}
                className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md"
              >
                Submit Another Property
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Hero & Benefits */}
            <div className="lg:col-span-6 space-y-10 md:space-y-12">
              {/* Title & Headline */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100/50 rounded-full px-3 py-1 text-blue-700 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles size={12} className="animate-pulse" />
                  Xacres Sellers Partner
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight leading-[0.95] text-gray-900">
                  Sell Your Land <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">with Xacres.</span>
                </h1>
                <p className="text-gray-550 text-sm sm:text-base leading-relaxed max-w-lg font-medium pt-2">
                  Submit your land details below. The Xacres verification team will evaluate your property, verify details, and guide you through listing it for buyers in Haryana.
                </p>
              </div>

              {/* Benefits Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-md ${benefit.bgColor}`}
                  >
                    <div className={`p-2.5 rounded-xl bg-white border border-gray-100 ${benefit.iconColor} shadow-sm shrink-0`}>
                      <benefit.icon size={20} strokeWidth={2.25} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-sm tracking-tight">{benefit.title}</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Submission Form */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-gray-100/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-250/20 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Property Details</h3>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Please provide accurate contact and land information
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <User size={15} />
                      </span>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="h-12 pl-11 pr-4 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl text-sm font-semibold transition-all hover:border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Phone size={15} />
                      </span>
                      <Input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        required
                        className="h-12 pl-11 pr-4 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl text-sm font-semibold transition-all hover:border-gray-200"
                      />
                    </div>
                  </div>

                  {/* District Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">District *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <MapPin size={15} />
                      </span>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={isLoading}
                        required
                        className="w-full h-12 pl-11 pr-10 bg-gray-50/50 border border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-semibold transition-all appearance-none cursor-pointer text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                      >
                        <option value="" disabled hidden>Select Haryana District</option>
                        {HARYANA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Location Detail */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Location Name *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Compass size={15} />
                      </span>
                      <Input
                        type="text"
                        placeholder="Village, City, Sector or Colony (e.g. Hansi)"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="h-12 pl-11 pr-4 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl text-sm font-semibold transition-all hover:border-gray-200"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 pl-1 font-semibold">
                      Supports Village, City, Tehsil, Sector, Colony, or Local Area.
                    </p>
                  </div>

                  {/* Notes (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Description / Notes (Optional)</label>
                    <textarea
                      placeholder="e.g. 4 acre agricultural land near main road with water access..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isLoading}
                      rows={3}
                      className="w-full p-4 bg-gray-50/50 border border-gray-100 hover:border-gray-200 focus:bg-white rounded-xl text-sm font-semibold transition-all outline-none resize-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50/50 border border-red-150 rounded-xl p-3 flex items-start gap-2.5 text-red-600">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold leading-normal">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-12 text-xs font-extrabold uppercase tracking-widest transition-all active:scale-[0.98] shadow-md shadow-gray-900/10"
                  >
                    {isLoading ? 'Submitting Details...' : 'Submit Land Details'}
                  </Button>
                </form>
              </div>
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}
