"use client";

import React, { useState } from 'react';
import { useLazyGetAllDatasetsQuery } from '@api/datasets-api';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import CompetitionsSkeleton from '@components/shared/skeletons/competitions-skeleton';
import DatasetItem from '@components/shared/dataset-item';
import { AuthModal, NoData, TablePagination } from '@components/shared';
import { useDispatch } from 'react-redux';
import { setDatasetCount } from '@slices/dataset-slice';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';


interface ICompetitionsTable {
    lng?: string,
    t?: (val: string) => string,
}

export const DatasetsTable: React.FC<ICompetitionsTable> = () => {

    const { page } = useParams();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const { loading: datasetsLoading, datasetsCount } = useSelector((state: RootState) => state.datasets);

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElems, setTotalElems] = React.useState(1);
    const [triggerGetDatasets, { data: datasetsData, error, isLoading }] = useLazyGetAllDatasetsQuery();

    const itemsPerPage = 6;


    const onPageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            router.push(`${pathname}?p=${page}`)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        triggerGetDatasets({
            data: { page: currentPage, count: itemsPerPage },
        }).then((response) => {
            if (response?.data?.totalElements) {
                dispatch(setDatasetCount(response?.data?.totalElements));
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
                    <DatasetItem
                        key={i}
                        {...item}
                    />
                ))}
            </div>

            {/* Pagination Controls */
                !!datasetsData?.totalElements && datasetsData?.totalElements > itemsPerPage &&
                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            }
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    );
};
