import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section, SectionHeading } from '@/components/ui/Section';
import { BookingForm } from '@/components/forms/BookingForm';
import { Accordion } from '@/components/marketing/Accordion';
import { BOOKING_FAQS } from '@/content/faqs';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book',
  description: 'Booking inquiries for choreography, direction, and production.',
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact & Booking"
        title="Book Travis Payne"
        subtitle="Choreography, direction, and production for tours, film, television, and brands."
      />

      <Section className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <BookingForm />
          <aside className="space-y-6 text-tp-gray">
            <div>
              <h2 className="text-overline uppercase text-tp-gold">Direct</h2>
              <p className="mt-3">{SITE.email}</p>
              <p>{SITE.phone}</p>
            </div>
            <p className="text-sm">We respond within 2 business days.</p>
          </aside>
        </div>
      </Section>

      <Section className="pb-32">
        <SectionHeading eyebrow="FAQ" title="Booking Questions" className="mb-8" />
        <Accordion items={BOOKING_FAQS} />
      </Section>
    </>
  );
}
