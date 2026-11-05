import type { Metadata } from "next";
import PageMotion from "@/components/motion/PageMotion";
import { brand, contact } from "@/lib/data";
import ContactForm from "../_components/ContactForm";
import { Mail, Phone, CheckBadge } from "../_components/Icons";

export const metadata: Metadata = {
  title: `Contact — ${brand.name}`,
  description: contact.title,
};

export default function AuroraContactPage() {
  return (
    <PageMotion>
      <section className="container-x pb-4 pt-[120px] md:pt-[140px]">
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[0.9fr_1.1fr]">
          <aside data-reveal className="glass flex flex-col gap-10 p-6 md:p-8">
            <h1 data-split className="font-display text-[32px] font-medium leading-[1.1] tracking-[-0.03em] text-white md:text-[40px]">
              {contact.title}
            </h1>

            {/* Chat bubbles */}
            <div className="flex flex-col gap-3" aria-hidden>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-aurora/60 bg-[linear-gradient(180deg,rgb(45_70_12/0.9),rgb(24_40_8/0.9))] px-3 py-1.5 text-[14px] tracking-[-0.02em] text-aurora shadow-[0_6px_20px_-8px_rgb(200_255_46/0.6)]">
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 rounded-full bg-aurora" />
                  ))}
                </span>
                {contact.bubbles.sent}
              </span>
              <span className="ml-9 w-fit rounded-lg bg-white/[0.07] px-3 py-1.5 text-[14px] tracking-[-0.02em] text-white/70">{contact.bubbles.received}</span>
            </div>

            <ul className="flex flex-col gap-3">
              {contact.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[13px] leading-[18px] tracking-[-0.02em] text-white/80">
                  <CheckBadge className="size-3.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            <ul className="mt-auto flex flex-col gap-3 text-[13px] tracking-[-0.02em] text-white/80">
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-white">
                  <Mail className="size-4" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2.5 hover:text-white">
                  <Phone className="size-4" />
                  {contact.phone}
                </a>
              </li>
            </ul>
          </aside>

          <div data-reveal className="glass p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
