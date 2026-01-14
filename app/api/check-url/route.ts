import { NextRequest, NextResponse } from 'next/server';

// Define types for the Safe Browsing response
interface SafeBrowsingMatch {
    threatType: string;
    platformType: string;
    threatEntryType: string;
    threat: { url: string };
}

interface SafeBrowsingResponse {
    matches?: SafeBrowsingMatch[];
}

export async function POST(request: NextRequest) {
    try {
        const { urlToCheck } = await request.json();

        if (!urlToCheck) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

        if (!apiKey) {
            console.error('Safe Browsing API key not configured');
            // If no API key is configured, allow URLs through but log a warning
            return NextResponse.json({
                safe: true,
                warning: 'Safe Browsing check skipped - API key not configured'
            });
        }

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
                threatEntries: [{ url: urlToCheck }]
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Safe Browsing API error:', response.status, await response.text());
            // On API error, allow URLs through but log
            return NextResponse.json({
                safe: true,
                warning: 'Safe Browsing check failed - API error'
            });
        }

        const data: SafeBrowsingResponse = await response.json();

        // If 'matches' is present, the URL is unsafe
        const isUnsafe = !!data.matches && data.matches.length > 0;

        return NextResponse.json({
            safe: !isUnsafe,
            threats: data.matches || []
        });

    } catch (error) {
        console.error('Safe Browsing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Also support checking multiple URLs at once
export async function PUT(request: NextRequest) {
    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

        if (!apiKey) {
            console.error('Safe Browsing API key not configured');
            return NextResponse.json({
                safe: true,
                warning: 'Safe Browsing check skipped - API key not configured',
                results: urls.map(url => ({ url, safe: true }))
            });
        }

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
            console.error('Safe Browsing API error:', response.status, await response.text());
            return NextResponse.json({
                safe: true,
                warning: 'Safe Browsing check failed - API error',
                results: urls.map(url => ({ url, safe: true }))
            });
        }

        const data: SafeBrowsingResponse = await response.json();

        // Create a map of unsafe URLs
        const unsafeUrls = new Map<string, SafeBrowsingMatch>();
        if (data.matches) {
            for (const match of data.matches) {
                unsafeUrls.set(match.threat.url, match);
            }
        }

        // Build results for each URL
        const results = urls.map(url => ({
            url,
            safe: !unsafeUrls.has(url),
            threat: unsafeUrls.get(url) || null
        }));

        const allSafe = !data.matches || data.matches.length === 0;

        return NextResponse.json({
            safe: allSafe,
            threats: data.matches || [],
            results
        });

    } catch (error) {
        console.error('Safe Browsing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
