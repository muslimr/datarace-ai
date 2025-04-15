import React from 'react';
import { Metadata } from 'next';
import { CategoriesSection } from '@components/features/home';
import { CompetitionsTable } from '@components/features';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Races | DataRace.ai",
    description: "DataRace is an innovative platform designed to bring data scientists and AI enthusiasts together to compete in data-driven challenges.",
};


const Races: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
            <main id="main-content" className="flex-grow bg-gray-50 py-[4rem] lg:py-[6rem] space-y-20">
                <section className="container mx-auto px-5 md:px-7 w-full space-y-10 mb-10">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-[32px] md:text-[2.3rem] font-medium">{t('races')}</h2>
                            {/* Breadcrumb */}
                            <nav className="text-sm flex justify-start items-center text-gray-600 space-x-2">
                                <Link href={`/${lng}`} className="hover:text-primaryLight">{t('mainPage')}</Link>
                                <span className="text-lg">&gt;</span>
                                <span>{t('competitions')}</span>
                            </nav>
                        </div>
                    </div>
                    <CategoriesSection />
                </section>

                <section className="container mx-auto px-7">
                    <CompetitionsTable />
                </section>
            </main>
        </div>
    );
};

export default Races;
