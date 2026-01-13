'use client'

import Link from 'next/link'
import { Link as LinkIcon, ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthButton from '@/components/AuthButton'
import { LandingHero } from '@/components/LandingHero'
import { useState } from 'react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="relative h-9 w-9 flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 rounded-xl text-white shadow-lg shadow-primary/20">
              <LinkIcon className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">SEO</span>Lnk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/analytics-info" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <AuthButton />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                href="/features"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/analytics-info"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="mt-2 pt-4 border-t">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <LandingHero />
      </main>

      {/* Footer */}
      <footer className="py-12 sm:py-16 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="relative h-8 w-8 flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 rounded-lg text-white">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">
                  <span className="text-primary">SEO</span>Lnk
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                The ultimate link management platform for creators, marketers, and businesses. Create, customize, protect, and track your links.
              </p>
              <Button asChild>
                <Link href="/login?next=/dashboard">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/analytics-info" className="hover:text-foreground transition-colors">Analytics</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Tools</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/blog/preview-links" className="hover:text-foreground transition-colors">Preview Links</Link></li>
                <li><Link href="/blog/alias-links" className="hover:text-foreground transition-colors">Custom Aliases</Link></li>
                <li><Link href="/blog/rotator-links" className="hover:text-foreground transition-colors">Link Rotators</Link></li>
                <li><Link href="/blog/expiring-links" className="hover:text-foreground transition-colors">Expiring Links</Link></li>
                <li><Link href="/blog/protected-links" className="hover:text-foreground transition-colors">Protected Links</Link></li>
                <li><Link href="/blog/bio-links" className="hover:text-foreground transition-colors">Bio Pages</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Settings</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>


        </div>
      </footer>
    </div>
  )
}
