"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';
import Link from 'next/link';

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);
    const words = ['PRODUCTS', 'EXPERIENCES', 'SYSTEMS', 'IDEAS', 'BRANDS', 'INTERFACES'];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!container.current) return;

            const tl = gsap.timeline();

            const bg = container.current.querySelector('.hero-bg');
            const headlineSpans = container.current.querySelectorAll('.hero-headline > span');
            const sub = container.current.querySelector('.hero-sub-text');
            const ctas = container.current.querySelectorAll('.hero-cta');
            const scrollCue = container.current.querySelector('.hero-cue');

            if (bg) tl.from(bg, { opacity: 0, duration: 1.5, ease: 'power2.out' });
            if (headlineSpans.length) tl.from(headlineSpans, { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=1');
            if (sub) tl.from(sub, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
            if (ctas.length) tl.from(ctas, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.6');
            if (scrollCue) tl.from(scrollCue, { opacity: 0, duration: 1 }, '-=0.2');

            gsap.to('.hero-blob', { x: -50, y: 30, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        }, container);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <div ref={container} className="bg-[var(--ink)] text-white min-h-[90svh] flex flex-col justify-center relative overflow-hidden pt-[110px] pb-16 px-[var(--gutter)] border-b border-white/5">
            <div className="hero-bg absolute inset-0 z-0 opacity-40 pointer-events-none hero-blob mix-blend-screen">
                <div className="absolute right-[-15%] top-[-15%] w-[60vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle_at_40%_40%,var(--duck)_0%,transparent_60%)] blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-[var(--container)] mx-auto">
                <h1 className="hero-headline display flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[clamp(28px,5.2vw,68px)] leading-[1.05]">
                    <span className="block opacity-100">YOU THINK.</span>
                    <span className="block opacity-100">WE BUILD.</span>
                    <span className="hero__word text-[var(--duck)] relative inline-flex items-baseline opacity-100 overflow-hidden h-[1.1em] align-bottom">
                        <span className="opacity-45 mr-1 leading-[1.1]">&ldquo;</span>
                        <div className="relative inline-block h-full">
                            <div
                                className="flex flex-col transition-transform duration-700 ease-[var(--ease)]"
                                style={{ transform: `translateY(-${currentWord * 100}%)` }}
                            >
                                {words.map((w, i) => (
                                    <span key={i} className="h-full block whitespace-nowrap leading-[1.1]">{w}</span>
                                ))}
                            </div>
                        </div>
                        <span className="opacity-45 ml-1 leading-[1.1]">&rdquo;</span>
                    </span>
                </h1>

                <p className="hero-sub-text mt-6 max-w-[44ch] text-[15.5px] leading-relaxed text-[var(--muted-on-ink)] opacity-100">
                    Tarka takes an idea and turns it into something real — the product, the interface, the brand, or the film that carries it.
                </p>

                <div className="mt-12 flex flex-wrap gap-4 items-center">
                    <div className="hero-cta opacity-100">
                        <Link href="/work" passHref legacyBehavior>
                            <MagneticButton variant="primary">Explore Our Work</MagneticButton>
                        </Link>
                    </div>
                    <div className="hero-cta opacity-100">
                        <Link href="/quote" passHref legacyBehavior>
                            <MagneticButton variant="outline">Get a Quote</MagneticButton>
                        </Link>
                    </div>
                </div>

                <div className="hero-cue mt-20 flex items-center gap-3 text-[11px] tracking-[0.05em] text-[var(--muted-on-ink)] uppercase font-semibold opacity-100">
                    <span className="w-[1px] h-[22px] bg-current block animate-[float_1.8s_ease-in-out_infinite]" style={{ animation: 'float 1.8s ease-in-out infinite' }}></span>
                    <style dangerouslySetInnerHTML={{
                        __html: `
            @keyframes float {
              0%, 100% { transform: scaleY(1); opacity: 0.4; }
              50% { transform: scaleY(0.4); opacity: 1; }
            }
          `}} />
                    Scroll
                </div>
            </div>
        </div>
    );
}
