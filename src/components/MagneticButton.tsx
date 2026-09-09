"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
}

export default function MagneticButton({
    children,
    className = '',
    variant = 'primary',
    ...props
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current || !textRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        gsap.to(buttonRef.current, { x: x * 0.3, y: y * 0.3, duration: 1, ease: 'power3.out' });
        gsap.to(textRef.current, { x: x * 0.1, y: y * 0.1, duration: 1, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current || !textRef.current) return;
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
        gsap.to(textRef.current, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    };

    const baseClasses = "relative inline-flex items-center gap-2 text-[14px] px-6 py-[12px] rounded-full transition-colors duration-300 overflow-hidden";
    const variants = {
        primary: "bg-[var(--duck)] text-white hover:bg-[#0d6f84]",
        secondary: "bg-white text-[var(--ink)] hover:bg-[#f4f5f4]",
        outline: "border border-white/40 text-white hover:bg-white hover:text-[var(--ink)] backdrop-blur-sm"
    };

    return (
        <button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            <span ref={textRef} className="flex items-center gap-2 w-full h-full pointer-events-none">
                {children}
            </span>
        </button>
    );
}
