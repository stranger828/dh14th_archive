import { useState, useEffect } from 'react';
import { supabase, getOptimizedImageUrl } from '../lib/supabase';
import type { Output } from '../types';

import { useSearchParams } from 'react-router-dom';

export default function OutputGrid() {
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const authorFilter = searchParams.get('author');

    useEffect(() => {
        async function fetchOutputs() {
            setLoading(true);
            let query = supabase
                .from('outputs')
                .select('*');

            if (authorFilter) {
                query = query.eq('author', authorFilter);
            }

            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(15);

            if (error) {
                console.error('Error fetching outputs:', error);
            } else {
                setOutputs(data || []);
            }
            setLoading(false);
        }

        fetchOutputs();
    }, [authorFilter]);

    if (loading) {
        return (
            <div className="max-w-[1920px] mx-auto px-4 py-20 text-center">
                <div className="animate-pulse flex space-x-4 justify-center">
                    <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-white dark:bg-black py-16 sm:py-24">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-end justify-between mb-12">
                    <h3 className="text-4xl md:text-4xl font-bold tracking-tighter uppercase text-black dark:text-white">
                        {authorFilter ? `${authorFilter}'s Works` : 'Projects Outputs'}
                    </h3>
                    <span className="hidden md:block text-gray-500 text-lg">
                        ({outputs.length.toString().padStart(2, '0')})
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {outputs.map((item) => (
                        <a
                            key={item.id}
                            href={item.link_url || '#'}
                            className="group block cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4">
                                {item.image_url ? (
                                    <img
                                        src={getOptimizedImageUrl(item.image_url, 600)}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* Hover overlay with Title & Description */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                                    <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-200 line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
