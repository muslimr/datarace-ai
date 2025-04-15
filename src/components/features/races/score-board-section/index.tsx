"use client";

import { useLazyGetScoreBoardQuery } from '@api/competition-api';
import { CompetitionInfoSectionSkeleton, NoData } from '@components/shared';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';


export const ScoreBoardSection: React.FC = () => {
    let lng = useLocale();
    let t = useTranslations();

    const { loading: competitionLoading, competitionInfo } = useSelector((state: RootState) => state.competitions);
    const [isClient, setIsClient] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [triggerGetScoreBoard, { data: scoreBoardData, error, isLoading }] = useLazyGetScoreBoardQuery();

    const itemsPerPage = 10;


    React.useEffect(() => {
        triggerGetScoreBoard({
            data: { page: currentPage, count: itemsPerPage, competitionId: competitionInfo?.id },
            lang: lng,
        }).then((response) => {
            if (response?.data?.totalElements) {
                setTotalPages(Math.ceil(response.data.totalElements / itemsPerPage));
            } else {
                setTotalPages(1)
            }
        });
    }, [
        lng,
        currentPage,
        triggerGetScoreBoard,
        competitionInfo?.id,
    ]);


    React.useEffect(() => {
        setCurrentPage(0);
    }, []);

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


    useEffect(() => {
        setIsClient(true);  // This ensures the code runs only on the client side
    }, []);


    if (!isClient) return null; // Avoid rendering on the server to prevent mismatch

    
    if (!competitionLoading && !isLoading && !scoreBoardData?.userCompetitions?.length) {
        return <NoData />
    }


    return (
        <Suspense fallback={<CompetitionInfoSectionSkeleton />}>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <thead className="text-gray-600">
                        <tr>
                            <th className="py-3 px-3 md:px-6 text-left font-semibold">Rank</th>
                            <th className="py-3 px-3 md:px-6 text-left font-semibold">User</th>
                            <th className="py-3 px-3 md:px-6 text-left font-semibold">Score</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {scoreBoardData?.userCompetitions.map((row, index) => (
                            <tr
                                key={row.competitionId}
                                className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                    }`}
                            >
                                <td className="py-3 px-3 md:px-6">{row.rank}</td>
                                <td>
                                    <Link href={`/${lng}/profile/${row.userId}`} className="group flex items-center py-3 px-3 md:px-6 space-x-2">
                                        <Image
                                            src={row.profileImageUrl || '/png/user.png'}
                                            alt={row.nickname || row.fullName}
                                            className='w-[30px] h-[30px] rounded-full'
                                            width={50}
                                            height={50}
                                        />
                                        <div className='font-medium group-hover:text-primary cursor-pointer truncate-text-1 max-w-[70px] md:max-w-full'>{row.nickname || row.fullName}</div>
                                    </Link>
                                </td>
                                <td className="py-3 px-3 md:px-6">{row.score || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */
                !!scoreBoardData?.totalElements &&
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primaryDark'}`}
                    >
                        {t('previous')}
                    </button>
                    <span>{t('page')} {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-4 py-2 rounded-md ${currentPage >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primaryDark'}`}
                    >
                        {t('next')}
                    </button>
                </div>
            }
        </Suspense>
    )
}
