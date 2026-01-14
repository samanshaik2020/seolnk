'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
    Eye,
    Link2,
    Repeat,
    Clock,
    Lock,
    User,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
    {
        name: 'Preview Links',
        slug: 'preview',
        description: 'Control how your links appear on social media. Custom titles, descriptions, and images.',
        icon: Eye,
        color: 'from-blue-500 to-cyan-500',
        textColor: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        features: ['Custom OG Tags', 'Social Optimized', 'Real-time Preview'],
        blogLink: '/blog/preview-links'
    },
    {
        name: 'Alias Links',
        slug: 'alias',
        description: 'Create memorable, branded short links. Turn random URLs into /summer-sale or /promo.',
        icon: Link2,
        color: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        features: ['Custom Slugs', 'Brand Recognition', 'SEO Friendly'],
        blogLink: '/blog/alias-links'
    },
    {
        name: 'Rotator Links',
        slug: 'rotator',
        description: 'Smart link distribution. One link, multiple destinations. Perfect for A/B testing.',
        icon: Repeat,
        color: 'from-orange-500 to-red-500',
        textColor: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        features: ['A/B Testing', 'Weighted Distribution', 'Analytics'],
        blogLink: '/blog/rotator-links'
    },
    {
        name: 'Expiring Links',
        slug: 'expiring',
        description: 'Time-limited URLs that stop working after a deadline. Create urgency and FOMO.',
        icon: Clock,
        color: 'from-yellow-500 to-amber-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-500/10',
        features: ['Auto Expiration', 'Countdown Timer', 'Urgency Marketing'],
        blogLink: '/blog/expiring-links'
    },
    {
        name: 'Protected Links',
        slug: 'protected',
        description: 'Password-protected URLs. Share exclusive content securely with authorized users.',
        icon: Lock,
        color: 'from-green-500 to-emerald-500',
        textColor: 'text-green-500',
        bgColor: 'bg-green-500/10',
        features: ['Password Security', 'Access Control', 'VIP Content'],
        blogLink: '/blog/protected-links'
    },
    {
        name: 'Linktree',
        slug: 'bio',
        description: 'Your personal link-in-bio page. All your links in one beautiful, customizable page.',
        icon: User,
        color: 'from-pink-500 to-rose-500',
        textColor: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        features: ['16+ Themes', '80+ Icons', 'Full Customization'],
        blogLink: '/blog/bio-links'
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 50 }
    }
};

export function ToolsShowcase() {
    const [user, setUser] = useState<SupabaseUser | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden bg-muted/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Powerful Tools</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                        Six Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Supercharge</span> Your Links
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                        From social media optimization to password protection, we've got every link use case covered.
                    </p>
                </motion.div>

                {/* Tools Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
                >
                    {tools.map((tool) => (
                        <motion.div
                            key={tool.slug}
                            variants={item}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                                {/* Gradient Overlay on Hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>

                                {/* Icon */}
                                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <tool.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${tool.textColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 relative">{tool.name}</h3>
                                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed relative">
                                    {tool.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-2 mb-6 relative">
                                    {tool.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                            <div className={`w-1.5 h-1.5 rounded-full ${tool.bgColor} ${tool.textColor}`}></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 relative z-10">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="flex-1 group/btn"
                                    >
                                        <Link href={user ? `/create/${tool.slug}` : `/login?next=/create/${tool.slug}`}>
                                            Create
                                            <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Link href={tool.blogLink}>
                                            Learn More
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12 sm:mt-16 md:mt-20"
                >
                    <p className="text-base sm:text-lg text-muted-foreground mb-6">
                        Ready to transform your link sharing strategy?
                    </p>
                    <Button size="lg" asChild className="group">
                        <Link href="/login?next=/dashboard">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
