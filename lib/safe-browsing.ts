/**
 * Server-side utility for checking URLs against Google Safe Browsing API
 * Use this in your API routes to validate URLs before saving them
 */

interface SafeBrowsingMatch {
    threatType: string;
    platformType: string;
    threatEntryType: string;
    threat: { url: string };
}

interface SafeBrowsingResponse {
    matches?: SafeBrowsingMatch[];
}

export interface SafetyCheckResult {
    safe: boolean;
    threats: SafeBrowsingMatch[];
    warning?: string;
}

export interface BatchSafetyCheckResult {
    allSafe: boolean;
    unsafeUrls: string[];
    threats: SafeBrowsingMatch[];
    warning?: string;
}

/**
 * Check a single URL against Google Safe Browsing API
 * @param url The URL to check
 * @returns SafetyCheckResult with safe status and any threats found
 */
export async function checkUrlSafety(url: string): Promise<SafetyCheckResult> {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

    if (!apiKey) {
        console.warn('Safe Browsing API key not configured');
        return {
            safe: true,
            threats: [],
            warning: 'Safe Browsing check skipped - API key not configured'
        };
    }

    try {
        const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

        const payload = {
            client: {
                clientId: "seolnk",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url }]
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Safe Browsing API error:', response.status);
            return {
                safe: true,
                threats: [],
                warning: 'Safe Browsing check failed - API error'
            };
        }

        const data: SafeBrowsingResponse = await response.json();
        const isUnsafe = !!data.matches && data.matches.length > 0;

        return {
            safe: !isUnsafe,
            threats: data.matches || []
        };
    } catch (error) {
        console.error('Safe Browsing check error:', error);
        return {
            safe: true,
            threats: [],
            warning: 'Safe Browsing check failed - network error'
        };
    }
}

/**
 * Check multiple URLs against Google Safe Browsing API in a single request
 * More efficient than checking URLs one by one
 * @param urls Array of URLs to check
 * @returns BatchSafetyCheckResult with overall safety and per-URL results
 */
export async function checkMultipleUrlsSafety(urls: string[]): Promise<BatchSafetyCheckResult> {
    if (!urls || urls.length === 0) {
        return {
            allSafe: true,
            unsafeUrls: [],
            threats: []
        };
    }

    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

    if (!apiKey) {
        console.warn('Safe Browsing API key not configured');
        return {
            allSafe: true,
            unsafeUrls: [],
            threats: [],
            warning: 'Safe Browsing check skipped - API key not configured'
        };
    }

    try {
        const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

        const payload = {
            client: {
                clientId: "seolnk",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: urls.map(url => ({ url }))
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Safe Browsing API error:', response.status);
            return {
                allSafe: true,
                unsafeUrls: [],
                threats: [],
                warning: 'Safe Browsing check failed - API error'
            };
        }

        const data: SafeBrowsingResponse = await response.json();
        const unsafeUrls = data.matches?.map(m => m.threat.url) || [];

        return {
            allSafe: !data.matches || data.matches.length === 0,
            unsafeUrls,
            threats: data.matches || []
        };
    } catch (error) {
        console.error('Safe Browsing batch check error:', error);
        return {
            allSafe: true,
            unsafeUrls: [],
            threats: [],
            warning: 'Safe Browsing check failed - network error'
        };
    }
}

/**
 * Get a human-readable description of a threat type
 */
export function getThreatDescription(threatType: string): string {
    const descriptions: Record<string, string> = {
        'MALWARE': 'This URL may contain malware',
        'SOCIAL_ENGINEERING': 'This URL may be a phishing site',
        'UNWANTED_SOFTWARE': 'This URL may contain unwanted software',
        'POTENTIALLY_HARMFUL_APPLICATION': 'This URL may contain a harmful application'
    };

    return descriptions[threatType] || 'This URL has been flagged as potentially dangerous';
}
