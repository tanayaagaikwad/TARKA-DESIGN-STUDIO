'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Loader() {
    const [done, setDone] = useState(false);
    const [skip, setSkip] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasVisited = sessionStorage.getItem('tarka-visited');
            if (hasVisited) {
                setSkip(true);
                setDone(true);
                return;
            }
            sessionStorage.setItem('tarka-visited', 'true');
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setDone(true);
                }
            });

            // 1. Dark screen, glow appears
            tl.to(glowRef.current, { opacity: 0.6, scale: 1.5, duration: 1.2, ease: "power2.inOut" });

            // 2. Logo fades/scales into view
            tl.fromTo(logoRef.current,
                { opacity: 0, scale: 0.9, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }, "-=0.8"
            );

            // 3. Logo slightly reacts/pulses
            tl.to(logoRef.current, { scale: 1.03, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" });

            // 4. Subtle distortion / blur / light sweep passes through it
            // For this, we just give it a quick blur/brightness bump
            tl.to(logoRef.current, { filter: "brightness(1.5) blur(2px)", duration: 0.3, ease: "power2.in" });
            tl.to(logoRef.current, { filter: "brightness(1) blur(0px)", duration: 0.3, ease: "power2.out" });

            // 5. Expands/transitions into main website (Loader fades out)
            tl.to(loaderRef.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "+=0.2");

        }, loaderRef);

        return () => ctx.revert();
    }, []);

    if (skip) return null;

    return (
        <div ref={loaderRef} className={`site-loader bg-[var(--ink)] fixed inset-0 z-[1000] flex items-center justify-center ${done ? 'pointer-events-none' : ''}`} aria-hidden="true" style={{ opacity: done ? 0 : 1 }}>
            <div ref={glowRef} className="absolute w-[30vh] h-[30vh] bg-[var(--duck)] rounded-full blur-[80px] opacity-0 mix-blend-screen pointer-events-none"></div>
            <Image ref={logoRef} src="/tarka-logo.png" alt="Tarka" width={591} height={591} priority className="relative z-10 w-[140px] md:w-[180px] h-auto object-contain drop-shadow-2xl opacity-0" />
        </div>
    );
}
