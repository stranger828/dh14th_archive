import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, getOptimizedImageUrl } from '../lib/supabase';
import type { Output } from '../types';
import { mockOutputs } from '../lib/mockData';

export default function WorkDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [work, setWork] = useState<Output | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessExpanded, setIsProcessExpanded] = useState(false);

    useEffect(() => {
        async function fetchWork() {
            if (!id) return;
            const { data, error } = await supabase
                .from('outputs')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.log('Using mock data for detail (DB unavailable)');
                const mockItem = mockOutputs.find(item => item.id === Number(id));
                setWork(mockItem || null);
            } else {
                setWork(data);
            }
            setLoading(false);
        }
        fetchWork();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!work) return <div className="text-center py-20">Work not found</div>;

    const year = new Date(work.created_at).getFullYear();

    return (

        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col relative">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-0 left-0 z-50 w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors cursor-pointer"
                aria-label="Go back"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Detailed Header Bar */}
            <div className="sticky top-0 z-40 bg-black backdrop-blur-sm text-white">
                <div className="w-full">
                    {/* Header Labels */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-0 text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-500 border-b border-gray-900">
                        <div className="col-span-1 flex items-center justify-center border-r border-gray-900 py-3">Member</div>
                        <div className="col-span-1 flex items-center justify-center border-r border-gray-900 py-3">Category</div>
                        <div className="col-span-1 hidden md:flex items-center justify-center border-r border-gray-900 py-3">Workshop Name</div>
                        <div className="col-span-1 hidden md:flex items-center justify-center border-r border-gray-900 py-3">Project Name</div>
                        <div className="col-span-1 flex items-center justify-center border-r border-gray-900 py-3">Title</div>
                        <div className="col-span-1 flex items-center justify-center py-3">Date</div>
                    </div>

                    {/* Content Values */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-0 text-xs md:text-sm font-medium uppercase tracking-tighter">
                        <div className="col-span-1 flex items-center justify-center border-r border-gray-900 py-4">
                            {work.author || '-'}
                        </div>
                        <div className="col-span-1 flex items-center justify-center border-r border-b border-gray-800 border-gray-900 py-4">
                            {work.category || 'Poster'}
                        </div>
                        <div className="col-span-1 hidden md:flex items-center justify-center border-r border-b border-gray-800 border-gray-900 text-gray-300 py-4">
                            {work['Workshop Name'] || '-'}
                        </div>
                        <div className="col-span-1 hidden md:flex items-center justify-center border-r border-b border-gray-800 border-gray-900 text-gray-300 py-4">
                            {work['Project Name'] || '-'}
                        </div>
                        <div className="col-span-1 flex items-center justify-center border-r border-b border-gray-800 border-gray-900 overflow-hidden text-ellipsis whitespace-nowrap px-2 py-4">
                            {work.title}
                        </div>
                        <div className="col-span-1 flex items-center justify-center border-b border-gray-800 py-4">
                            {work.date || year}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Full Width Image */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full h-full flex items-center justify-center">
                    {work.image_url ? (
                        <img
                            src={getOptimizedImageUrl(work.image_url, 1600)}
                            alt={work.title}
                            className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            No Image
                        </div>
                    )}
                </div>
            </div>


            {/* Process Detail Section */}
            {
                work.process_image_url && (
                    <div className="w-full bg-white dark:bg-black py-10 flex flex-col items-center">
                        <button
                            onClick={() => setIsProcessExpanded(!isProcessExpanded)}
                            className="group flex flex-col items-center space-y-2 cursor-pointer focus:outline-none"
                        >
                            <span className="text-xs font-medium uppercase tracking-widest text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                Process Detail
                            </span>
                            <div className={`transform transition-transform duration-300 ${isProcessExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>
                        </button>

                        <div
                            className={`w-full overflow-hidden transition-all duration-700 ease-in-out ${isProcessExpanded ? 'max-h-[5000px] opacity-100 mt-10' : 'max-h-0 opacity-0 mt-0'
                                }`}
                        >
                            <div className="flex justify-center px-4">
                                <img
                                    src={getOptimizedImageUrl(work.process_image_url, 1600)}
                                    alt="Process Detail"
                                    className="w-auto h-auto max-w-full shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Mobile Info (Visible only on small screens for Workshop/Project if needed, but keeping minimal for now based on request) */}
        </div >
    );
}
