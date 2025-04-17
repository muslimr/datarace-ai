import { NextIcon, PrevIcon } from '@assets/icons';
import { useTranslations } from 'next-intl';
import React from 'react';


export const TablePagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    let t = useTranslations();

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(0, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

        if (endPage - startPage < maxVisiblePages - 1) {
            if (startPage === 0) {
                endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
            } else if (endPage === totalPages - 1) {
                startPage = Math.max(0, endPage - maxVisiblePages + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = generatePageNumbers();


    return (
        <div className="w-full flex items-center justify-start space-x-2 px-5 pt-10 pb-5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PrevIcon className="h-6 w-5" />
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {page + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <NextIcon className="h-6 w-5" />
            </button>
        </div>
    );
};