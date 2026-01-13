'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookieSettingsPage() {
    const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem('cookie-consent');
        if (storedConsent === 'accepted' || storedConsent === 'rejected') {
            setConsent(storedConsent);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setConsent('accepted');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleRejectAll = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setConsent('rejected');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

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
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <Cookie className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-semibold">Cookie Settings</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Manage Your Cookie Preferences
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                            Control how we use cookies to improve your experience.
                        </p>
                    </div>
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
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-green-600">Preferences saved!</p>
                                    <p className="text-sm text-muted-foreground mt-1">Your cookie preferences have been updated.</p>
                                </div>
                            </div>
                        )}

                        {/* Current Status */}
                        <div className="mb-8 p-6 rounded-xl bg-muted/50 border">
                            <h2 className="text-xl font-bold mb-2">Current Status</h2>
                            <p className="text-muted-foreground">
                                {consent === 'accepted' && (
                                    <span className="text-green-600 font-semibold">✓ All cookies accepted</span>
                                )}
                                {consent === 'rejected' && (
                                    <span className="text-orange-600 font-semibold">Only essential cookies enabled</span>
                                )}
                                {consent === null && (
                                    <span className="text-muted-foreground">No preference set</span>
                                )}
                            </p>
                        </div>

                        {/* Cookie Categories */}
                        <div className="space-y-6 mb-8">
                            <h2 className="text-2xl font-bold">Cookie Categories</h2>

                            {/* Essential Cookies */}
                            <div className="p-6 rounded-xl border bg-card">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-blue-600/10">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg">Essential Cookies</h3>
                                            <span className="text-sm bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full font-medium">
                                                Always Active
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            Required for the website to function properly. These cannot be disabled.
                                        </p>
                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                            <li>• Authentication & login sessions</li>
                                            <li>• Security & fraud prevention</li>
                                            <li>• Basic site functionality</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="p-6 rounded-xl border bg-card">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-purple-600/10">
                                        <BarChart3 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg">Analytics Cookies</h3>
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${consent === 'accepted'
                                                    ? 'bg-green-600/10 text-green-600'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {consent === 'accepted' ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            Help us understand how visitors interact with our website.
                                        </p>
                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                            <li>• Link click tracking & analytics</li>
                                            <li>• Page view statistics</li>
                                            <li>• User behavior insights</li>
                                            <li>• Performance optimization</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={handleAcceptAll}
                                className="flex-1"
                            >
                                Accept All Cookies
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleRejectAll}
                                className="flex-1"
                            >
                                Essential Only
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 p-6 rounded-lg bg-muted/30 border">
                            <h3 className="font-semibold mb-2">Need More Information?</h3>
                            <p className="text-sm text-muted-foreground">
                                Learn more about how we use cookies and protect your data in our{' '}
                                <Link href="/privacy" className="text-primary hover:underline font-medium">
                                    Privacy Policy
                                </Link>.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
