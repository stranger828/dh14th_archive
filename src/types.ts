export interface Output {
    id: number;
    created_at: string;
    title: string;
    description: string; // or content
    image_url: string;
    category?: string; // e.g., 'discipline', 'outcome'
    link_url?: string; // For clicking to detail
    is_featured?: boolean;
}

export interface SliderItem {
    id: number;
    created_at: string;
    image_url: string;
    title?: string;
    link_url?: string;
    order?: number;
}
