'use client';

import { useState, useEffect } from 'react';

export type CookieConsentStatus = 'accepted' | 'rejected' | 'pending';

export function useCookieConsent() {
    const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>('pending');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');

        if (consent === 'accepted') {
            setConsentStatus('accepted');
        } else if (consent === 'rejected') {
            setConsentStatus('rejected');
        } else {
            setConsentStatus('pending');
        }

        setIsLoading(false);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setConsentStatus('accepted');
    };

    const rejectCookies = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setConsentStatus('rejected');
    };

    const resetConsent = () => {
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-date');
        setConsentStatus('pending');
    };

    return {
        consentStatus,
        isLoading,
        hasConsent: consentStatus === 'accepted',
        hasRejected: consentStatus === 'rejected',
        isPending: consentStatus === 'pending',
        acceptCookies,
        rejectCookies,
        resetConsent,
    };
}
