"use client";

import { useLazyGetAllDatasetsQuery } from '@api/datasets-api';
import { AuthModal, NoData } from '@components/shared';
import DatasetItem from '@components/shared/dataset-item';
import CompetitionsSkeleton from '@components/shared/skeletons/competitions-skeleton';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';


export const DatasetsSection: React.FC = () => {
    const lng = useLocale();
    const t = useTranslations();
    const router = useRouter();

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { loading: datasetsLoading } = useSelector((state: RootState) => state.datasets);
    const [triggerGetDatasets, { data: datasetsData, error, isLoading }] = useLazyGetAllDatasetsQuery();

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);

    const onClickDataset = (e: any) => {
        if (isAuthenticated) {
            e.stopPropogation();
        } else {
            setShowAuthModal(true)
        }
    }


    React.useEffect(() => {
        triggerGetDatasets({
            data: { page: 0, count: 6 },
            lang: lng,
        });
    }, [triggerGetDatasets]);


    if (datasetsLoading)
        return <CompetitionsSkeleton />

    if (!datasetsLoading && !isLoading && !datasetsData?.userDatasets?.length) {
        return (
            <div>
                <h2 className="text-[32px] md:text-[2.3rem]">Datasets</h2>
                <p className="text-md text-gray-700">{t('competitionDescription')}</p>
                <NoData />
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between mb-8">
                <div className="w-full space-y-2">
                    <h2 className="font-medium text-[32px] md:text-[2.3rem]">{t('datasets')}</h2>
                    <p className="text-md text-gray-700">{t('competitionDescription')}</p>
                </div>
                <div className="hidden md:flex w-full justify-end mb-10">
                    <Link href={`/${lng}/datasets`} className="inline-flex w-auto text-center font-medium items-center px-6 py-3 text-gray-900 transition-all dark:bg-white dark:text-gray-800 rounded-xl sm:w-auto hover:bg-primaryDark hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 dark:shadow-neutral-700 focus:shadow-none">
                        {t('allDatasets')}
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="flex gap-3 mb-10 w-full overflow-scroll py-5">
                {datasetsData?.userDatasets?.map((item, i) => (
                    <DatasetItem
                        key={i}
                        {...item}
                        description={item.content}
                        onClick={onClickDataset}
                    />
                ))}
            </div>
            <div className="flex md:hidden w-full justify-center mt-10">
                <Link href={`/${lng}/datasets`} className="inline-flex w-auto text-center font-medium items-center px-6 py-3 text-gray-900 transition-all dark:bg-white dark:text-gray-800 rounded-xl sm:w-auto hover:bg-primaryDark hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 dark:shadow-neutral-700 focus:shadow-none">
                    {t('allDatasets')}
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    )
}