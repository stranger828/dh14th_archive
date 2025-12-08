import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase, getOptimizedImageUrl } from '../lib/supabase';
import type { SliderItem } from '../types';

export default function HeroSlider() {
    const [items, setItems] = useState<SliderItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [loading, setLoading] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Configuration
    const AUTO_PLAY_INTERVAL = 2000; // 2 seconds
    const TRANSITION_DURATION = 700; // 0.7s
    const ITEM_WIDTH_PERCENT = 40; // Makes 2.5 items visible (100 / 40 = 2.5)

    useEffect(() => {
        async function fetchSliderItems() {
            const { data } = await supabase
                .from('slider_content')
                .select('*')
                .order('order', { ascending: true });

            if (data && data.length > 0) {
                setItems(data);
            } else {
                // Mock data if DB is empty for demonstration
                setItems([
                    { id: 1, created_at: '', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', title: 'Workroom Exhibition', link_url: '/board' },
                    { id: 2, created_at: '', image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop', title: 'Photography Series', link_url: '/output' },
                    { id: 3, created_at: '', image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', title: 'Modern Typography', link_url: '/history' },
                    { id: 4, created_at: '', image_url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop', title: 'Nature Landscapes', link_url: '#' },
                    { id: 5, created_at: '', image_url: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1888&auto=format&fit=crop', title: 'Urban Architecture', link_url: '#' },
                ]);
            }
            setLoading(false);
        }

        fetchSliderItems();
    }, []);

    // Create extended items for infinite loop (Original + Clone)
    // We need enough clones to fill the screen while index jumps back.
    // Given 2.5 items visible, appending the full list once is sufficient if list > 2.
    const displayItems = [...items, ...items];

    useEffect(() => {
        if (items.length === 0) return;

        const autoPlayTimer = setInterval(() => {
            handleNext();
        }, AUTO_PLAY_INTERVAL);

        return () => clearInterval(autoPlayTimer);
    }, [items.length, currentIndex]); // Depend on currentIndex to restart timer on manual interaction if we had one

    const handleNext = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => {
            const nextIndex = prev + 1;

            // Check if we reached the start of the cloned set (which matches start of original)
            if (nextIndex === items.length) {
                // Allow the transition to finish to the clone, then snap back
                timeoutRef.current = setTimeout(() => {
                    setIsTransitioning(false); // Disable transition
                    setCurrentIndex(0); // Snap to real 0
                }, TRANSITION_DURATION);
            }
            return nextIndex;
        });
    };

    // If we snapped back to 0, re-enable transition for next move
    useEffect(() => {
        if (currentIndex === 0 && !isTransitioning) {
            // Give a tiny delay for DOM to update, then re-enable transition
            // Actually, we can just let the next 'handleNext' set it true.
            // But we need to make sure 0 -> 1 has transition.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true);
                });
            });
        }
    }, [currentIndex, isTransitioning]);

    if (loading) return <div className="h-[60vh] bg-gray-100 dark:bg-gray-900 animate-pulse" />;
    if (items.length === 0) return null;

    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-black">
            {/* Slider Track */}
            <div
                className="flex h-full items-center"
                style={{
                    transform: `translateX(-${(currentIndex * (100 / displayItems.length))}%)`,
                    transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
                    width: `${displayItems.length * ITEM_WIDTH_PERCENT}%` // Adjust container width? No, flex children sizing handles it.
                }}
            >
                {displayItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="h-full flex-shrink-0 relative border-r border-gray-900/10 box-border"
                        style={{ width: `${100 / displayItems.length}%` }}
                    >
                        <div className="w-full h-full p-2 md:p-4 bg-black flex items-center justify-center relative group overflow-hidden">
                            {/* Image */}
                            <img
                                src={getOptimizedImageUrl(item.image_url, 1200)}
                                alt={item.title || 'Slide'}
                                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay Info (Optional, shows on hover or always?) */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
                                <div>
                                    <h3 className="text-white text-lg md:text-xl font-bold">{item.title}</h3>
                                </div>
                                {item.link_url && (
                                    <a href={item.link_url} className="text-white p-2 bg-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                        <ArrowRight size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional: Gradient Overlays for edges to hint at more content? 
                 User asked for strip, usually clean edges are fine.
             */}
        </div>
    );
}
