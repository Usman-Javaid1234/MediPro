"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this device safe to use?",
    answer:
      "Yes, our vacuum erection device is made with FDA-approved medical-grade materials and is completely safe for regular use. It's a non-invasive, drug-free solution that has been clinically tested. As with any medical device, we recommend reading the instructions carefully before use.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We deliver across Pakistan within 3-5 business days for major cities like Karachi, Lahore, and Islamabad. Remote areas may take 5-7 business days. You will receive tracking information once your order is shipped.",
  },
  {
    question: "Is the packaging discreet?",
    answer:
      "Absolutely. Your privacy is our top priority. All orders are shipped in plain, unmarked packaging with no indication of the contents. The sender name on the package will be generic, and there's no mention of the product or our company name visible on the outside.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) for customers across Pakistan. This allows you to inspect the package and pay only when you're satisfied. We also accept bank transfers for those who prefer to pay in advance.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes, we offer a 1-year warranty on all our devices against manufacturing defects. If you experience any issues with your device within the warranty period, contact our customer support for a replacement.",
  },
  {
    question: "How do I know this will work for me?",
    answer:
      "Vacuum therapy is a clinically proven method that works for most men experiencing erectile dysfunction. It's recommended by urologists worldwide as a first-line, non-invasive treatment option. If you have specific medical concerns, we recommend consulting with your doctor before use.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding bg-secondary">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our product and services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border-none shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
