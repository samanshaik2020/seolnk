

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.6, 0.9], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.6, 0.9], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <section ref={targetRef} className="relative min-h-[120vh] flex items-start justify-center pt-32 overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10 bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse"></div>
            </div>

            <motion.div
                style={{ opacity, scale, y }}
                className="container mx-auto px-4 text-center relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>The Future of Link Previews</span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8">
                    Make Your Links <br />
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                        Impossible to Ignore
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                    Craft stunning, custom social media previews that stop the scroll.
                    Real-time analytics, smart rotators, and total control over your brand.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_30px_-5px_var(--color-primary)] hover:shadow-[0_0_50px_-10px_var(--color-primary)] transition-shadow duration-500" asChild>
                        <Link href="/login?next=/dashboard">
                            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 bg-background/50 backdrop-blur-sm hover:bg-muted/50" asChild>
                        <Link href="#features">
                            See How It Works
                        </Link>
                    </Button>
                </div>

                {/* Floating UI Elements Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.4, duration: 1, type: "spring" }}
                    className="mt-20 mx-auto max-w-5xl rounded-2xl border border-white/20 bg-background/95 backdrop-blur-md shadow-2xl p-2 md:p-4 transform preserve-3d ring-1 ring-black/5 dark:ring-white/10"
                    style={{ perspective: "1000px" }}
                >
                    <div className="rounded-xl border border-border/50 bg-card overflow-hidden relative shadow-inner">
                        {/* Mock Browser Header */}
                        <div className="h-10 border-b bg-muted/50 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5 ml-0 mr-4">
                                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-sm"></div>
                            </div>
                            <div className="h-6 bg-background rounded-md w-full max-w-sm ml-4 border shadow-sm flex items-center px-3 text-xs text-foreground/70 font-medium">
                                seolnk.com/dashboard/create
                            </div>
                        </div>

                        {/* Mock App Interface */}
                        <div className="bg-background md:h-[400px] flex flex-col md:flex-row">
                            {/* Sidebar Mock */}
                            <div className="w-16 border-r flex flex-col items-center py-4 gap-4 bg-muted/20 hidden md:flex">
                                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-muted-foreground/20"></div>
                                <div className="w-8 h-8 rounded-lg bg-muted-foreground/20"></div>
                                <div className="mt-auto w-8 h-8 rounded-full bg-muted-foreground/20"></div>
                            </div>

                            {/* Main Content Mock */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                {/* Editor Area */}
                                <div className="flex-1 space-y-5">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-5 w-32 bg-foreground/10 rounded-md text-sm font-semibold text-foreground/80 flex items-center px-2">Edit Link</div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase">Active</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Destination URL</label>
                                        <div className="h-9 w-full border rounded-md bg-background flex items-center px-3 shadow-sm ring-1 ring-black/5">
                                            <span className="text-sm text-foreground/80 truncate">https://store.myshop.com/products/summer-sale</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Custom Title</label>
                                        <div className="h-9 w-full border rounded-md bg-background flex items-center px-3 shadow-sm ring-1 ring-black/5">
                                            <span className="text-sm text-foreground/80 truncate">Summer Collection 50% Off | MyShop</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">Description</label>
                                        <div className="h-20 w-full border rounded-md bg-background p-3 shadow-sm ring-1 ring-black/5">
                                            <p className="text-sm text-muted-foreground leading-snug">
                                                Don&apos;t miss out on our biggest sale of the year. Shop the latest styles at half price for a limited time only.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <div className="h-9 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow-lg shadow-primary/20 flex items-center justify-center">Save Changes</div>
                                        <div className="h-9 px-4 bg-background border border-border text-foreground/70 text-xs font-semibold rounded-md flex items-center justify-center">Cancel</div>
                                    </div>
                                </div>

                                {/* Preview Area */}
                                <div className="w-full md:w-80 shrink-0">
                                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Social Preview</div>
                                    <div className="rounded-xl border bg-card shadow-2xl shadow-black/5 overflow-hidden ring-1 ring-black/5">
                                        <div className="aspect-[1.91/1] bg-muted/30 relative flex items-center justify-center border-b">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
                                            <div className="w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-primary" />
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-1 bg-card">
                                            <p className="font-semibold text-sm text-foreground truncate">Summer Collection 50% Off | MyShop</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                Don&apos;t miss out on our biggest sale of the year. Shop the latest styles at half price for a limited time only.
                                            </p>
                                        </div>
                                        <div className="px-4 py-2 border-t bg-muted/10 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                                            <span>myshop.com</span>
                                            <span className="text-primary truncate max-w-[80px]">Learn More</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
