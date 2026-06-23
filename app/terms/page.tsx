import { Footer1 } from "@/components/home/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <main className="bg-[#05070a] selection:bg-[#7c5cfc] selection:text-white">
      <div className="relative z-20 bg-[#f4f4f5] pt-24 pb-32 rounded-b-[3rem] md:rounded-b-[5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto px-6 md:px-12">

          <Link href="/home" className="inline-flex items-center text-[#7c5cfc] font-bold font-['Syne'] uppercase tracking-widest text-sm mb-12 hover:text-[#5b3fcf] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <header className="mb-20">
            <h1 className="font-['Archivo_Black'] text-5xl md:text-7xl tracking-tighter uppercase leading-[0.9] mb-6 text-[#050508]">
              Terms & <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c5cfc] to-[#5b3fcf]">Conditions</span>
            </h1>
            <p className="font-['Syne'] text-xl text-gray-500 font-medium">
              Clear rules to protect you and the platform.
            </p>
          </header>

          <div className="space-y-16 font-['Syne'] text-lg text-gray-600 leading-relaxed font-medium">

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">1. Nature of the Platform</h2>
              <p>
                <strong>Xacres is strictly a discovery platform.</strong> We provide a digital interface to map and explore land in Haryana. We do NOT own, sell, buy, or act as a real estate agent for any of the land listed on our platform.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">2. No Guarantee of Accuracy</h2>
              <p>
                While we strive to provide a high-quality experience, we make absolutely no guarantees regarding the accuracy of the data. Land details such as map coordinates, pricing, acreage, boundaries, and descriptions may contain errors, be outdated, or be entirely incorrect.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">3. User Responsibility</h2>
              <p>
                <strong>You are solely responsible for your decisions.</strong> Before taking any action or making any payment, you must independently verify all information. This includes physically verifying the land, confirming ownership, checking boundaries, and reviewing legal documents with qualified professionals.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section className="bg-red-50 p-6 md:p-8 rounded-2xl border border-red-100">
              <h2 className="font-['Archivo_Black'] text-2xl text-red-900 tracking-tight uppercase mb-4">4. Absolute No Liability</h2>
              <p className="text-red-800">
                Xacres and its administrators are not legally or financially liable for any losses, damages, or disputes you may encounter. We are not responsible for:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 text-red-800">
                <li>Incorrect or misleading land details.</li>
                <li>Disputes, fraud, or disagreements between buyers and sellers.</li>
                <li>Any financial, legal, or personal losses resulting from the use of this platform.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">5. No Role in Transactions</h2>
              <p>
                Xacres is entirely removed from the transaction process. We do not participate in negotiations, drafting contracts, or transferring money. All deals and communications happen strictly and directly between the buyer and the seller.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">6. Contact Disclaimer</h2>
              <p>
                Any communication made via phone calls, WhatsApp, or other channels initiated through our platform occurs entirely outside the control of Xacres. We do not monitor, record, or take responsibility for off-platform communications.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">7. Third-Party Data</h2>
              <p>
                Our map interface relies on external, third-party mapping providers. We are not responsible for any inaccuracies in satellite imagery, road layouts, or geographic plotting provided by these external services.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">8. Government Verification Advice</h2>
              <p className="text-[#050508] font-bold">
                Always verify records officially.
              </p>
              <p className="mt-2">
                We strongly advise all users to verify land ownership, title status, and agricultural zoning directly through official Haryana government revenue departments and land record portals (e.g., Jamabandi) before committing to any transaction.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">9. Future Platform Changes</h2>
              <p>
                We reserve the right to modify, suspend, or terminate the platform at any time. In the future, Xacres may introduce user accounts, analytics, or new features which will be subject to updated terms.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">10. Changes to these Terms</h2>
              <p>
                We may update these terms at our discretion. Continued use of Xacres after any changes indicates your acceptance of the new Terms & Conditions.
              </p>
            </section>

          </div>
        </div>
      </div>

      {/* Dark Footer */}
      <Footer1 />
    </main>
  );
}
