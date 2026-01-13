import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Pricing | SEOLnk - Plans Coming Soon',
    description: 'SEOLnk pricing plans are coming soon. Sign up to be notified when we launch our pricing tiers.',
};

export default function PricingPage() {
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
            <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold">Pricing</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Pricing Plans Coming Soon
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                            We're finalizing our pricing tiers to offer the best value for your needs.
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

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">

                        {/* Coming Soon Card */}
                        <div className="p-8 sm:p-12 rounded-2xl border bg-card text-center mb-12">
                            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
                                <Clock className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                We're Working on It!
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Our pricing plans are being carefully crafted to provide maximum value. We'll have flexible
                                options for individuals, teams, and enterprises.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/signup">
                                        <Bell className="mr-2 h-5 w-5" />
                                        Get Notified
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/features">
                                        View Features
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* What to Expect */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 text-center">What to Expect</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl bg-muted/30 border">
                                    <h4 className="font-bold mb-2">💎 Free Tier</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Perfect for getting started with essential link management features.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl bg-muted/30 border">
                                    <h4 className="font-bold mb-2">🚀 Pro Plans</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Advanced features for professionals and growing businesses.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl bg-muted/30 border">
                                    <h4 className="font-bold mb-2">🏢 Enterprise</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Custom solutions with dedicated support and SLAs.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl bg-muted/30 border">
                                    <h4 className="font-bold mb-2">🎓 Education Discounts</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Special pricing for students, educators, and non-profits.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Current Features */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                            <h3 className="text-2xl font-bold mb-4">Try SEOLnk Today</h3>
                            <p className="text-muted-foreground mb-6">
                                While we finalize our pricing, you can start using SEOLnk and explore all our features.
                                Sign up now and be among the first to access our new pricing plans when they launch.
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    Get Started Free
                                </Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">
                            Be the First to Know
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Want to be notified when our pricing plans are available?
                            <Link href="/contact" className="text-primary hover:underline ml-1">
                                Contact us
                            </Link> to join our waitlist.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
