"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloseIcon, HamburgerIcon } from '@assets/icons';
import { Sidebar } from '../sidebar';
import { useLocale, useTranslations } from 'next-intl';
import { UserProfile } from '../user-profile';
import LanguageSwitcher from '../language-switch';



export const Header: React.FC = () => {
    const lng = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    const hideHeaderRoutes = React.useMemo(() => [`/${lng}/sign-in`, `/${lng}/sign-up`, `/${lng}/activation`, `/${lng}/forgot`, `/${lng}/reset-password`, `/${lng}/coming`], []);
    const shouldHideHeader = hideHeaderRoutes.includes(pathname);


    const NAV_ROUTES: { route: string; label: string }[] = [
        { route: '/about-us', label: t('aboutUs') },
        { route: '/races', label: t('races') },
        { route: '/datasets', label: t('datasets') },
        { route: '/faq', label: t('faq') },
        // { route: '/blog', label: t('blog') },
        { route: '/contact', label: t('contact') },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const navLinks = React.useMemo(() => {
        return NAV_ROUTES.map((item, i) => (
            <li key={i} className="relative flex items-center space-x-3">
                {pathname === `/${lng}${item.route}` && (
                    <div className="absolute left-0 w-[7px] h-[7px] rounded-full bg-primaryLight" aria-hidden="true" />
                )}
                <Link
                    href={`/${lng}${item.route}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`text-gray-600 hover:text-primaryLight transition-all duration-200 ease-in-out ${pathname === `/${lng}${item.route}` ? 'font-medium' : ''}`}
                >
                    {item.label}
                </Link>
            </li>
        ));
    }, [pathname]);


    if (shouldHideHeader) return null;

    return (
        <>
            <header className="backdrop-blur-xl bg-transparent w-full fixed z-30 h-[55px] md:h-[65px] select-none">
                <nav role="navigation" aria-label="Main navigation" className="container w-full mx-auto flex justify-between items-center px-3 md:px-7 py-0 h-full space-x-5">
                    <div className="flex items-center cursor-pointer lg:w-[25%] space-x-3 lg:space-x-0">
                        <div className="w-[20px] ml-1 flex lg:hidden">
                            {
                                isSidebarOpen
                                    ? <CloseIcon onClick={toggleSidebar} data-testid="close-icon" />
                                    : <HamburgerIcon onClick={toggleSidebar} data-testid="hamburger-icon" />
                            }
                        </div>
                        <Link href={`/${lng}`} passHref>
                            <Image src="/svg/datarace-logo.svg" alt="Logo" width={200} height={50} priority className="h-auto w-[150px] lg:w-[180px]" />
                        </Link>
                    </div>

                    <ul className="hidden lg:flex lg:text-sm xl:text-md space-x-10 items-center">
                        {navLinks}
                    </ul>

                    <div className="flex items-center justify-end lg:w-[30%] h-full gap-2">
                        <div className='hidden md:flex'>
                            <LanguageSwitcher />
                        </div>
                        <UserProfile />
                    </div>
                </nav>
            </header>

            <div className="lg:hidden">
                <Sidebar
                    navLinks={navLinks}
                    visible={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            </div>
        </>
    );
};
