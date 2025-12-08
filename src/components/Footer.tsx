import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

                {/* Brand / Title */}
                <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold tracking-tighter uppercase">DH14th archive</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                        2025.9월부터 활동한 디학14기의 아키이빙 페이지입니다.
                    </p>
                </div>

                {/* Address & Contact */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                        <MapPin size={16} className="mt-1" />
                        <span>
                            19-7, Seoae-ro, Jung-gu,<br />
                            Seoul, 04623, Republic of Korea
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <span className="font-mono">+82)10-1234-5678</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                        <Mail size={16} />
                        <a href="mailto:dh14th@gmail.com">dh14th@gmail.com</a>
                    </div>
                </div>

                {/* Social / Extra */}
                <div className="flex flex-col space-y-4 md:items-end">
                    <a
                        href="https://instagram.com/dh14th"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Instagram size={20} />
                    </a>
                    <span className="text-gray-400 text-xs">
                        © DH14th. All rights reserved.
                    </span>
                </div>

            </div>
        </footer>
    );
}
