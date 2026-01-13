import { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function BlogSection({ title, children, className = '' }: SectionProps) {
    return (
        <section className={`mb-12 ${className}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 pb-3 border-b-2 border-primary/20">
                {title}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {children}
            </div>
        </section>
    );
}

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    gradient?: string;
}

export function FeatureCard({ icon, title, description, gradient = 'from-blue-500/10 to-cyan-500/10' }: FeatureCardProps) {
    return (
        <div className={`p-6 rounded-xl bg-gradient-to-br ${gradient} border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group`}>
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-background/50 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    );
}

interface BestPracticeProps {
    items: { type: 'do' | 'dont'; text: string }[];
}

export function BestPractices({ items }: BestPracticeProps) {
    return (
        <div className="bg-muted/30 rounded-xl p-6 sm:p-8 border border-border/50">
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <span className={`text-lg mt-0.5 ${item.type === 'do' ? 'text-green-500' : 'text-red-500'}`}>
                            {item.type === 'do' ? '✅' : '❌'}
                        </span>
                        <span className="text-sm sm:text-base">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ExampleBoxProps {
    title: string;
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
}

export function ExampleBox({ title, children, variant = 'default' }: ExampleBoxProps) {
    const variants = {
        default: 'from-primary/10 to-purple-500/10 border-primary/20',
        success: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
        warning: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20',
        info: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
    };

    return (
        <div className={`rounded-xl p-6 bg-gradient-to-br ${variants[variant]} border`}>
            <h4 className="font-bold text-lg mb-4">{title}</h4>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
}
