'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');

        if (!consent) {
            // Delay showing banner slightly for better UX
            setTimeout(() => {
                setShowBanner(true);
                setTimeout(() => setIsVisible(true), 100);
            }, 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        closeBanner();

        // Enable analytics here if needed
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted',
            });
        }
    };

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        closeBanner();

        // Disable analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'denied',
            });
        }
    };

    const closeBanner = () => {
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    if (!showBanner) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
        >
            <div className="bg-background/95 backdrop-blur-lg border-t shadow-2xl">
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Icon and Text */}
                        <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                <Cookie className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm sm:text-base mb-1">
                                    We Value Your Privacy
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    We use cookies to enhance your experience, analyze site traffic, and provide personalized content.
                                    By clicking "Accept All", you consent to our use of cookies.
                                    {' '}
                                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                                        Learn more
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReject}
                                className="flex-1 sm:flex-none"
                            >
                                Reject Non-Essential
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAccept}
                                className="flex-1 sm:flex-none"
                            >
                                Accept All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
