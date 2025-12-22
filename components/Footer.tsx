export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg">
            <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground text-center md:text-left">
                    © {new Date().getFullYear()} SEOLnk. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
