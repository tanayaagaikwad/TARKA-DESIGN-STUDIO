"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!overlayRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Duck-blue overlay wipe
            tl.to(overlayRef.current, {
                height: 0,
                duration: 0.8,
                ease: 'power4.inOut',
            });

            // Content scale and fade
            tl.from(contentRef.current, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
            }, "-=0.4");

        });

        return () => ctx.revert();
    }, [pathname]);

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[600] bg-[var(--duck)] pointer-events-none"
                style={{ transformOrigin: 'top' }}
            />
            <div ref={contentRef}>
                {children}
            </div>
        </>
    );
}
