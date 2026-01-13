'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold">Contact Us</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Get in Touch
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                                    <p className="text-muted-foreground text-lg">
                                        We're here to help! Whether you have questions about our service, need technical support,
                                        or want to provide feedback, we'd love to hear from you.
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-blue-600/10">
                                            <Mail className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                            <p className="text-muted-foreground text-sm mb-2">
                                                For general inquiries and support
                                            </p>
                                            <a href="mailto:support@seolnk.com" className="text-blue-600 hover:underline font-medium">
                                                support@seolnk.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Categories */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-xl">Quick Links</h3>

                                    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <h4 className="font-semibold mb-1">Technical Support</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Having issues? Email <a href="mailto:support@seolnk.com" className="text-blue-600 hover:underline">support@seolnk.com</a>
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <h4 className="font-semibold mb-1">Business Inquiries</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Partnerships and collaborations: <a href="mailto:business@seolnk.com" className="text-blue-600 hover:underline">business@seolnk.com</a>
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <h4 className="font-semibold mb-1">Legal & Privacy</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Privacy concerns: <a href="mailto:privacy@seolnk.com" className="text-blue-600 hover:underline">privacy@seolnk.com</a><br />
                                            Legal matters: <a href="mailto:legal@seolnk.com" className="text-blue-600 hover:underline">legal@seolnk.com</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Response Time */}
                                <div className="p-4 rounded-lg bg-muted/50 border">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="text-foreground">Response Time:</strong> We typically respond within 24-48 hours during business days.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-card rounded-2xl border p-6 lg:p-8 shadow-lg">
                                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                                {isSubmitted && (
                                    <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-green-600">Message sent successfully!</p>
                                            <p className="text-sm text-muted-foreground mt-1">We'll get back to you soon.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a topic...</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="billing">Billing & Payments</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="business">Business Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                                            placeholder="Tell us how we can help..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 text-base font-semibold"
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        By submitting this form, you agree to our{' '}
                                        <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                                        {' '}and{' '}
                                        <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>.
                                    </p>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
