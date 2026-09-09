import React from 'react';
import Hero from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />

      {/* THE THOUGHT */}
      <section className="py-24 relative wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.55fr] gap-10 items-center">
          <div>
            <p className="font-serif text-[clamp(24px,4.4vw,44px)] max-w-[16ch] leading-[1.18]">
              A thought isn't much <em className="italic text-[var(--duck)]">until someone makes it real.</em>
            </p>
            <p className="mt-6 max-w-[48ch] text-[14.5px] leading-relaxed text-[var(--muted)]">
              Tarka is a design and technology studio that thinks through products, interfaces, brands, digital experiences and visual media — before it draws a single pixel.
            </p>
          </div>
          <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[var(--ink)] -rotate-2 shadow-xl">
            <div className="w-full h-full flex flex-col pt-10 px-8 opacity-40">
              <div className="w-full h-4 bg-white/20 rounded-full mb-6"></div>
              <div className="w-3/4 h-4 bg-white/20 rounded-full mb-12"></div>
              <div className="flex-grow bg-white/10 rounded-t-xl mt-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-14 items-start">
          <div className="flex flex-col gap-[8px]">
            {[
              "Tarka thinks before it looks.",
              "Tarka designs with restraint.",
              "Tarka builds in the real medium.",
              "Tarka experiments where it matters.",
              "Tarka obsesses over the details no one asked for."
            ].map((text, i) => (
              <p key={i} className={`font-serif text-[clamp(24px,4.2vw,42px)] leading-[1.25] text-[var(--line)] transition-colors duration-500 hover:text-[var(--ink)] cursor-default`}>
                {text.replace(/thinks|designs|builds|experiments|details/, (match) => `**${match}**`).split('**').map((part, idx) =>
                  idx % 2 === 1 ? <b key={idx} className="font-[440] text-[var(--duck)]">{part}</b> : part
                )}
              </p>
            ))}
          </div>
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-[var(--ink)] sticky top-[120px] hidden md:flex items-center justify-center p-8">
            <div className="border border-white/20 w-full h-full rounded-full flex items-center justify-center flex-col">
              <div className="w-1/2 aspect-square rounded-full bg-[var(--duck)] blur-2xl opacity-60 mix-blend-screen"></div>
            </div>
          </div>
        </div>
      </section>

      {/* BEYOND THE SCREEN */}
      <section className="py-20 overflow-hidden text-white bg-[var(--ink)] mt-12 rounded-t-[40px]">
        <div className="wrap mb-10">
          <span className="eyebrow !text-white">Beyond the screen</span>
          <h2 className="display text-[clamp(26px,4.4vw,44px)] mt-4">Where the studio gets loud.</h2>
        </div>
        <div className="flex items-center">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-[var(--gutter)] pb-10 [&::-webkit-scrollbar]:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex-none rounded-sm overflow-hidden bg-white/5 snap-start border border-white/10 ${i % 2 === 0 ? 'w-[min(64vw,480px)] aspect-[16/10]' : 'w-[min(56vw,360px)] aspect-[3/4] relative p-1'}`}>
                {i % 2 !== 0 && (
                  <div className="w-full h-full border border-dashed border-white/20 rounded-sm"></div>
                )}
                {i % 2 === 0 && (
                  <div className="flex items-end justify-center h-full pb-8 opacity-40">
                    <div className="w-[120px] h-[4px] bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINALE CTA */}
      <section className="bg-[var(--ink)] text-white text-center py-28 px-6">
        <div className="wrap">
          <p className="font-serif text-[clamp(24px,3.6vw,34px)] mb-4">YOU THINK. <span className="text-[var(--duck)]">LET'S BUILD.</span></p>
          <p className="text-[14.5px] text-[var(--muted-on-ink)] mb-8 max-w-[50ch] mx-auto">
            You've seen how we think. If you've got something worth building, that's all we need to start.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/quote" className="inline-flex items-center gap-2 text-[14px] px-6 py-3 rounded-full bg-[var(--duck)] hover:bg-[#0d6f84] transition-all">
              Get a quote <ArrowRight size={16} />
            </Link>
            <Link href="mailto:studio@tarkadesign.com" className="inline-flex items-center gap-2 text-[14px] px-6 py-3 rounded-full border border-white/40 hover:bg-white hover:text-black transition-all">
              Contact Tarka <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
