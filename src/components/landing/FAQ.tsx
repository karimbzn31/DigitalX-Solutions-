"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { faqData } from "@/lib/mock-data";

export function FAQ() {
  return (
    <section className="py-24 lg:py-32 bg-surface/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Questions"
          title="Tout ce que vous devez savoir"
        />

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqData.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="nebula-card rounded-[0.75rem] transition-colors hover:bg-violet/[0.02]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-sm text-left text-star-white transition-colors hover:text-violet data-[state=open]:text-violet">
                  <span className="flex items-center gap-3">
                    <ChevronRight className="w-4 h-4 text-violet/60 transition-transform duration-200 group-data-[state=open]:rotate-90 shrink-0" />
                    <span>{item.question}</span>
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                forceMount
                className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-5 pb-4 pt-2">
                  <p className="text-sm text-mist leading-relaxed">{item.answer}</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
