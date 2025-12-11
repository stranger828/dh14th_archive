import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Output } from '../../types';
import { Plus, Trash2, Edit2, Upload, X, Loader2, CheckSquare, Square } from 'lucide-react';

const MEMBERS = [
    "김기웅", "김소연", "김진영", "김태양", "노윤하", "문지은",
    "박건희", "이가경", "이정원", "장현주", "정여진", "조수진", "황혜명"
];

export default function OutputManager() {
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form States
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Output>>({
        title: '',
        description: '',
        image_url: '',
        is_featured: false,
        link_url: '',
        author: '',
        "Workshop Name": '',
        "Project Name": '',
        date: '',
        category: '',
        process_image_url: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const processFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchOutputs();
    }, []);

    const fetchOutputs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('outputs')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOutputs(data);
        }
        setLoading(false);
    };

    const handleEdit = (output: Output) => {
        setFormData(output);
        setCurrentId(output.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this output?')) return;

        const { error } = await supabase.from('outputs').delete().eq('id', id);
        if (!error) {
            setOutputs(outputs.filter(o => o.id !== id));
        } else {
            alert('Error deleting output');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'process_image_url' = 'image_url') => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image');
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.image_url) {
            alert('Title and Image are required.');
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description || '',
            image_url: formData.image_url,
            is_featured: formData.is_featured || false,
            link_url: formData.link_url || '',
            author: formData.author || '',
            "Workshop Name": formData["Workshop Name"] || '',
            "Project Name": formData["Project Name"] || '',
            date: formData.date || '',
            category: formData.category || '',
            process_image_url: formData.process_image_url || ''
        };

        if (currentId) {
            // Update
            const { error } = await supabase
                .from('outputs')
                .update(payload)
                .eq('id', currentId);

            if (!error) {
                setIsEditing(false);
                fetchOutputs();
            } else {
                console.error('Update error:', error);
                alert(`Error updating output: ${error.message}`);
            }
        } else {
            // Create
            const { error } = await supabase
                .from('outputs')
                .insert([payload]);

            if (!error) {
                setIsEditing(false);
                fetchOutputs();
            } else {
                console.error('Insert error:', error);
                alert(`Error creating output: ${error.message} \nHint: ${error.hint || ''}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image_url: '',
            is_featured: false,
            link_url: '',
            author: '',
            "Workshop Name": '',
            "Project Name": '',
            date: '',
            category: '',
            process_image_url: ''
        });
        setCurrentId(null);
        setIsEditing(false);
    };

    if (loading && !isEditing) return <div className="p-4">Loading outputs...</div>;

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        {currentId ? 'Edit Output' : 'Create Output'}
                    </h2>
                    <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                            required
                        />
                    </div>

                    {/* Meta Fields Grid: Author, Workshop, Project, Date, Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Author Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                            <select
                                value={formData.author || ''}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                            >
                                <option value="">Select Author</option>
                                {MEMBERS.map(member => (
                                    <option key={member} value={member}>{member}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                                placeholder="e.g. Product"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (Year)</label>
                            <input
                                type="text"
                                value={formData.date || ''}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                                placeholder="e.g. 2025"
                            />
                        </div>

                        {/* Workshop Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workshop Name</label>
                            <input
                                type="text"
                                value={formData['Workshop Name'] || ''}
                                onChange={(e) => setFormData({ ...formData, "Workshop Name": e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                                placeholder="e.g. 2025 A-Hand Workshop"
                            />
                        </div>

                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                            <input
                                type="text"
                                value={formData['Project Name'] || ''}
                                onChange={(e) => setFormData({ ...formData, "Project Name": e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                                placeholder="e.g. Identity Design"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="h-24 w-24 object-cover rounded-md border border-gray-200" />
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
                                onChange={(e) => handleImageUpload(e, 'image_url')}
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
                    </div>

                    {/* Process Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Process Detail Image (Optional)</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {formData.process_image_url ? (
                                <img src={formData.process_image_url} alt="Process Preview" className="h-24 w-24 object-cover rounded-md border border-gray-200" />
                            ) : (
                                <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400">
                                    No Image
                                </div>
                            )}
                            <input
                                type="file"
                                ref={processFileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'process_image_url')}
                            />
                            <button
                                type="button"
                                onClick={() => processFileInputRef.current?.click()}
                                disabled={uploading}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                                {uploading ? 'Uploading...' : 'Upload Process Image'}
                            </button>
                        </div>
                    </div>

                    {/* Is Featured */}
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                            className="focus:outline-none"
                        >
                            {formData.is_featured ? (
                                <CheckSquare className="text-black dark:text-white" size={24} />
                            ) : (
                                <Square className="text-gray-400" size={24} />
                            )}
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show on Home Page (Featured)</span>
                    </div>

                    {/* Link URL (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detail Link URL (Optional)</label>
                        <input
                            type="text"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white focus:ring-black dark:focus:ring-white"
                            placeholder="https://..."
                        />
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
                            {currentId ? 'Update Output' : 'Create Output'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Outputs</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    <span>New Output</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Thumbnail
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Title / Desc
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {outputs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    No outputs found. Create one!
                                </td>
                            </tr>
                        ) : (
                            outputs.map((output) => (
                                <tr key={output.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {output.image_url ? (
                                            <img className="h-12 w-12 rounded object-cover" src={output.image_url} alt="" />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{output.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{output.author}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{output.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {output.is_featured ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                Standard
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(output)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(output.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
