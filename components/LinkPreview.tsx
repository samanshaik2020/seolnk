import { Card } from "@/components/ui/card";
import Image from "next/image";

interface LinkPreviewProps {
    title: string;
    description: string;
    imageUrl: string;
    domain: string;
}

export function LinkPreview({ title, description, imageUrl, domain }: LinkPreviewProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Preview</div>
            <Card className="overflow-hidden border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[1.91/1] w-full bg-muted">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted/50">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-4 bg-card">
                    <div className="text-xs uppercase text-muted-foreground font-semibold mb-1 truncate">
                        {domain || 'example.com'}
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-tight mb-1 line-clamp-1">
                        {title || 'Your Title Here'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {description || 'Your description will appear here. Make it catchy and relevant to your content.'}
                    </p>
                </div>
            </Card>
        </div>
    );
}
