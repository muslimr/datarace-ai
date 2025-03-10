"use client";

import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface IDropdownProps {
    content?: ReactNode;
    children: ReactNode;
}

export const Dropdown: React.FC<IDropdownProps> = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={toggleDropdown} aria-expanded={isOpen} role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleDropdown();
            }}>
                {children} {/* Renders children element */}
            </div>
            {isOpen && (
                <div onClick={toggleDropdown} className={`origin-top-right absolute left-0 md:right-0 md:left-auto mt-2 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 transition-all duration-500 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-10 opacity-0'}`}>
                    {content}
                </div>
            )}
        </div>
    );
};
