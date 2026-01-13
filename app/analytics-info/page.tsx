import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BarChart3, TrendingUp, Users, Globe, MousePointerClick, Clock, MapPin, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Analytics | SEOLnk - Track Link Performance & Insights',
    description: 'Powerful analytics to track clicks, geographic data, referral sources, and more. Make data-driven decisions with SEOLnk analytics.',
};

export default function AnalyticsPage() {
    const analyticsFeatures = [
        {
            icon: MousePointerClick,
            title: 'Click Tracking',
            description: 'Monitor every click on your links in real-time. See total clicks, unique visitors, and engagement patterns.',
            color: 'from-blue-600 to-cyan-600'
        },
        {
            icon: TrendingUp,
            title: 'Performance Trends',
            description: 'Visualize click trends over time with beautiful charts. Identify peak performance periods and patterns.',
            color: 'from-purple-600 to-pink-600'
        },
        {
            icon: MapPin,
            title: 'Geographic Data',
            description: 'Discover where your audience is located. Track clicks by country, city, and region.',
            color: 'from-green-600 to-emerald-600'
        },
        {
            icon: Globe,
            title: 'Referral Sources',
            description: 'Know where your traffic comes from. Track social media, email, direct visits, and other sources.',
            color: 'from-orange-600 to-red-600'
        },
        {
            icon: Smartphone,
            title: 'Device Analytics',
            description: 'Understand what devices your audience uses. Track desktop, mobile, and tablet traffic.',
            color: 'from-indigo-600 to-violet-600'
        },
        {
            icon: Clock,
            title: 'Time-Based Insights',
            description: 'See when your links get the most clicks. Optimize your posting schedule for maximum engagement.',
            color: 'from-teal-600 to-cyan-600'
        }
    ];

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
                        <Button asChild>
                            <Link href="/login">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 shadow-lg mb-6">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold">Advanced Analytics</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                            Understand Your Audience
                        </h1>

                        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Get powerful insights into how people interact with your links. Make data-driven decisions to grow your business.
                        </p>

                        <Button size="lg" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                            <Link href="/login" className="group">
                                Start Tracking Now
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
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

            {/* Analytics Features */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Everything You Need to Track
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Our comprehensive analytics suite gives you deep insights into link performance.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {analyticsFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Benefits */}
            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                            Why Analytics Matter
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Know Your Audience</h3>
                                    <p className="text-muted-foreground">
                                        Understand who's clicking your links, where they're from, and what devices they use.
                                        Create better content tailored to your audience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Optimize Performance</h3>
                                    <p className="text-muted-foreground">
                                        Identify what's working and what's not. Use data to improve your marketing campaigns
                                        and increase conversions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center">
                                    <BarChart3 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Make Informed Decisions</h3>
                                    <p className="text-muted-foreground">
                                        Stop guessing and start making data-driven decisions. Our analytics provide the
                                        insights you need to grow your business.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real-Time Tracking */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Real-Time Analytics Dashboard
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Monitor your link performance in real-time with our intuitive dashboard. See clicks,
                                conversions, and trends as they happen.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>Live click tracking with instant updates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>Beautiful, interactive charts and graphs</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>Export data for deeper analysis</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>Compare performance across multiple links</span>
                                </li>
                            </ul>
                            <Button size="lg" asChild>
                                <Link href="/signup">
                                    See Analytics in Action
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Start Tracking Today
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                            Get started with SEOLnk and unlock powerful analytics for all your links.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                                <Link href="/signup">
                                    Create Free Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-12 sm:h-14 px-8 text-base sm:text-lg">
                                <Link href="/features">
                                    View All Features
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
