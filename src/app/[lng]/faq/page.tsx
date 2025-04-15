import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Loader } from '@components/shared';
import { HelpSection } from '@components/features';
import { IParamsLanguage } from 'types/lang-types';
import { useTranslations } from 'next-intl';


export const metadata: Metadata = {
    title: "FAQ | Datarace.ai",
    description: "DataRace is an innovative platform designed to bring data scientists and Al enthusiasts together to compete in data-driven challenges.",
};


const FAQ: React.FC<IParamsLanguage> = ({ params: { lng } }) => {
    const t = useTranslations();

    return (
        <Suspense fallback={<Loader />}>
            <div className="min-h-screen flex flex-col">
                <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
                <main id="main-content" className="container mx-auto flex-grow px-5 md:px-10 lg:px-40 py-[4rem] md:py-[6rem]">
                    {/* Breadcrumb */}
                    <nav className="text-sm flex justify-start items-center text-gray-600 space-x-3">
                        <Link href={`/${lng}`} className="hover:text-primaryLight">{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <span>{t('faqTitle')}</span>
                    </nav>
                    <h1 className="text-[32px] md:text-[2.3rem] font-medium">{t('faqTitle')}</h1>
                    <HelpSection />
                </main>
            </div>
        </Suspense>
    );
};

export default FAQ;
