import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export function getOptimizedImageUrl(url: string, width: number) {
    if (!url) return '';

    // Supabase Storage Optimization
    if (url.includes('supabase.co/storage/v1/object/public')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}width=${width}&quality=80&resize=contain`;
    }

    // Unsplash Optimization (for mock data)
    if (url.includes('images.unsplash.com')) {
        return url.replace(/w=\d+/, `w=${width}`);
    }

    return url;
}
