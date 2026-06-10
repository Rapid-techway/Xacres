'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Xacres work?",
    answer: "Explore lands directly on the map, view property details, and connect instantly through WhatsApp or callback requests."
  },
  {
    question: "Can I search lands using AI?",
    answer: "Yes. Xacres supports AI-powered land discovery with natural language and voice-based search experiences."
  },
  {
    question: "What kind of lands are available?",
    answer: "Agricultural, residential, investment and development-focused land opportunities across Haryana."
  },
  {
    question: "Are the listings verified?",
    answer: "We focus on providing structured and reliable land information with clear property visibility and location context."
  },
  {
    question: "Do I need an account to explore lands?",
    answer: "No. You can browse maps, explore properties and view land details without signing in."
  },
  {
    question: "How do I reach you?",
    answer: "Every land listing includes a direct WhatsApp connect button along with a callback request option for faster communication and assistance."
  },
  {
    question: "Does Xacres support satellite views?",
    answer: "Yes. Xacres is built around map-first and satellite-based land exploration for better visual understanding."
  },
  {
    question: "Can I explore lands on mobile?",
    answer: "Yes. Xacres is fully optimized for mobile devices with responsive map interactions and smooth browsing."
  },
  {
    question: "What makes Xacres different?",
    answer: "Unlike traditional listing websites, Xacres is designed for visual land discovery through maps, AI-assisted search and modern geographic workflows."
  },
  {
    question: "Is Xacres limited to one region?",
    answer: "Yes. Xacres is currently focused entirely on Haryana to deliver a more accurate, map-first and region-specific land discovery experience."
  }
];

export default function FaqSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Header Block */}
        <div className="mb-10 text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight uppercase">
            FAQ
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2">
            Everything you need to know about Xacres.
          </p>
        </div>

        {/* Accordion Component with top border */}
        <div className="border-t border-neutral-200">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-neutral-900 hover:text-neutral-700 text-sm sm:text-base md:text-lg tracking-tight pr-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-500 text-xs sm:text-sm md:text-base leading-relaxed pb-6 pr-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
