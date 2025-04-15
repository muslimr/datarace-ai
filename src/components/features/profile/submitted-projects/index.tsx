"use client";

import React from 'react';
import { useLazyGetAttendedCompetitionsQuery } from '@api/competition-api';
import RaceItem from '@components/shared/race-item';
import AttendedCompetitionsSkeleton from '@components/shared/skeletons/attended-competitions-skeleton';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import { NoData } from '@components/shared';
import { useLocale, useTranslations } from 'next-intl';


export const SubmittedProjects: React.FC = () => {
    let lng = useLocale();
    let t = useTranslations();

    const { loading: competitionLoading } = useSelector((state: RootState) => state.competitions);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);
    const [triggerGetCompetitions, { data: attendedCompetitionsData, error, isLoading }] = useLazyGetAttendedCompetitionsQuery();

    const itemsPerPage = 6;


    React.useEffect(() => {
        triggerGetCompetitions({
            data: { page: currentPage, count: itemsPerPage, userHasSubmitted: true, },
            lang: lng,
        }).then((response) => {
            if (response?.data?.totalElements) {
                setTotalPages(Math.ceil(response.data.totalElements / itemsPerPage));
            } else {
                setTotalPages(1)
            }
        });
    }, [lng, currentPage, triggerGetCompetitions]);


    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };


    if (competitionLoading || isLoading) {
        return <AttendedCompetitionsSkeleton />;
    }

    if (!competitionLoading && !isLoading && !attendedCompetitionsData?.userCompetitions?.length) {
        return <NoData />
    }

    return (
        <div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {attendedCompetitionsData?.userCompetitions?.map((item, i) => (
                    <RaceItem key={i} {...item} />
                ))}
            </div>

            {/* Pagination Controls */
                !!attendedCompetitionsData?.totalElements &&
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primaryDark'}`}
                    >
                        {t('previous')}
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-4 py-2 rounded-md ${currentPage >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primaryDark'}`}
                    >
                        {t('next')}
                    </button>
                </div>
            }
        </div>
    );
};
