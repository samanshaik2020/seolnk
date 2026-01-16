import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, CheckCircle, Eye, Server, AlertTriangle, UserCheck, ShieldCheck, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Security & Trust | SEOLnk - A Safe Platform You Can Trust',
    description: 'Learn why SEOLnk is a secure and trustworthy link management platform. SSL encryption, Safe Browsing protection, no data selling, and abuse prevention.',
};

export default function SecurityPage() {
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
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold">Security & Trust</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Built for Your Safety
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Your security and privacy are our top priorities. See why thousands of users trust SEOLnk to manage their links safely.
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

            {/* Trust Badges */}
            <section className="py-12 sm:py-16 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {/* SSL Badge */}
                            <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-sm">
                                <Lock className="h-10 w-10 text-blue-600 mb-3" />
                                <h3 className="font-bold text-sm text-center">SSL Encrypted</h3>
                                <p className="text-xs text-muted-foreground text-center mt-1">256-bit</p>
                            </div>

                            {/* Safe Browsing Badge */}
                            <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800 shadow-sm">
                                <ShieldCheck className="h-10 w-10 text-green-600 mb-3" />
                                <h3 className="font-bold text-sm text-center">Safe Browsing</h3>
                                <p className="text-xs text-muted-foreground text-center mt-1">Google Powered</p>
                            </div>

                            {/* No Data Selling Badge */}
                            <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 shadow-sm">
                                <Eye className="h-10 w-10 text-purple-600 mb-3" />
                                <h3 className="font-bold text-sm text-center">No Data Selling</h3>
                                <p className="text-xs text-muted-foreground text-center mt-1">Privacy First</p>
                            </div>

                            {/* Abuse Prevention Badge */}
                            <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-200 dark:border-red-800 shadow-sm">
                                <AlertTriangle className="h-10 w-10 text-red-600 mb-3" />
                                <h3 className="font-bold text-sm text-center">Abuse Prevention</h3>
                                <p className="text-xs text-muted-foreground text-center mt-1">24/7 Monitoring</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">

                        {/* SSL Encryption */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-blue-500/10">
                                    <Lock className="h-7 w-7 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold">SSL/TLS Encryption</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    All data transmitted between your browser and our servers is protected with industry-standard
                                    <strong> 256-bit SSL encryption</strong>. This ensures that your sensitive information,
                                    including passwords and account details, cannot be intercepted by third parties.
                                </p>

                                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                                        <h4 className="font-semibold mb-1">Secure Login</h4>
                                        <p className="text-sm text-muted-foreground">All authentication happens over encrypted connections</p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                                        <h4 className="font-semibold mb-1">Protected APIs</h4>
                                        <p className="text-sm text-muted-foreground">All API requests are secured with HTTPS</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Google Safe Browsing */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-green-500/10">
                                    <ShieldCheck className="h-7 w-7 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold">Google Safe Browsing Protection</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    We use <strong>Google Safe Browsing API</strong> to automatically scan every URL submitted to our platform.
                                    This protects both you and your audience from:
                                </p>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Malware & Viruses</h4>
                                            <p className="text-sm text-muted-foreground">Blocks links to sites distributing harmful software</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Phishing Attempts</h4>
                                            <p className="text-sm text-muted-foreground">Prevents social engineering scams and fake login pages</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Unwanted Software</h4>
                                            <p className="text-sm text-muted-foreground">Rejects links to deceptive or harmful downloads</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Privacy Commitment */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-purple-500/10">
                                    <Eye className="h-7 w-7 text-purple-600" />
                                </div>
                                <h2 className="text-3xl font-bold">We Never Sell Your Data</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    Your data belongs to you. Period. We do not and will never sell your personal information,
                                    usage data, or analytics to third parties.
                                </p>

                                <div className="mt-6 p-6 rounded-xl bg-purple-500/10 border-2 border-purple-500/30">
                                    <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-4">Our Privacy Promise:</h3>
                                    <ul className="space-y-2 text-base">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Your link analytics are private and visible only to you</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>We don't share your data with advertisers or brokers</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Your account information is never sold or traded</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>You can export or delete your data at any time</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Data Security */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-blue-500/10">
                                    <Database className="h-7 w-7 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold">Secure Data Storage</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    We partner with <strong>Supabase</strong>, a trusted cloud database provider, to ensure
                                    your data is stored securely with enterprise-grade infrastructure.
                                </p>

                                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                                        <Server className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-sm">Encrypted Storage</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Data at rest is encrypted</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                                        <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-sm">Regular Backups</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Automated daily backups</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50 border text-center">
                                        <Lock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-sm">Access Controls</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Row-level security (RLS)</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Abuse Prevention */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-red-500/10">
                                    <AlertTriangle className="h-7 w-7 text-red-600" />
                                </div>
                                <h2 className="text-3xl font-bold">Abuse Prevention & Monitoring</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    We actively monitor platform activity to prevent abuse, spam, and malicious behavior.
                                    Our automated systems work 24/7 to maintain a safe environment.
                                </p>

                                <div className="mt-6 space-y-4">
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <h4 className="font-semibold mb-2">Real-Time URL Screening</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Every link is checked before creation to ensure it's safe and compliant with our policies.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <h4 className="font-semibold mb-2">Automated Monitoring</h4>
                                        <p className="text-sm text-muted-foreground">
                                            We continuously monitor for suspicious activity patterns and take immediate action when detected.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <h4 className="font-semibold mb-2">User Reporting</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Our team reviews reported content and takes swift action against policy violations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Compliance */}
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-yellow-500/10">
                                    <UserCheck className="h-7 w-7 text-yellow-600" />
                                </div>
                                <h2 className="text-3xl font-bold">Compliance & Standards</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-lg text-muted-foreground mb-4">
                                    SEOLnk follows industry best practices and complies with relevant regulations to protect your rights and data.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                                        <h4 className="font-semibold">Transparent Policies</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Clear <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-muted/50 border">
                                        <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
                                        <h4 className="font-semibold">User Rights</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Full data access, export, and deletion capabilities
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Get in Touch */}
                        <section className="mb-12">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 text-center">
                                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-3">Have Security Concerns?</h2>
                                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                    We take security seriously. If you have questions or want to report a security issue,
                                    please reach out to our team immediately.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                                        <a href="mailto:support@seolnk.com">Contact Support</a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/privacy">View Privacy Policy</Link>
                                    </Button>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </article>

        </div>
    );
}
