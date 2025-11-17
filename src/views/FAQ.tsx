"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on all unused items in their original packaging. Simply contact our customer service team to initiate a return.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping times vary by location, typically 10-15 business days.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and SSL Commerz for secure payments.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard.",
  },
  {
    question: "Are your products eco-friendly?",
    answer:
      "Yes, we prioritize sustainability. Many of our products are made from organic cotton and recycled materials.",
  },
  {
    question: "What sizes do your bedding products come in?",
    answer:
      "Our bedding is available in Twin, Full, Queen, King, and California King sizes. Check individual product pages for specific sizing details.",
  },
  {
    question: "How do I care for my textiles?",
    answer:
      "Care instructions vary by product. Most items are machine washable in cold water. Always check the care label on your specific product.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes! We offer special pricing for bulk orders. Contact our corporate sales team for a custom quote.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "Orders can be modified or cancelled within 2 hours of placement. After that, please contact customer service for assistance.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our products and services
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-muted rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Our customer service team is here to help
            </p>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
