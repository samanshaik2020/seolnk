# Cookie Consent Implementation

## Overview
This project includes a GDPR-compliant cookie consent system that allows users to accept or reject non-essential cookies.

## Features
- ✅ GDPR & CCPA compliant
- ✅ Non-intrusive banner at bottom of page
- ✅ Saves user preferences in localStorage
- ✅ Blocks analytics until consent is given
- ✅ Cookie preferences page
- ✅ Smooth animations
- ✅ Responsive design

## Files Created

### 1. Components
- **`components/CookieConsent.tsx`** - Main cookie banner component
  - Shows on first visit
  - Accept/Reject buttons
  - Links to Privacy Policy
  - Saves preferences to localStorage

### 2. Hooks
- **`hooks/useCookieConsent.ts`** - Custom hook for managing consent state
  - `consentStatus`: 'accepted' | 'rejected' | 'pending'
  - `hasConsent`: boolean
  - `acceptCookies()`: Function to accept cookies
  - `rejectCookies()`: Function to reject cookies
  - `resetConsent()`: Function to reset preferences

### 3. Pages
- **`app/cookies/page.tsx`** - Cookie settings page
  - View current preferences
  - Change cookie settings
  - See cookie categories (Essential, Analytics)

## How It Works

### 1. Banner Display
When a user visits the site for the first time:
- Banner appears after 1 second delay
- Shows at bottom of screen
- Gives options: "Accept All" or "Reject Non-Essential"

### 2. Consent Storage
Preferences are stored in `localStorage`:
```javascript
localStorage.getItem('cookie-consent') // 'accepted' | 'rejected'
localStorage.getItem('cookie-consent-date') // ISO date string
```

### 3. Cookie Categories

#### Essential Cookies (Always Active)
- Authentication & login sessions
- Security tokens
- Basic site functionality
- **No consent required**

#### Analytics Cookies (Optional)
- Link click tracking
- Page view statistics
- User behavior insights
- **Requires user consent**

## Usage in Components

### Check if user has consented
```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent';

function MyComponent() {
  const { hasConsent, isPending } = useCookieConsent();
  
  // Only load analytics if user consented
  if (hasConsent) {
    // Initialize analytics
  }
}
```

### Programmatically update consent
```tsx
const { acceptCookies, rejectCookies } = useCookieConsent();

// Accept all cookies
acceptCookies();

// Reject non-essential cookies
rejectCookies();
```

## Integration Points

### Root Layout (`app/layout.tsx`)
The `<CookieConsent />` component is added to the root layout:
```tsx
<body>
  <main>{children}</main>
  <Footer />
  <CookieConsent />
</body>
```

### Footer Links
All footers include a "Cookies" link pointing to `/cookies`

## Compliance Notes

### GDPR Requirements ✅
- ✅ Clear consent mechanism
- ✅ Granular options (Accept/Reject)
- ✅ Easy to withdraw consent
- ✅ Link to Privacy Policy
- ✅ Non-essential cookies blocked by default

### CCPA Requirements ✅
- ✅ "Do Not Sell My Data" equivalent (Reject button)
- ✅ Notice at collection
- ✅ Link to privacy policy

## Customization

### Change Banner Delay
Edit `components/CookieConsent.tsx`:
```tsx
setTimeout(() => {
  setShowBanner(true);
}, 1000); // Change delay here (milliseconds)
```

### Add New Cookie Categories
1. Update `app/cookies/page.tsx` with new category
2. Add new localStorage keys
3. Update Privacy Policy to mention new cookies

### Styling
The banner uses your existing design system:
- `Button` components from `@/components/ui/button`
- Tailwind classes for consistency
- Animations with Tailwind transitions

## Testing

### Test Banner Display
1. Open site in incognito mode
2. Banner should appear after 1 second
3. Click "Accept All" or "Reject Non-Essential"
4. Refresh page - banner should not appear again

### Test Preference Changes
1. Go to `/cookies`
2. Change preferences
3. Check localStorage:
   ```javascript
   localStorage.getItem('cookie-consent')
   ```

### Reset for Testing
Clear localStorage:
```javascript
localStorage.removeItem('cookie-consent');
localStorage.removeItem('cookie-consent-date');
```

## Analytics Integration

If you're using Google Analytics, update the consent:
```tsx
// Accept
window.gtag('consent', 'update', {
  analytics_storage: 'granted',
});

// Reject
window.gtag('consent', 'update', {
  analytics_storage: 'denied',
});
```

This is already implemented in the `CookieConsent` component.

## Best Practices

1. **Never block essential cookies** - Users must be able to use your site
2. **Respect user choice** - Don't repeatedly ask if they reject
3. **Keep it simple** - Don't overwhelm with too many options
4. **Be transparent** - Clearly explain what each cookie does
5. **Update Privacy Policy** - Keep it in sync with actual cookie usage

## Maintenance

### When to Update
- Adding new tracking tools
- Changing cookie behavior
- Adding new features that use cookies
- Legal requirement changes

### Regular Reviews
- Review cookie list quarterly
- Update Privacy Policy as needed
- Test banner functionality after updates
- Check localStorage persistence

## Support

For questions or issues:
- Check Privacy Policy at `/privacy`
- Contact page at `/contact`
- Cookie settings at `/cookies`
