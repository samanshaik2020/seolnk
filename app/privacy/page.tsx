import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Privacy Policy | SEOLnk - Link Management Platform',
    description: 'Learn how SEOLnk collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
};

export default function PrivacyPolicyPage() {
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
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold">Privacy Policy</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Your Privacy Matters
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                            Last Updated: January 14, 2026
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

            {/* Content */}
            <article className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">

                        {/* Introduction */}
                        <section className="mb-12">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                At SEOLnk, we are committed to protecting your privacy and ensuring the security of your personal information.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our link management platform.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold m-0">1. Information We Collect</h2>
                            </div>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
                            <ul className="space-y-2">
                                <li>Account information (email address, username, password)</li>
                                <li>Profile details (name, company name, profile picture)</li>
                                <li>Billing information (processed securely through third-party payment providers)</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
                            <ul className="space-y-2">
                                <li>Links you create, edit, or delete</li>
                                <li>Click analytics and statistics</li>
                                <li>Campaign data and organization preferences</li>
                                <li>Device information (browser type, IP address, operating system)</li>
                                <li>Log data (access times, pages viewed, actions taken)</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <UserCheck className="h-6 w-6 text-green-600" />
                                <h2 className="text-2xl font-bold m-0">2. How We Use Your Information</h2>
                            </div>

                            <p>We use the collected information for:</p>
                            <ul className="space-y-2">
                                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our link management services</li>
                                <li><strong>Analytics:</strong> To track link performance and provide you with detailed statistics</li>
                                <li><strong>Communication:</strong> To send you service updates, security alerts, and support messages</li>
                                <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
                                <li><strong>Personalization:</strong> To customize your experience and provide relevant features</li>
                                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                            </ul>
                        </section>

                        {/* Data Sharing */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="h-6 w-6 text-purple-600" />
                                <h2 className="text-2xl font-bold m-0">3. Data Sharing and Disclosure</h2>
                            </div>

                            <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
                            <ul className="space-y-2">
                                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform (e.g., hosting, analytics, payment processing)</li>
                                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental request</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="h-6 w-6 text-red-600" />
                                <h2 className="text-2xl font-bold m-0">4. Data Security</h2>
                            </div>

                            <p>We implement industry-standard security measures to protect your data:</p>
                            <ul className="space-y-2">
                                <li>Encryption of data in transit (SSL/TLS)</li>
                                <li>Secure password hashing</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Secure database storage with Supabase</li>
                            </ul>
                            <p className="mt-4 text-sm text-muted-foreground">
                                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* URL Safety Checking */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="h-6 w-6 text-green-600" />
                                <h2 className="text-2xl font-bold m-0">5. URL Safety Checking (Google Safe Browsing)</h2>
                            </div>

                            <p>To protect our users and maintain platform integrity, SEOLnk uses the <strong>Google Safe Browsing API</strong> to check URLs for potential threats before allowing them to be shortened or shared.</p>

                            <h3 className="text-xl font-semibold mt-6 mb-3">What We Check</h3>
                            <p>When you submit a URL to create a link, we send that URL to Google's Safe Browsing service to check for:</p>
                            <ul className="space-y-2">
                                <li><strong>Malware:</strong> Sites that may install malicious software on visitors' devices</li>
                                <li><strong>Social Engineering:</strong> Phishing sites designed to steal personal information</li>
                                <li><strong>Unwanted Software:</strong> Sites that may attempt to install unwanted programs</li>
                                <li><strong>Potentially Harmful Applications:</strong> Sites hosting dangerous applications</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Data Shared with Google</h3>
                            <ul className="space-y-2">
                                <li>Only the URL you submit is sent to Google's Safe Browsing API for checking</li>
                                <li>We do not share your personal information, account details, or any other data with this service</li>
                                <li>Google processes this data according to their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a></li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Why We Use This Service</h3>
                            <ul className="space-y-2">
                                <li>To protect end-users who click on links created through our platform</li>
                                <li>To prevent the spread of malicious content through our service</li>
                                <li>To maintain the reputation and trustworthiness of SEOLnk links</li>
                                <li>To comply with industry best practices for link safety</li>
                            </ul>

                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    <strong>Your Benefit:</strong> This protection helps ensure that links you create and share are safe, protecting both you and your audience from potential security threats.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>

                            <p>You have the right to:</p>
                            <ul className="space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                                <li><strong>Export:</strong> Download your data in a portable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Object:</strong> Object to certain data processing activities</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>

                            <p>We use cookies and similar technologies to:</p>
                            <ul className="space-y-2">
                                <li>Maintain your login session</li>
                                <li>Remember your preferences</li>
                                <li>Analyze usage patterns</li>
                                <li>Improve our services</li>
                            </ul>
                            <p className="mt-4">
                                You can control cookies through your browser settings, but disabling them may affect functionality.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>

                            <p>
                                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy,
                                unless a longer retention period is required by law. When you delete your account, we will permanently delete
                                or anonymize your personal information within 30 days.
                            </p>
                        </section>

                        {/* Children's Privacy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>

                            <p>
                                Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                                information from children. If you become aware that a child has provided us with personal data, please
                                contact us immediately.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>

                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by
                                posting the new policy on this page and updating the "Last Updated" date. Your continued use of our
                                services after changes constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>

                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
                                please contact us:
                            </p>
                            <div className="mt-4 p-6 rounded-lg bg-muted/50 border">
                                <p className="font-semibold mb-2">SEOLnk Privacy Team</p>
                                <p>Email: <a href="mailto:privacy@seolnk.com" className="text-blue-600 hover:underline">privacy@seolnk.com</a></p>
                                <p className="mt-2">
                                    <Link href="/contact" className="text-blue-600 hover:underline">Visit our Contact Page</Link>
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </article>


        </div>
    );
}
