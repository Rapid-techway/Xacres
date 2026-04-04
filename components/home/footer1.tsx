'use client';

import Link from 'next/link';
import Logo from '@/components/navbar/Logo';
import { motion } from 'framer-motion';

export function Footer1() {
    const year = new Date().getFullYear();

    return (
        <div
            className="relative h-[500px]"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="relative h-[calc(100vh+500px)] -top-[100vh]">
                <div className="h-[500px] sticky top-[calc(100vh-500px)]">

                    <footer className="w-full h-full bg-[#05070a] text-white relative overflow-hidden pt-16 pb-10 flex flex-col justify-between">

                        {/* 🌌 BACKGROUND GRADIENT LAYER */}
                        <div className="absolute inset-0 pointer-events-none">

                            {/* soft blue glow */}
                            <div className="absolute top-[-20%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px]" />

                            {/* bottom gradient depth */}
                            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/60" />

                        </div>

                        {/* 🔤 BIG BACKGROUND TEXT WITH GRADIENT */}
                        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                            <h1 className="text-[25vw] sm:text-[20vw] font-[900] tracking-tight leading-none select-none bg-gradient-to-r from-white/10 via-white/12 to-white/3 bg-clip-text text-transparent">
                                XACRES
                            </h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 max-w-7xl mx-auto px-6 w-full"
                        >

                            {/* TOP GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

                                {/* LOGO + COPYRIGHT */}
                                <div className="col-span-2 md:col-span-2 space-y-4">
                                    <div className="scale-90 -ml-3 origin-left">
                                        <Logo variant="light" />
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        © {year} Xacres. All rights reserved.
                                    </p>
                                </div>

                                {/* PAGES */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-4 text-gray-300">Pages</h4>
                                    <ul className="space-y-2 text-sm text-gray-500">
                                        <li><Link href="/" className="hover:text-white">Map View</Link></li>
                                        <li><Link href="/lands" className="hover:text-white">Lands</Link></li>
                                        <li><Link href="#" className="hover:text-white">How It Works</Link></li>
                                    </ul>
                                </div>


                                {/* LEGAL */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-4 text-gray-300">Legal</h4>
                                    <ul className="space-y-2 text-sm text-gray-500">
                                        <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                                        <li><Link href="#" className="hover:text-white">Terms</Link></li>
                                        <li><Link href="#" className="hover:text-white">Cookies</Link></li>
                                    </ul>
                                </div>

                            </div>

                        </motion.div>
                    </footer>

                </div>
            </div>
        </div>
    );
}