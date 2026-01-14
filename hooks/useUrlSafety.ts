'use client'

import { useState, useCallback, useRef } from 'react'

interface UrlSafetyResult {
    safe: boolean
    threats: Array<{
        threatType: string
        platformType: string
        threatEntryType: string
        threat: { url: string }
    }>
    warning?: string
}

interface UseUrlSafetyReturn {
    isChecking: boolean
    isUnsafe: boolean
    threatType: string | null
    threatMessage: string | null
    checkUrl: (url: string) => Promise<boolean>
    reset: () => void
}

const THREAT_MESSAGES: Record<string, string> = {
    'MALWARE': '⚠️ This URL may contain malware that can harm your device',
    'SOCIAL_ENGINEERING': '⚠️ This URL may be a phishing site designed to steal your information',
    'UNWANTED_SOFTWARE': '⚠️ This URL may contain unwanted software',
    'POTENTIALLY_HARMFUL_APPLICATION': '⚠️ This URL may contain a harmful application'
}

/**
 * Custom hook for real-time URL safety checking
 * Uses Google Safe Browsing API via our internal endpoint
 */
export function useUrlSafety(): UseUrlSafetyReturn {
    const [isChecking, setIsChecking] = useState(false)
    const [isUnsafe, setIsUnsafe] = useState(false)
    const [threatType, setThreatType] = useState<string | null>(null)
    const [threatMessage, setThreatMessage] = useState<string | null>(null)
    const lastCheckedUrl = useRef<string>('')

    const reset = useCallback(() => {
        setIsUnsafe(false)
        setThreatType(null)
        setThreatMessage(null)
        lastCheckedUrl.current = ''
    }, [])

    const checkUrl = useCallback(async (url: string): Promise<boolean> => {
        // Skip if URL is empty or same as last checked
        if (!url || url === lastCheckedUrl.current) {
            return !isUnsafe
        }

        // Validate URL format first
        try {
            new URL(url)
        } catch {
            reset()
            return true // Don't flag invalid URLs as unsafe
        }

        lastCheckedUrl.current = url
        setIsChecking(true)

        try {
            const response = await fetch('/api/check-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urlToCheck: url }),
            })

            const result: UrlSafetyResult = await response.json()

            if (!result.safe && result.threats && result.threats.length > 0) {
                const threat = result.threats[0].threatType
                setIsUnsafe(true)
                setThreatType(threat)
                setThreatMessage(THREAT_MESSAGES[threat] || '⚠️ This URL has been flagged as potentially dangerous')
                return false
            } else {
                reset()
                return true
            }
        } catch (error) {
            console.error('Error checking URL safety:', error)
            // On error, don't block the user but reset state
            reset()
            return true
        } finally {
            setIsChecking(false)
        }
    }, [isUnsafe, reset])

    return {
        isChecking,
        isUnsafe,
        threatType,
        threatMessage,
        checkUrl,
        reset
    }
}

/**
 * Hook for checking multiple URLs at once (for rotators)
 */
export function useMultipleUrlsSafety() {
    const [isChecking, setIsChecking] = useState(false)
    const [unsafeUrls, setUnsafeUrls] = useState<string[]>([])
    const [threats, setThreats] = useState<Array<{ url: string; threatType: string }>>([])

    const reset = useCallback(() => {
        setUnsafeUrls([])
        setThreats([])
    }, [])

    const checkUrls = useCallback(async (urls: string[]): Promise<boolean> => {
        if (!urls || urls.length === 0) {
            reset()
            return true
        }

        // Filter valid URLs
        const validUrls = urls.filter(url => {
            try {
                new URL(url)
                return true
            } catch {
                return false
            }
        })

        if (validUrls.length === 0) {
            reset()
            return true
        }

        setIsChecking(true)

        try {
            const response = await fetch('/api/check-url', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: validUrls }),
            })

            const result = await response.json()

            if (!result.safe && result.threats && result.threats.length > 0) {
                const unsafe = result.threats.map((t: { threat: { url: string }; threatType: string }) => t.threat.url)
                const threatInfo = result.threats.map((t: { threat: { url: string }; threatType: string }) => ({
                    url: t.threat.url,
                    threatType: t.threatType
                }))
                setUnsafeUrls(unsafe)
                setThreats(threatInfo)
                return false
            } else {
                reset()
                return true
            }
        } catch (error) {
            console.error('Error checking URLs safety:', error)
            reset()
            return true
        } finally {
            setIsChecking(false)
        }
    }, [reset])

    return {
        isChecking,
        unsafeUrls,
        threats,
        checkUrls,
        reset,
        hasUnsafeUrls: unsafeUrls.length > 0
    }
}
