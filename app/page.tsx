'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Repeat, Share2, Zap, BarChart3, Globe, ShieldCheck, Link as LinkIcon } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
              <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight font-serif">SEOLnk</span>
          </Link>
          <nav>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10"></div>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-xs sm:text-sm font-semibold leading-7 text-primary mb-2 uppercase tracking-wide">Workflow</h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">Three Simple Steps</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Get from zero to a stunning social preview in seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10"></div>

              {/* Step 1 */}
              <div className="relative group">
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-background border border-primary/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative z-10 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-2xl sm:text-3xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Create</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center px-2 sm:px-4">
                  Enter your destination URL and customize your title, description, and image.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-background border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative z-10 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-purple-500/5 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-2xl sm:text-3xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Share</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center px-2 sm:px-4">
                  Copy your new short link and share it on any social media platform.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-background border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative z-10 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Analyze</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center px-2 sm:px-4">
                  Watch the clicks roll in and track performance in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight px-2">Ready to <span className="text-primary">Stand Out?</span></h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
              Join thousands of creators who are owning their social media presence.
            </p>
            <Button size="lg" className="h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 text-base sm:text-lg md:text-xl rounded-full shadow-2xl hover:scale-105 transition-transform" asChild>
              <Link href="/login?next=/dashboard">
                Start for Free
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 sm:py-10 md:py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-1 sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="relative h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center bg-primary/10 rounded-md text-primary">
                  <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span className="font-bold text-base sm:text-lg font-serif">SEOLnk</span>
              </Link>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs">
                The ultimate tool for creating beautiful social media previews and smart rotating links.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Link Render. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
