import { Footer1 } from "@/components/home/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Xacres",
  description: "Read the Xacres Privacy Policy to understand our data, analytics, and cookie practices. We prioritize your privacy and transparency.",
};

export default function PrivacyPolicy() {
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
              Privacy <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c5cfc] to-[#5b3fcf]">Policy</span>
            </h1>
            <p className="font-['Syne'] text-xl text-gray-500 font-medium">
              Simple, transparent, and built on trust.
            </p>
          </header>

          <div className="space-y-16 font-['Syne'] text-lg text-gray-600 leading-relaxed font-medium">

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">1. Introduction</h2>
              <p>
                Xacres is a map-first land discovery platform focused on Haryana. We help you explore land parcels and connect with sellers directly. We value your privacy and are committed to keeping our data practices simple and transparent.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">2. Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Currently, we do not require user login or collect personal user data directly.</li>
                <li>We may collect basic technical information automatically, such as your device type, browser version, IP address, and general usage data.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">3. Analytics and Tracking</h2>
              <p>
                As we grow, we may use standard analytics tools (like Vercel Analytics, Speed Insights, or Google Analytics).
                The sole purpose of these tools is to help us understand overall usage patterns, identify technical issues, and improve the speed and performance of the platform.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">4. How We Use Data</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To improve platform performance and speed.</li>
                <li>To understand how users interact with our map and listings.</li>
                <li>To fix bugs, errors, and enhance the overall user experience.</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">5. Data Sharing</h2>
              <p className="text-[#050508] font-bold">
                We do not sell your data. Period.
              </p>
              <p className="mt-2">
                Your usage data is only used internally to make Xacres better.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">6. Cookies</h2>
              <p>
                We may use cookies and similar tracking technologies to monitor analytics and platform performance. These are standard identifiers stored on your device to help us understand site traffic.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">7. Third-Party Services</h2>
              <p>
                Xacres relies on third-party map providers and analytics tools to function. These external services may collect limited technical data in accordance with their own privacy policies when you interact with our map interface.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">8. User Control</h2>
              <p>
                You are in control. You can disable cookies at any time through your browser settings. Note that disabling certain technical cookies may impact the performance of the interactive map.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="font-['Archivo_Black'] text-2xl text-[#050508] tracking-tight uppercase mb-4">9. Updates to this Policy</h2>
              <p>
                As Xacres evolves and adds new features, this Privacy Policy may be updated. We encourage you to review this page periodically to stay informed about our data practices.
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
