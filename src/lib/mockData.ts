import type { Output } from '../types';

export const mockOutputs: Output[] = [
    {
        id: 1,
        created_at: new Date().toISOString(),
        title: 'Hot Summer Sale',
        description: 'A vibrant poster design for the summer season sales event.',
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        category: 'Poster',
        author: 'Yesung Jin',
        workshop: '2025 A-Hand Workshop',
        project_name: 'Identity Design',
        link_url: ''
    },
    {
        id: 2,
        created_at: new Date().toISOString(),
        title: 'Abstract Harmony',
        description: 'An exploration of shapes and colors in modern composition.',
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        category: 'Art',
        author: 'John Doe',
        workshop: 'Creative Coding',
        project_name: 'Visual Experiments',
        link_url: ''
    },
    {
        id: 3,
        created_at: new Date().toISOString(),
        title: 'Typography Series',
        description: 'Experimental typography showing the flexibility of fonts.',
        image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
        category: 'Typography',
        author: 'Alice Smith',
        workshop: 'Type Masters',
        project_name: 'Letterform Study',
        link_url: ''
    },
    {
        id: 4,
        created_at: new Date().toISOString(),
        title: 'Neon Nights',
        description: 'Cyberpunk inspired digital art piece.',
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        category: 'Digital Art',
        author: 'Bob Wilson',
        workshop: 'Digital Future',
        project_name: 'Cyber Aesthetics',
        link_url: ''
    },
    {
        id: 5,
        created_at: new Date().toISOString(),
        title: 'Minimalist Chair',
        description: 'Product design concept for modern living spaces.',
        image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
        category: 'Product',
        author: 'Sarah Lee',
        workshop: 'Industrial Design',
        project_name: 'Furniture 2025',
        link_url: ''
    }
];
