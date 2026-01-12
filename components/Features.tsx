'use client';

import { Zap, Layout, Share2, BarChart, CheckCircle2, User } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const features = [
    {
        name: 'Instant Preview',
        description: 'See exactly how your link will look on social media platforms in real-time as you type.',
        icon: Zap,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        name: 'Custom Metadata',
        description: 'Control the title, description, and image that appears when your link is shared.',
        icon: Layout,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        name: 'Bio Links',
        description: 'Create your own link-in-bio page like Linktree. Share all your important links in one beautiful page.',
        icon: User,
        color: "text-pink-500",
        bg: "bg-pink-500/10"
    },
    {
        name: 'Analytics Ready',
        description: 'Track clicks and engagement on your shared links to measure performance.',
        icon: BarChart,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50 }
    }
};

export function Features() {
    return (
        <div id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-14 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xs sm:text-sm font-semibold leading-7 text-primary mb-2 uppercase tracking-wide">Deploy faster</h2>
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                            Everything you need to master your social presence
                        </p>
                        <p className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
                            Stop relying on random scrapers. Take control of how your content appears across the web with our powerful suite of tools.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-24 max-w-2xl lg:max-w-none"
                >
                    <dl className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.name}
                                variants={item}
                                className="relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300"
                            >
                                <dt className="flex items-center gap-3 sm:gap-4 text-lg sm:text-xl font-semibold leading-7 text-foreground">
                                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-lg ${feature.bg}`}>
                                        <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground flex-auto">
                                    {feature.description}
                                </dd>
                                <div className="mt-2 flex items-center text-xs sm:text-sm text-primary font-medium cursor-pointer group">
                                    Learn more <CheckCircle2 className="ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </dl>
                </motion.div>
            </div>
        </div>
    );
}
