declare module 'probe-image-size';

interface Card {
    id: string;
    created_at: string;
    title: string;
    description: string;
    image_url: string;
    slug: string;
    image_width: number;
    image_height: number;
    original_url: string;
}
