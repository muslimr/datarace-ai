"use client";

import React, { useState } from 'react';
import { useLazyGetMyDatasetsQuery } from '@api/datasets-api';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import CompetitionsSkeleton from '@components/shared/skeletons/competitions-skeleton';
import DatasetItem from '@components/shared/dataset-item';
import { NoData, TablePagination } from '@components/shared';



interface ICompetitionsTable {
    lng?: string,
    t?: (val: string) => string,
}

export const MyDatasetsTable: React.FC<ICompetitionsTable> = () => {

    let lng = useLocale();
    let t = useTranslations();

    const { loading: datasetsLoading } = useSelector((state: RootState) => state.datasets);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElems, setTotalElems] = React.useState(1);
    const [triggerGetDatasets, { data: datasetsData, error, isLoading }] = useLazyGetMyDatasetsQuery();

    const itemsPerPage = 6;

    const onPageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        triggerGetDatasets({
            data: { page: currentPage, count: itemsPerPage },
            lang: lng,
        }).then((response) => {
            if (response?.data?.totalElements) {
                setTotalPages(Math.ceil(response.data.totalElements / itemsPerPage));
                setTotalElems(response?.data?.totalElements);
            } else {
                setTotalPages(1)
            }
        });
    }, [currentPage, triggerGetDatasets]);


    if (datasetsLoading || isLoading) {
        return <CompetitionsSkeleton />;
    }

    if (!datasetsLoading && !isLoading && !datasetsData?.userDatasets?.length) {
        return <NoData />
    }

    return (
        <>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {datasetsData?.userDatasets?.map((item, i) => (
                    <DatasetItem key={i} {...item} />
                ))}
            </div>

            {/* Pagination Controls */
                !!datasetsData?.totalElements &&
                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            }
        </>
    );
};
