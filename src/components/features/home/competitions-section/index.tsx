"use client";

import { useLazyGetCompetitionsQuery } from '@api/competition-api';
import { AuthModal, NoData } from '@components/shared';
import RaceItem from '@components/shared/race-item';
import CompetitionsSkeleton from '@components/shared/skeletons/competitions-skeleton';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';


export const CompetitionsSection: React.FC = () => {
    const lng = useLocale();
    const t = useTranslations();
    const router = useRouter();

    const CATEGORY_LABELS: Record<number, string> = {
        1: t('featured'),
        2: "Environment",
        3: "Education",
        4: "Oil & Industry",
        5: "Technology",
    };

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { selectedCategory, loading: categoryLoading } = useSelector((state: RootState) => state.categories);
    const { loading: competitionLoading } = useSelector((state: RootState) => state.competitions);
    const [triggerGetCompetitions, { data: competitionsData, error, isLoading }] = useLazyGetCompetitionsQuery();

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);

    const onClickCompetition = (e: any) => {
        if (isAuthenticated) {
            e.stopPropogation();
        } else {
            setShowAuthModal(true)
        }
    }


    React.useEffect(() => {
        triggerGetCompetitions({
            categoryId: selectedCategory,
            data: { page: 0, count: 6 },
        });
    }, [selectedCategory, triggerGetCompetitions]);


    if (categoryLoading || competitionLoading)
        return <CompetitionsSkeleton />


    if (!categoryLoading && !competitionLoading && !isLoading && !competitionsData?.competitions?.length) {
        return (
            <div>
                <h2 className="text-[32px] md:text-[2.3rem]">{t('competitions')}</h2>
                <p className="text-md text-gray-700">{t('competitionDescription')}</p>
                <div className="flex flex-col items-center justify-center p-6 text-center min-h-[50vh]">
                    <p className="text-md text-gray-700 font-light md:max-w-[50%]">{t('noRacesDescription')}</p>
                </div>
            </div>
        )
    }


    return (
        <>
            <div className="flex justify-between mb-8">
                <div className="w-full space-y-3">
                    <h2 className="text-[32px] md:text-[2.3rem]">{CATEGORY_LABELS[selectedCategory]} <span className="font-medium">{t('competitions')}</span></h2>
                    <p className="text-md text-gray-700">{t('competitionDescription')}</p>
                </div>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {competitionsData?.competitions?.map((item, i) => (
                    <RaceItem
                        key={i}
                        {...item}
                        onClick={onClickCompetition}
                    />
                ))}
            </div>
            <div className="flex justify-center mb-10">
                <Link href={`/${lng}/races`} className="inline-flex w-auto text-center font-medium items-center px-6 py-3 text-gray-900 transition-all dark:bg-white dark:text-gray-800 rounded-xl sm:w-auto hover:bg-primaryDark hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 dark:shadow-neutral-700 focus:shadow-none">
                    {t('allRaces')}
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