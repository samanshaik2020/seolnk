// Alias validation utilities

// Reserved aliases that would conflict with site routes
export const RESERVED_ALIASES = [
    'login',
    'signup',
    'register',
    'dashboard',
    'api',
    'admin',
    'pricing',
    'settings',
    'help',
    'support',
    'about',
    'contact',
    'terms',
    'privacy',
    'blog',
    'docs',
    'analytics',
    'create',
    'edit',
    'delete',
    'profile',
    'account',
    'billing',
    'logout',
    'signout',
    'auth',
    'callback',
    'verify',
    'reset',
    'password',
    'app',
    'www',
    'mail',
    'email',
    'ftp',
    'cdn',
    'static',
    'assets',
    'images',
    'img',
    'css',
    'js',
    'fonts',
    'favicon',
    'robots',
    'sitemap',
    'p',  // preview links route
    'r',  // rotator links route
    'e',  // expiring links route
    's',  // protected links route
    'c',  // custom alias route (reserved for future)
]

// Offensive/inappropriate words to block
export const BLOCKED_WORDS = [
    'admin',
    'administrator',
    'root',
    'system',
    'null',
    'undefined',
    'test',
    'fuck',
    'shit',
    'ass',
    'bitch',
    'damn',
    'porn',
    'sex',
    'xxx',
    'nude',
    'naked',
    'drug',
    'kill',
    'die',
    'death',
    'hate',
    'nazi',
    'terror',
    'bomb',
    'scam',
    'phishing',
    'hack',
    'virus',
    'malware',
    'spam',
]

// Phishing-related terms to block
export const PHISHING_TERMS = [
    'google-login',
    'facebook-login',
    'apple-login',
    'microsoft-login',
    'paypal-login',
    'amazon-login',
    'bank-login',
    'verify-account',
    'confirm-identity',
    'secure-login',
    'update-payment',
    'suspended-account',
    'verify-email',
    'account-suspended',
    'urgent-action',
    'password-reset',
    'security-alert',
]

export interface AliasValidationResult {
    valid: boolean
    error?: string
    suggestions?: string[]
}

export function validateAlias(alias: string): AliasValidationResult {
    // Trim and lowercase
    const normalizedAlias = alias.trim().toLowerCase()

    // Check minimum length
    if (normalizedAlias.length < 3) {
        return {
            valid: false,
            error: 'Alias must be at least 3 characters long'
        }
    }

    // Check maximum length
    if (normalizedAlias.length > 30) {
        return {
            valid: false,
            error: 'Alias must be 30 characters or less'
        }
    }

    // Check for spaces
    if (/\s/.test(normalizedAlias)) {
        return {
            valid: false,
            error: 'Alias cannot contain spaces. Use hyphens instead.',
            suggestions: [normalizedAlias.replace(/\s+/g, '-')]
        }
    }

    // Check for special characters (only allow letters, numbers, and hyphens)
    if (!/^[a-z0-9-]+$/.test(normalizedAlias)) {
        return {
            valid: false,
            error: 'Alias can only contain lowercase letters, numbers, and hyphens'
        }
    }

    // Check for consecutive hyphens
    if (/--/.test(normalizedAlias)) {
        return {
            valid: false,
            error: 'Alias cannot contain consecutive hyphens'
        }
    }

    // Check if starts or ends with hyphen
    if (normalizedAlias.startsWith('-') || normalizedAlias.endsWith('-')) {
        return {
            valid: false,
            error: 'Alias cannot start or end with a hyphen'
        }
    }

    // Check reserved aliases
    if (RESERVED_ALIASES.includes(normalizedAlias)) {
        return {
            valid: false,
            error: 'This alias is reserved and cannot be used',
            suggestions: generateSuggestions(normalizedAlias)
        }
    }

    // Check blocked words
    for (const word of BLOCKED_WORDS) {
        if (normalizedAlias.includes(word)) {
            return {
                valid: false,
                error: 'This alias contains inappropriate content'
            }
        }
    }

    // Check phishing terms
    for (const term of PHISHING_TERMS) {
        if (normalizedAlias.includes(term) || normalizedAlias === term.replace(/-/g, '')) {
            return {
                valid: false,
                error: 'This alias appears to be impersonating another service'
            }
        }
    }

    return { valid: true }
}

export function generateSuggestions(baseAlias: string): string[] {
    const suggestions: string[] = []
    const year = new Date().getFullYear()

    // Add number suffix
    suggestions.push(`${baseAlias}1`)
    suggestions.push(`${baseAlias}2`)

    // Add year suffix
    suggestions.push(`${baseAlias}-${year}`)

    // Add "my" prefix
    suggestions.push(`my-${baseAlias}`)

    // Add "go" prefix
    suggestions.push(`go-${baseAlias}`)

    // Add "now" suffix
    suggestions.push(`${baseAlias}-now`)

    return suggestions.filter(s => s.length <= 30)
}

export function normalizeAlias(alias: string): string {
    return alias
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}
