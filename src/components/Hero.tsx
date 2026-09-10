"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MagneticLink } from './MagneticButton';

const keywords = [
    { word: 'PRODUCT', color: 'rgba(10, 92, 110, 0.4)' },
    { word: 'WEBSITE', color: 'rgba(30, 41, 59, 0.4)' },
    { word: 'APP', color: 'rgba(15, 23, 42, 0.4)' },
    { word: 'BRAND', color: 'rgba(17, 24, 39, 0.4)' },
    { word: 'EXPERIENCE', color: 'rgba(5, 46, 22, 0.4)' }
];

export default function Hero() {
    const container = useRef<HTMLDivElement>(null);
    const keywordsRef = useRef<HTMLDivElement>(null);
    const bgGlowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!container.current || !keywordsRef.current) return;
            const tl = gsap.timeline();

            // Initial Entrance Animation
            const staticText = container.current.querySelectorAll('.hero-static');
            const ctas = container.current.querySelectorAll('.hero-cta');
            const sub = container.current.querySelector('.hero-sub-text');
            const scrollCue = container.current.querySelector('.hero-cue');

            tl.fromTo(staticText,
                { y: 30, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5 }
            );
            tl.fromTo(keywordsRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, "-=0.6"
            );
            if (sub) {
                tl.from(sub, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
            }
            if (ctas.length) {
                tl.from(ctas, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.6');
            }
            if (scrollCue) {
                tl.from(scrollCue, { opacity: 0, duration: 1 }, '-=0.2');
            }
            tl.fromTo(bgGlowRef.current,
                { opacity: 0 },
                { opacity: 0.6, duration: 1.5, ease: 'power2.inOut' }, "-=1"
            );

            // Keyword Cycling Animation
            const items = gsap.utils.toArray('.keyword-item') as HTMLElement[];
            gsap.set(items, { y: 40, opacity: 0, filter: 'blur(10px)', position: 'absolute' });
            gsap.set(items[0], { y: 0, opacity: 1, filter: 'blur(0px)', position: 'relative' });

            const loopTl = gsap.timeline({ repeat: -1 });

            // Loop through each word
            items.forEach((item, i) => {
                const nextItem = items[(i + 1) % items.length];
                const nextColor = keywords[(i + 1) % keywords.length].color;

                loopTl.addLabel(`step${i}`)
                    .to(item, {
                        y: -30,
                        opacity: 0,
                        filter: 'blur(8px)',
                        duration: 0.6,
                        ease: 'power2.in',
                        onStart: () => gsap.set(item, { position: 'absolute' })
                    }, `+=${2}`) // hold for 2s
                    .set(nextItem, { position: 'relative', y: 30, opacity: 0, filter: 'blur(8px)' }, `step${i}+=0.6`)
                    .to(nextItem, {
                        y: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        ease: 'power3.out'
                    }, `step${i}+=0.6`)
                    .to(bgGlowRef.current, {
                        backgroundColor: nextColor,
                        duration: 1.2,
                        ease: 'power2.inOut'
                    }, `step${i}+=0.4`);
            });

        }, container);

        return () => ctx.revert();
    }, []);

    // Pointer Interaction
    useEffect(() => {
        const element = container.current;
        if (!element || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;

        const glowWrapper = element.querySelector('.hero-bg') as HTMLElement;
        const mainTextWrapper = element.querySelector('.hero-headline') as HTMLElement;

        const onMove = (event: PointerEvent) => {
            const bounds = element.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            if (glowWrapper) gsap.to(glowWrapper, { x: x * 40, y: y * 40, duration: 1, ease: 'power3.out' });
            if (mainTextWrapper) gsap.to(mainTextWrapper, { x: x * -10, y: y * -10, duration: 1, ease: 'power3.out' });
        };
        const onLeave = () => {
            if (glowWrapper) gsap.to(glowWrapper, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
            if (mainTextWrapper) gsap.to(mainTextWrapper, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
        };

        element.addEventListener('pointermove', onMove, { passive: true });
        element.addEventListener('pointerleave', onLeave);
        return () => {
            element.removeEventListener('pointermove', onMove);
            element.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={container} className="bg-[var(--ink)] text-white min-h-[100svh] flex flex-col justify-center relative overflow-hidden pt-[110px] pb-16 px-[var(--gutter)] border-b border-white/5 isolate">
            <div className="hero-bg absolute inset-0 z-0 opacity-50 pointer-events-none mix-blend-screen overflow-hidden flex items-center justify-center">
                <div ref={bgGlowRef} className="w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] aspect-square rounded-full blur-[100px] transition-colors duration-1000 ease-out flex-shrink-0" style={{ backgroundColor: keywords[0].color }} />
            </div>

            <div className="relative z-10 w-full max-w-[var(--container)] mx-auto">
                <div className="hero-headline flex flex-col items-baseline justify-center font-serif leading-[1.05]">

                    <h1 className="text-[clamp(32px,6vw,72px)] tracking-tight">
                        <span className="block hero-static opacity-0">YOU THINK,</span>

                        <div ref={keywordsRef} className="relative block h-[1.2em] overflow-visible my-1 md:my-2 cursor-pointer group">
                            <div className="flex items-center">
                                <span className="mr-3 font-sans tracking-tight text-[var(--duck)] font-light leading-[1.1] text-[clamp(28px,5vw,64px)] translate-y-[-2px] block">[</span>
                                <div className="relative inline-block overflow-visible min-w-[200px] md:min-w-[400px] h-[1.2em]">
                                    {keywords.map((kw, i) => (
                                        <div key={i} className={`keyword-item absolute inset-0 flex items-center text-white font-medium transition-transform duration-300 group-hover:scale-[1.02]`}>
                                            <span style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{kw.word}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="ml-0 font-sans tracking-tight text-[var(--duck)] font-light leading-[1.1] text-[clamp(28px,5vw,64px)] translate-y-[-2px] block">]</span>
                            </div>
                        </div>

                        <span className="block hero-static opacity-0">WE BUILD.</span>
                    </h1>

                </div>

                <p className="hero-sub-text mt-8 max-w-[44ch] text-[15px] leading-relaxed text-[var(--muted-on-ink)] opacity-0">
                    Tarka takes an idea and turns it into something real — the product, the interface, the brand, or the film that carries it.
                </p>

                <div className="mt-12 flex flex-wrap gap-4 items-center">
                    <div className="hero-cta opacity-0">
                        <MagneticLink href="/services" variant="primary">PRODUCT</MagneticLink>
                    </div>
                    <div className="hero-cta opacity-0">
                        <MagneticLink href="/quote" variant="outline">GET A QUOTE</MagneticLink>
                    </div>
                </div>

                <div className="hero-cue absolute bottom-8 left-[var(--gutter)] flex flex-col items-center gap-3 text-[11px] tracking-[0.05em] text-[var(--muted-on-ink)] uppercase font-semibold opacity-60">
                    <span className="w-[1px] h-[22px] bg-current block animate-[float_1.8s_ease-in-out_infinite]"></span>
                    Scroll
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: scaleY(1); opacity: 0.4; transform-origin: top; }
                    50% { transform: scaleY(0.4); opacity: 1; transform-origin: top; }
                }
            `}} />
        </div>
    );
}
