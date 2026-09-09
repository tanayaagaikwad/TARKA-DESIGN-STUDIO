"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Our Work', href: '/work' },
    { name: 'Clients', href: '/clients' },
    { name: 'Team', href: '/team' },
    { name: 'Blog', href: '/blog' },
    { name: 'Founder', href: '/founder' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between py-4 px-[var(--gutter)] bg-[#0a0a0a]/40 backdrop-blur-md border-b border-white/5 text-white transition-all duration-300">
                <Link href="/" className="flex items-center gap-2 relative z-[501]">
                    <span className="font-serif font-bold text-xl tracking-tight">TARKA</span>
                </Link>


                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-[13.5px] relative group py-2 ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}`}
                            >
                                {link.name}
                                <span className={`absolute left-0 bottom-1 w-full h-[1px] bg-current transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/quote"
                        className="text-[12.5px] border border-white/30 px-5 py-[10px] rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                        Get a Quote
                    </Link>
                </div>


                <button
                    className="lg:hidden relative z-[501] p-2 -mr-2 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-[490] bg-[var(--ink)] text-white flex flex-col justify-center px-[var(--gutter)] transition-transform duration-500 ease-[var(--ease)] ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="flex flex-col gap-2">
                    <Link href="/" className="font-serif text-[clamp(28px,9vw,48px)] py-3 border-b border-[var(--line-on-ink)]">Home</Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="font-serif text-[clamp(28px,9vw,48px)] py-3 border-b border-[var(--line-on-ink)]"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-8">
                        <Link
                            href="/quote"
                            className="inline-block text-[15px] border border-white px-8 py-4 rounded-full hover:bg-white hover:text-[var(--ink)] transition-colors"
                        >
                            Get a Quote
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
