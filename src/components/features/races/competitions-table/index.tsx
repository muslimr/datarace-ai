"use client";

import React, { useState } from 'react';
import { useLazyGetCompetitionsQuery } from '@api/competition-api';
import { AuthModal, TablePagination } from '@components/shared';
import RaceItem from '@components/shared/race-item';
import CompetitionsSkeleton from '@components/shared/skeletons/competitions-skeleton';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';



interface ICompetitionsTable {
    lng?: string,
    t?: (val: string) => string,
}

export const CompetitionsTable: React.FC<ICompetitionsTable> = () => {
    const t = useTranslations();
    let lng = useLocale();

    const { selectedCategory, loading: categoryLoading } = useSelector((state: RootState) => state.categories);
    const { loading: competitionLoading } = useSelector((state: RootState) => state.competitions);

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElems, setTotalElems] = React.useState(1);

    const [triggerGetCompetitions, { data: competitionsData, error, isLoading }] = useLazyGetCompetitionsQuery();

    const itemsPerPage = 6;

    const CATEGORY_LABELS: Record<number, string> = {
        1: t('all'),
        2: t('environment'),
        3: t('education'),
        4: t('oilIndustry'),
        5: t('technology'),
    };

    const onPageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        triggerGetCompetitions({
            categoryId: selectedCategory,
            data: { page: currentPage, count: itemsPerPage },
            lang: lng,
        }).then((response) => {
            if (response?.data?.totalCount) {
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
                setTotalElems(response?.data?.totalCount);
            } else {
                setTotalPages(1)
            }
        });
    }, [
        lng,
        currentPage,
        selectedCategory,
        triggerGetCompetitions,
    ]);


    React.useEffect(() => {
        setCurrentPage(0);
    }, [selectedCategory]);


    if (categoryLoading || competitionLoading || isLoading) {
        return <CompetitionsSkeleton />;
    }


    return (
        <>
            <div className="flex justify-between mb-10">
                <div className="w-full space-y-3">
                    <h2 className="text-[32px] md:text-[2.3rem] font-medium">{CATEGORY_LABELS[selectedCategory]} {selectedCategory == 1 ? t('competitions') : t('competitions2')}</h2>
                    <p className="text-md text-gray-700">{t('competitionDescription')}</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {competitionsData?.competitions?.map((item, i) => (
                    <RaceItem key={i} {...item} />
                ))}
            </div>

            {/* Pagination Controls */
                !!competitionsData?.totalCount &&
                competitionsData?.totalCount > itemsPerPage &&
                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            }
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    );
};
