import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { SliderItem } from '../../types';
import { Plus, Trash2, Edit2, Upload, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

export default function SliderManager() {
    const [sliders, setSliders] = useState<SliderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form States
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<SliderItem>>({
        title: '',
        image_url: '',
        link_url: '',
        order: 0
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('slider_content')
            .select('*')
            .order('order', { ascending: true }); // Default sort by order

        if (!error && data) {
            setSliders(data);
        }
        setLoading(false);
    };

    const handleEdit = (slider: SliderItem) => {
        setFormData(slider);
        setCurrentId(slider.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;

        const { error } = await supabase.from('slider_content').delete().eq('id', id);
        if (!error) {
            setSliders(sliders.filter(s => s.id !== id));
        } else {
            alert('Error deleting slide');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `slider_${Math.random()}.${fileExt}`;

        // Use 'images' bucket (assuming same bucket or specific 'slider-images')
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file);

        if (uploadError) {
            alert('Error uploading image');
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image_url) {
            alert('Image is required.');
            return;
        }

        const payload = {
            title: formData.title || '',
            image_url: formData.image_url,
            link_url: formData.link_url || '',
            order: formData.order || 0
        };

        if (currentId) {
            const { error } = await supabase
                .from('slider_content')
                .update(payload)
                .eq('id', currentId);

            if (!error) {
                setIsEditing(false);
                fetchSliders();
            } else {
                alert('Error updating slide');
            }
        } else {
            const { error } = await supabase
                .from('slider_content')
                .insert([payload]);

            if (!error) {
                setIsEditing(false);
                fetchSliders();
            } else {
                alert('Error creating slide');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            image_url: '',
            link_url: '',
            order: sliders.length + 1 // Auto-increment suggestion
        });
        setCurrentId(null);
        setIsEditing(false);
    };

    if (loading && !isEditing) return <div className="p-4">Loading sliders...</div>;

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        {currentId ? 'Edit Slide' : 'Create Slide'}
                    </h2>
                    <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Optional)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slide Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="h-32 w-auto object-cover rounded-md border border-gray-200" />
                            ) : (
                                <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400">
                                    No Image
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Recommended size: 1920x1080 or equivalent ratio.</p>
                    </div>

                    {/* Link URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link URL</label>
                        <input
                            type="text"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                            placeholder="/output"
                        />
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Priority</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">Lower numbers appear first.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {currentId ? 'Update Slide' : 'Create Slide'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Main Sliders</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    <span>New Slide</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sliders.map((slider) => (
                    <div key={slider.id} className="relative group bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                            {slider.image_url ? (
                                <img src={slider.image_url} alt={slider.title} className="object-cover w-full h-48" />
                            ) : (
                                <div className="flex items-center justify-center h-48 text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {slider.title || 'Untitled Slide'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 truncate">Link: {slider.link_url || 'None'}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    Order: {slider.order}
                                </span>
                                <div className="flex space-x-2">
                                    {/* Reordering is handled by manual Edit for now, but icons kept for future drag/drop implementation or explicit buttons if requested */}
                                    <button
                                        onClick={() => handleEdit(slider)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full dark:hover:bg-indigo-900/20"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => console.log('Move Up', slider.id)} // Placeholder for future reordering logic
                                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full dark:hover:bg-gray-700/20"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => console.log('Move Down', slider.id)} // Placeholder for future reordering logic
                                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full dark:hover:bg-gray-700/20"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slider.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {sliders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No slides found. Create one above.
                </div>
            )}
        </div>
    );
}
