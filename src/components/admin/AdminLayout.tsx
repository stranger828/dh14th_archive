import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Image, LogOut, Grid } from 'lucide-react';

export default function AdminLayout() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-black dark:text-white">
                Loading...
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const navItems = [
        { name: 'Outputs', path: '/admin/outputs', icon: Grid },
        { name: 'Sliders', path: '/admin/sliders', icon: Image },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-lg font-bold uppercase tracking-tight text-black dark:text-white">
                        Admin
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                  ${isActive
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                    <div className="mt-4 px-3 text-xs text-gray-400">
                        {session.user.email}
                    </div>
                </div>
            </aside>

            {/* Mobile Header (TODO: Full mobile menu if needed, keeping simple for now) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
