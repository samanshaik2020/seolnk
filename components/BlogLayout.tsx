'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface BlogLayoutProps {
    title: string;
    subtitle: string;
    badgeText: string;
    badgeIcon: ReactNode;
    gradientFrom: string;
    gradientTo: string;
    ctaText: string;
    ctaLink: string;
    children: ReactNode;
}

export function BlogLayout({
    title,
    subtitle,
    badgeText,
    badgeIcon,
    gradientFrom,
    gradientTo,
    ctaText,
    ctaLink,
    children
}: BlogLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Button variant="ghost" asChild className="group">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={ctaLink}>
                                {ctaText}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            {badgeIcon}
                            <span className="text-sm font-semibold">{badgeText}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                            {subtitle}
                        </p>

                        {/* CTA */}
                        <Button size="lg" asChild className="shadow-2xl h-12 sm:h-14 px-8 text-base sm:text-lg">
                            <Link href={ctaLink} className="group">
                                {ctaText}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                            fill="hsl(var(--background))"
                        />
                    </svg>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </div>
            </article>

            {/* Footer CTA */}
            <section className="py-16 sm:py-20 bg-muted/30 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join thousands of users creating powerful links
                        </p>
                        <Button size="lg" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                            <Link href={ctaLink} className="group">
                                {ctaText}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
