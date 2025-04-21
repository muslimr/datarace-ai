"use client";

import React from 'react';
import Link from 'next/link';
import { CreateDatasetSidebar } from '../create-dataset-sidebar';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { AuthModal } from '@components/shared';
import { useRouter } from 'next/navigation';


export const DatasetsHeaderSection = () => {
    const t = useTranslations();
    const lng = useLocale();
    const router = useRouter();

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { loading: datasetsLoading, datasetsCount } = useSelector((state: RootState) => state.datasets);

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="text-start">
                    <nav className="text-sm flex justify-start items-center text-gray-600 space-x-3">
                        <Link href={`/${lng}`} className="hover:text-primaryLight">{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <span>{t('datasets')}</span>
                    </nav>
                    <h2 className="text-[32px] md:text-[2.3rem] font-medium">{t('datasets')} {!!datasetsCount && <span className="text-gray-400 font-regular">({datasetsCount})</span>}</h2>
                </div>
                <button
                    className="inline-flex w-auto text-center items-center px-6 py-2.5 text-white transition-all bg-gray-700 rounded-lg sm:w-auto hover:bg-dark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                    aria-label="Upload Dataset"
                    onClick={() => isAuthenticated ? setSidebarOpen(true) : setShowAuthModal(true)}
                >
                    {t('createDataset')}
                </button>
            </div>
            <CreateDatasetSidebar
                visible={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSignUp={() => router.push(`/${lng}/sign-up`)}
                onConfirm={() => router.push(`/${lng}/sign-in`)}
            />
        </>
    )
}