import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ContactForm } from '@/components/forms/ContactForm';
import { Accordion } from '@/components/marketing/Accordion';
import { GENERAL_FAQS } from '@/content/faqs';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Travis Payne Productions.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let us create something extraordinary" />

      <Section className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <aside className="space-y-6 text-tp-gray">
            <div>
              <h2 className="text-overline uppercase text-tp-gold">Direct</h2>
              <p className="mt-3">{SITE.email}</p>
              <p>{SITE.phone}</p>
            </div>
            <div>
              <h2 className="text-overline uppercase text-tp-gold">Representation</h2>
              <p className="mt-3">United Talent Agency (UTA)</p>
            </div>
            <p className="text-sm">We respond within 2 business days.</p>
          </aside>
        </div>
      </Section>

      <Section className="pb-32">
        <SectionHeading eyebrow="FAQ" title="Common Questions" className="mb-8" />
        <Accordion items={GENERAL_FAQS} />
      </Section>
    </>
  );
}
