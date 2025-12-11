import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { name: 'home', path: '/' },
    { name: 'history', path: '/history' },
    { name: 'member', path: '/member' }, // We will intercept this path
    { name: 'output', path: '/output' },
    { name: 'activity', path: '/activity' },
    { name: 'board', path: '/board' },
];

const members = [
    "김기웅", "김소연", "김진영", "김태양", "노윤하", "문지은",
    "박건희", "이가경", "이정원", "장현주", "정여진", "조수진", "황혜명"
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu
    const [isMemberOpen, setIsMemberOpen] = useState(false); // Member dropdown (Desktop)

    const location = useLocation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);

    const toggleMemberDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMemberOpen(!isMemberOpen);
    };

    const startScrolling = () => {
        if (scrollInterval.current) return;
        scrollInterval.current = setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({ top: 5, behavior: 'instant' });
            }
        }, 16); // ~60fps smooth scrolling
    };

    const stopScrolling = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
            scrollInterval.current = null;
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 dark:bg-black/90 dark:border-gray-800 transition-colors">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold tracking-tighter hidden md:block">
                            DesignSchool 14th
                        </Link>
                        <Link to="/" className="text-xl font-bold tracking-tighter md:hidden">
                            DH14th
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => {
                                // If Member dropdown is open, no other link should display as active
                                const isLinkActive = !isMemberOpen && (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)));
                                const isMemberActive = isMemberOpen; // Member is active if dropdown is open

                                if (item.name === 'member') {
                                    return (
                                        <div key={item.name} className="relative group">
                                            <span
                                                role="button"
                                                onClick={toggleMemberDropdown}
                                                className={`cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors duration-200
                                                  ${isMemberActive
                                                        ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1'
                                                        : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                                                    }`}
                                            >
                                                {item.name}
                                            </span>

                                            {/* Dropdown */}
                                            <AnimatePresence>
                                                {isMemberOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        // Changed width from w-48 to w-28 to match button width more successfully
                                                        className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
                                                    >
                                                        {/* Scrollable Container */}
                                                        <div
                                                            ref={scrollRef}
                                                            className="max-h-60 overflow-y-auto p-4 space-y-2 scrollbar-hide scroll-smooth"
                                                        >
                                                            {members.map((member) => (
                                                                <Link
                                                                    key={member}
                                                                    to={`/output?author=${member}`}
                                                                    onClick={() => setIsMemberOpen(false)}
                                                                    className="block text-center text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer py-1"
                                                                >
                                                                    {member}
                                                                </Link>
                                                            ))}
                                                        </div>

                                                        {/* Scroll Button */}
                                                        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                                            <button
                                                                onMouseDown={startScrolling}
                                                                onMouseUp={stopScrolling}
                                                                onMouseLeave={stopScrolling}
                                                                onTouchStart={startScrolling}
                                                                onTouchEnd={stopScrolling}
                                                                className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors active:bg-gray-200 dark:active:bg-gray-700 select-none"
                                                                aria-label="Scroll Down"
                                                            >
                                                                <ChevronDown size={16} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMemberOpen(false)} // Close member dropdown if another link is clicked
                                        className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200
                                          ${isLinkActive
                                                ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1'
                                                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => {
                            if (item.name === 'member') {
                                return (
                                    <div key={item.name} className="px-3 py-2">
                                        <button
                                            onClick={() => setIsMemberOpen(!isMemberOpen)}
                                            className="flex items-center justify-between w-full text-base font-medium uppercase text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                        >
                                            <span>{item.name}</span>
                                            <ChevronDown size={16} className={`transform transition-transform ${isMemberOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Mobile Member List */}
                                        <AnimatePresence>
                                            {isMemberOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50 dark:bg-gray-900/50 mt-2 rounded-md"
                                                >
                                                    <div className="max-h-60 overflow-y-auto p-4 grid grid-cols-2 gap-2 text-sm">
                                                        {members.map(member => (
                                                            <Link
                                                                key={member}
                                                                to={`/output?author=${member}`}
                                                                onClick={() => {
                                                                    setIsMemberOpen(false);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="text-gray-600 dark:text-gray-400 block py-1"
                                                            >
                                                                {member}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium uppercase
                                      ${location.pathname === item.path
                                            ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}

