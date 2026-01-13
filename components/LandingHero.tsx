'use client';

import { motion, Variants } from 'framer-motion';
import { Eye, Link2, Repeat, Clock, Lock, User, BarChart3, Shield, Globe, Zap, CheckCircle2, ArrowRight, Sparkles, Play, Star, TrendingUp, Users, MousePointerClick, ChevronRight } from 'lucide-react';

const stats = [
    { value: '50K+', label: 'Links Created', icon: Link2 },
    { value: '2M+', label: 'Click Tracked', icon: MousePointerClick },
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '99.9%', label: 'Uptime', icon: TrendingUp },
];

const tools = [
    {
        name: 'Preview Links',
        slug: 'preview',
        description: 'Control how your links appear on social media with custom titles, descriptions, and stunning images.',
        icon: Eye,
        color: 'from-blue-500 to-cyan-500',
        textColor: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        features: ['Custom OG Tags', 'Social Optimized', 'Real-time Preview'],
        blogLink: '/blog/preview-links'
    },
    {
        name: 'Custom Aliases',
        slug: 'alias',
        description: 'Create memorable, branded short links. Transform random URLs into your-brand/summer-sale.',
        icon: Link2,
        color: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        features: ['Branded URLs', 'SEO Friendly', 'Memorable Links'],
        blogLink: '/blog/alias-links'
    },
    {
        name: 'Link Rotators',
        slug: 'rotator',
        description: 'Smart A/B testing with one link, multiple destinations. Perfect for testing landing pages.',
        icon: Repeat,
        color: 'from-orange-500 to-red-500',
        textColor: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        features: ['A/B Testing', 'Weighted Traffic', 'Multi-Destination'],
        blogLink: '/blog/rotator-links'
    },
    {
        name: 'Expiring Links',
        slug: 'expiring',
        description: 'Time-sensitive URLs that auto-expire. Create urgency for flash sales and limited offers.',
        icon: Clock,
        color: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-500/10',
        features: ['Auto Expiration', 'FOMO Marketing', 'Time Control'],
        blogLink: '/blog/expiring-links'
    },
    {
        name: 'Protected Links',
        slug: 'protected',
        description: 'Password-protected URLs for exclusive content. Share VIP access securely.',
        icon: Lock,
        color: 'from-green-500 to-emerald-500',
        textColor: 'text-green-500',
        bgColor: 'bg-green-500/10',
        features: ['Password Security', 'Access Control', 'Secure Sharing'],
        blogLink: '/blog/protected-links'
    },
    {
        name: 'Bio Link Pages',
        slug: 'bio-links',
        description: 'Your beautiful link-in-bio page. All your important links in one stunning, customizable page.',
        icon: User,
        color: 'from-pink-500 to-rose-500',
        textColor: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        features: ['Unlimited Links', 'Custom Themes', 'Full Analytics'],
        blogLink: '/blog/bio-links'
    }
];

const benefits = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Links redirect instantly. No delay, no waiting. Your audience gets where they need to go.'
    },
    {
        icon: BarChart3,
        title: 'Deep Analytics',
        description: 'Track every click with geographic data, device info, referral sources, and time-based insights.'
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Bank-level encryption, secure authentication, and 99.9% uptime guaranteed.'
    },
    {
        icon: Globe,
        title: 'Global CDN',
        description: 'Distributed worldwide for blazing fast performance anywhere on the planet.'
    }
];

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Marketing Director',
        company: 'TechFlow',
        content: 'SEOLnk transformed how we manage campaign links. The custom previews alone increased our CTR by 40%.',
        avatar: 'SC'
    },
    {
        name: 'Marcus Johnson',
        role: 'Content Creator',
        company: '500K Followers',
        content: 'The bio link page replaced 3 other tools I was paying for. Everything I need in one beautiful dashboard.',
        avatar: 'MJ'
    },
    {
        name: 'Emily Rodriguez',
        role: 'E-commerce Manager',
        company: 'StyleHub',
        content: 'Expiring links for flash sales are a game-changer. Our conversion rates have never been higher.',
        avatar: 'ER'
    }
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 50 }
    }
};

export function LandingHero() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 pb-24">
                {/* Dynamic Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-primary/30 via-purple-500/20 to-blue-500/30 blur-[150px] rounded-full mix-blend-screen animate-pulse"></div>
                    <div className="absolute right-0 bottom-0 w-[600px] h-[400px] bg-gradient-to-l from-pink-500/20 to-transparent blur-[100px] rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 backdrop-blur-sm mb-8"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                The Ultimate Link Management Platform
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                            <span className="block">Make Every Link</span>
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Unforgettable
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                            Create stunning custom previews, smart rotators, expiring links, and beautiful bio pages.
                            <span className="text-foreground font-medium"> All with powerful analytics.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <motion.a
                                href="/login?next=/dashboard"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-[0_0_40px_-10px_var(--color-primary)] hover:shadow-[0_0_60px_-10px_var(--color-primary)] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Start Free <ArrowRight className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                href="/features"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto px-8 py-4 bg-background border-2 border-border rounded-full font-semibold text-lg hover:bg-muted transition-colors flex items-center justify-center gap-2"
                            >
                                <Play className="h-5 w-5" /> See All Features
                            </motion.a>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-widest">
                        Trusted by Modern Teams Worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
                        {['TechFlow', 'GrowthLab', 'ScaleUp', 'Velocity', 'Momentum', 'NextGen'].map((company, i) => (
                            <div key={i} className="text-xl sm:text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Demo Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Intuitive Interface</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            See Your Links Come to{' '}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Life
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Edit your link details and watch the social preview update in real-time. What you see is what your audience gets.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
                            {/* Browser Chrome */}
                            <div className="bg-muted/50 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="px-4 py-1.5 bg-background/80 rounded-lg text-xs text-muted-foreground border border-border/50 max-w-xs">
                                        seolnk.com/dashboard/create
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Image */}
                            <div className="relative bg-background">
                                <img
                                    src="/dashboard-demo.png"
                                    alt="SEOLnk Dashboard Interface - Edit Link with Real-time Social Preview"
                                    className="w-full h-auto"
                                    style={{ display: 'block' }}
                                />
                                {/* Overlay gradient for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none"></div>
                            </div>

                            {/* Feature Pills */}
                            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 sm:gap-3">
                                <div className="px-3 sm:px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-xs sm:text-sm font-medium flex items-center gap-2">
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                    <span>Live Preview</span>
                                </div>
                                <div className="px-3 sm:px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-xs sm:text-sm font-medium flex items-center gap-2">
                                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                                    <span>Instant Updates</span>
                                </div>
                                <div className="px-3 sm:px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-xs sm:text-sm font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                    <span>Easy to Use</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature Grid Below */}
                        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
                            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="font-bold mb-2">Visual Editor</h3>
                                <p className="text-sm text-muted-foreground">
                                    See exactly how your link will appear on social platforms as you edit.
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-purple-500" />
                                </div>
                                <h3 className="font-bold mb-2">Real-Time Updates</h3>
                                <p className="text-sm text-muted-foreground">
                                    Changes reflect instantly. No refresh needed, no waiting around.
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="font-bold mb-2">One-Click Save</h3>
                                <p className="text-sm text-muted-foreground">
                                    Save your changes with a single click and share immediately.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tools Showcase */}
            <section id="tools" className="py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto mb-16 sm:mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">6 Powerful Tools</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Master Your Links
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            From social media optimization to password protection — we've got every link use case covered.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {tools.map((tool) => (
                            <motion.div
                                key={tool.slug}
                                variants={item}
                                className="group relative"
                            >
                                <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>

                                    <div className={`relative w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <tool.icon className={`h-7 w-7 ${tool.textColor}`} />
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">{tool.name}</h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">{tool.description}</p>

                                    <div className="space-y-2 mb-6">
                                        {tool.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className={`h-4 w-4 ${tool.textColor}`} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <a
                                            href={`/login?next=/create/${tool.slug}`}
                                            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group/btn"
                                        >
                                            Create <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                        <a
                                            href={tool.blogLink}
                                            className="px-4 py-2.5 border border-border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
                                        >
                                            Learn
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 sm:py-32 bg-muted/30 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            Why Teams Choose SEOLnk
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Built for performance, designed for growth, and loved by marketers worldwide.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <benefit.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <div className="flex justify-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                            ))}
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            Loved by Thousands
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            See what our users are saying about SEOLnk.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 sm:p-8 rounded-2xl bg-card border border-border/50"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role} · {testimonial.company}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                            Ready to <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Transform</span> Your Links?
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Join thousands of creators, marketers, and businesses managing their links with SEOLnk.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                href="/login?next=/dashboard"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-[0_0_50px_-12px_var(--color-primary)] hover:shadow-[0_0_80px_-12px_var(--color-primary)] transition-all duration-500 flex items-center justify-center gap-2"
                            >
                                Get Started Free <ArrowRight className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                href="/contact"
                                whileHover={{ scale: 1.05 }}
                                className="w-full sm:w-auto px-10 py-5 border-2 border-border rounded-full font-semibold text-lg hover:bg-muted transition-colors"
                            >
                                Contact Sales
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
