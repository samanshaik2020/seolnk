'use client';

import { motion } from 'framer-motion';

export function Hero() {
    return (
        <div className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-4xl"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-gradient">
                        Make Your Links Shine on Social Media
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                        Customize your link previews with custom images, titles, and descriptions.
                        Boost engagement and click-through rates with professional-looking cards.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
