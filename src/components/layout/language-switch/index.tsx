"use client";

import React from 'react';
import { Dropdown } from '@components/shared/dropdown';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowDownIcon } from '@assets/icons';
import Cookies from 'js-cookie';


const LANGS: { code: string; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'az', name: 'Azerbaijani' },
];

const LanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();
    const lng = useLocale();
    const [lngToShow, setLngToShow] = React.useState<string>(lng);


    const changeLanguage = (code: string) => {
        if (code === lng) return;
        setLngToShow(code);
        // Store language in cookies
        Cookies.set('language', code, { expires: 365 });
        const newPath = pathname.replace(`/${lng}`, `/${code}`);
        router.push(newPath);
    };


    const DropdownContent = (
        <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu" className="w-40">
            {LANGS.map((item) => (
                <div
                    key={item.code}
                    className="block px-3 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 hover:text-purple rounded-md transition-all duration-200 ease-in-out"
                    role="menuitem"
                    onClick={() => changeLanguage(item.code)}
                >
                    {t(item.name)}
                </div>
            ))}
        </div>
    );

    return (
        <Dropdown content={DropdownContent}>
            <button
                className={'font-medium rounded-lg min-w-[60px] min-h-[37px] max-h-[37px] max-w-[80px] flex items-center justify-center text-primary bg-gray-100 hover:text-primaryLight'}
            >
                {lngToShow.toUpperCase()}
                <ArrowDownIcon className="w-3 ml-2" />
            </button>
        </Dropdown>
    );
};

export default LanguageSwitcher;
