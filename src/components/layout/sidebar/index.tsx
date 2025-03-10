import React from 'react';
import LanguageSwitcher from '../language-switch';

interface ISidebarProps {
    navLinks: React.ReactNode[];
    visible: boolean;
    setSidebarOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<ISidebarProps> = ({ navLinks, visible, setSidebarOpen }) => {
    const sidebarRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setSidebarOpen]);


    return (
        visible && (
            <div
                data-testid="sidebar"
                className="fixed inset-0 z-40 bg-gray-800 bg-opacity-75 top-[65px] transition-transform transform translate-x-0 opacity-1 lg:hidden"
            >
                <div
                    className="relative w-64 h-[100%] bg-white shadow-xl"
                    ref={sidebarRef}
                    onClick={(e) => e.stopPropagation()} // Prevent event propagation
                >
                    <nav>
                        <div className='relative z-40 flex px-5 py-2 border-b border-[#dedede]'>
                            <LanguageSwitcher />
                        </div>
                        <ul className="flex flex-col gap-5 p-5">
                            {navLinks}
                        </ul>
                    </nav>
                </div>
            </div>
        )
    );
};
