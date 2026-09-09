"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on desktop
        if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        setIsVisible(true);

        const onMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                gsap.to(cursorRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.15,
                    ease: "power2.out"
                });
            }
        };

        const onMouseDown = () => {
            if (cursorRef.current) {
                gsap.to(cursorRef.current, { scale: 0.8, duration: 0.1 });
            }
        };

        const onMouseUp = () => {
            if (cursorRef.current) {
                gsap.to(cursorRef.current, { scale: 1, duration: 0.1 });
            }
        };

        // Add hover states for links/buttons
        const onMouseEnter = () => {
            if (cursorRef.current) gsap.to(cursorRef.current, { scale: 2, opacity: 0.5, backgroundColor: 'var(--duck)', duration: 0.2 });
        };
        const onMouseLeave = () => {
            if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1, opacity: 1, backgroundColor: 'white', duration: 0.2 });
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        // Initial attach
        const iterables = document.querySelectorAll('a, button');
        iterables.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        // Observer for dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newIterables = document.querySelectorAll('a, button');
                    newIterables.forEach((el) => {
                        el.removeEventListener('mouseenter', onMouseEnter);
                        el.removeEventListener('mouseleave', onMouseLeave);
                        el.addEventListener('mouseenter', onMouseEnter);
                        el.addEventListener('mouseleave', onMouseLeave);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
            observer.disconnect();
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 will-change-transform shadow-[0_0_10px_rgba(255,255,255,0.3)] hidden md:block"
        ></div>
    );
}
