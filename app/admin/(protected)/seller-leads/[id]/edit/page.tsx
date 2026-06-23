"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import SellerLeadForm from "@/components/admin/SellerLeadForm";
import { sellerService } from "@/services/seller-lead.service";
import { SellerLead } from "@/lib/types";

export default function EditSellerLeadPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<SellerLead | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerService.getSellerLeadById(id);
      setLead(data);
    } catch (error) {
      console.error("Error fetching seller lead for edit:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id, fetchLead]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading seller lead profile...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Seller lead not found</h1>
        <p className="text-stone-505 text-sm">The lead profile you are trying to edit does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SellerLeadForm initialData={lead} />
    </div>
  );
}
