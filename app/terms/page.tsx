import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Terms and Conditions | SEOLnk - Link Management Platform',
    description: 'Read the terms and conditions for using SEOLnk. Understand your rights, responsibilities, and our service limitations.',
};

export default function TermsPage() {
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
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold">Terms and Conditions</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Terms of Service
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                            Last Updated: January 13, 2026
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
                                Welcome to SEOLnk! These Terms and Conditions ("Terms") govern your use of our link management platform
                                and services. By accessing or using SEOLnk, you agree to be bound by these Terms. If you do not agree,
                                please do not use our services.
                            </p>
                        </section>

                        {/* Acceptance of Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>

                            <p>
                                By creating an account, accessing, or using any part of our service, you acknowledge that you have read,
                                understood, and agree to be bound by these Terms, as well as our Privacy Policy. You represent that you
                                are at least 18 years old or have parental consent to use our services.
                            </p>
                        </section>

                        {/* Service Description */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>

                            <p>SEOLnk provides a link management platform that allows users to:</p>
                            <ul className="space-y-2">
                                <li>Create and manage shortened URLs</li>
                                <li>Track link analytics and performance</li>
                                <li>Create advanced link types (Preview, Rotator, Expiring, Protected, Bio, and Alias links)</li>
                                <li>Organize links into campaigns</li>
                                <li>Access dashboard and reporting features</li>
                            </ul>
                            <p className="mt-4">
                                We reserve the right to modify, suspend, or discontinue any aspect of our service at any time with or
                                without notice.
                            </p>
                        </section>

                        {/* User Responsibilities */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Account Security</h3>
                            <ul className="space-y-2">
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You must notify us immediately of any unauthorized access to your account</li>
                                <li>You are solely responsible for all activities that occur under your account</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Acceptable Use</h3>
                            <p>You agree NOT to use SEOLnk to:</p>
                            <ul className="space-y-2">
                                <li>Violate any laws or regulations</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Distribute malware, viruses, or harmful code</li>
                                <li>Engage in phishing, spam, or fraudulent activities</li>
                                <li>Harass, abuse, or harm others</li>
                                <li>Distribute illegal, offensive, or inappropriate content</li>
                                <li>Impersonate any person or entity</li>
                                <li>Interfere with or disrupt our services</li>
                            </ul>
                        </section>

                        {/* CRITICAL: Health and Medical Disclaimer */}
                        <section className="mb-12">
                            <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30">
                                <div className="flex items-start gap-3 mb-4">
                                    <ShieldAlert className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-600 m-0">4. Health and Medical Disclaimer</h2>
                                    </div>
                                </div>

                                <div className="space-y-4 text-base">
                                    <p className="font-semibold text-red-700 dark:text-red-400">
                                        IMPORTANT: READ THIS SECTION CAREFULLY
                                    </p>

                                    <p>
                                        <strong>SEOLnk is a link management tool ONLY.</strong> We do not provide, endorse, verify, or
                                        take responsibility for any content accessed through links created using our platform.
                                    </p>

                                    <div className="bg-background/50 p-4 rounded-lg border border-red-500/20">
                                        <p className="font-bold mb-2">Health-Related Content:</p>
                                        <ul className="space-y-2 text-sm">
                                            <li>
                                                <strong>No Medical Advice:</strong> SEOLnk does not provide medical, health, or wellness advice.
                                                Any health-related information accessed through links created on our platform should not be
                                                considered professional medical advice.
                                            </li>
                                            <li>
                                                <strong>Not Responsible for Link Content:</strong> We are NOT responsible for the accuracy,
                                                safety, legality, or appropriateness of any health-related content, products, services, or
                                                advice that users access through links created using our service.
                                            </li>
                                            <li>
                                                <strong>Consult Professionals:</strong> Always consult with qualified healthcare professionals
                                                before making any health decisions, starting treatments, or taking supplements based on
                                                information accessed through any links.
                                            </li>
                                            <li>
                                                <strong>User Liability:</strong> Users who create links to health-related content are solely
                                                responsible for ensuring that such content complies with all applicable laws and regulations,
                                                including medical advertising standards.
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="font-semibold">
                                        By using SEOLnk to create or share health-related links, you acknowledge and agree that
                                        SEOLnk bears NO LIABILITY for any health outcomes, injuries, damages, or consequences
                                        resulting from the use of information accessed through links created on our platform.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Content and Links */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">5. Content and Links</h2>

                            <h3 className="text-xl font-semibold mt-6 mb-3">User Content</h3>
                            <ul className="space-y-2">
                                <li>You retain ownership of all content you create or link to through SEOLnk</li>
                                <li>You grant us a license to use, store, and display your links and related data as necessary to provide our services</li>
                                <li>You are solely responsible for all destination URLs and content you link to</li>
                                <li>We reserve the right to remove any links that violate these Terms</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Content</h3>
                            <p>
                                Links created through SEOLnk may direct users to third-party websites. We do not control, endorse, or
                                assume responsibility for any third-party content, websites, products, or services.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>

                            <p>
                                All rights, title, and interest in and to SEOLnk (including but not limited to software, designs, logos,
                                trademarks, and documentation) are and will remain the exclusive property of SEOLnk. You may not copy,
                                modify, distribute, sell, or reverse engineer any part of our service.
                            </p>
                        </section>

                        {/* Payment and Subscriptions */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">7. Payment and Subscriptions</h2>

                            <ul className="space-y-2">
                                <li>Subscription fees are billed in advance on a recurring basis</li>
                                <li>All fees are non-refundable except as required by law</li>
                                <li>We reserve the right to change pricing with 30 days notice</li>
                                <li>Failure to pay may result in service suspension or termination</li>
                                <li>You can cancel your subscription at any time through your account settings</li>
                            </ul>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-12">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                                <h2 className="text-2xl font-bold m-0">8. Limitation of Liability</h2>
                            </div>

                            <p className="font-semibold mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                            </p>
                            <ul className="space-y-2">
                                <li>
                                    SEOLnk is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied
                                </li>
                                <li>
                                    We do not guarantee that our service will be uninterrupted, secure, or error-free
                                </li>
                                <li>
                                    In no event shall SEOLnk be liable for any indirect, incidental, special, consequential, or punitive damages
                                </li>
                                <li>
                                    Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim
                                </li>
                                <li>
                                    We are not liable for any content accessed through links created using our platform
                                </li>
                            </ul>
                        </section>

                        {/* Indemnification */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>

                            <p>
                                You agree to indemnify, defend, and hold harmless SEOLnk and its officers, directors, employees, and agents
                                from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                            </p>
                            <ul className="space-y-2">
                                <li>Your use of our services</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any third-party rights</li>
                                <li>Any content you create or link to through our platform</li>
                            </ul>
                        </section>

                        {/* Termination */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">10. Termination</h2>

                            <p>
                                We reserve the right to suspend or terminate your account and access to our services at any time,
                                with or without notice, for any reason, including but not limited to violation of these Terms.
                                You may also terminate your account at any time through your account settings.
                            </p>
                            <p className="mt-4">
                                Upon termination, your right to use the service will immediately cease. We may delete your data and
                                content within 30 days of termination.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">11. Governing Law and Disputes</h2>

                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                                without regard to its conflict of law provisions. Any disputes arising from these Terms or your use
                                of SEOLnk shall be resolved through binding arbitration or in the courts of [Your Jurisdiction].
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">12. Changes to These Terms</h2>

                            <p>
                                We reserve the right to modify these Terms at any time. We will notify users of material changes via
                                email or through a prominent notice on our website. Your continued use of SEOLnk after such changes
                                constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        {/* Severability */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">13. Severability</h2>

                            <p>
                                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will
                                continue in full force and effect.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>

                            <p>
                                If you have any questions or concerns about these Terms, please contact us:
                            </p>
                            <div className="mt-4 p-6 rounded-lg bg-muted/50 border">
                                <p className="font-semibold mb-2">SEOLnk Legal Team</p>
                                <p>Email: <a href="mailto:legal@seolnk.com" className="text-purple-600 hover:underline">legal@seolnk.com</a></p>
                                <p className="mt-2">
                                    <Link href="/contact" className="text-purple-600 hover:underline">Visit our Contact Page</Link>
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </article>


        </div>
    );
}
