"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { useGetCategoriesQuery } from '@api/category-api';
import { RaceSelectSkeleton } from '@components/shared';
import RaceSelect from '@components/shared/race-select';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { ICategory } from '@api/types/category-types';

// const RaceSelect = dynamic(() => import('@components/shared/race-select').then(mod => mod.default), { ssr: false });

interface IRaceType extends ICategory {
    id: number,
    competitionsCount: number,
    children: IRaceType[],
    type?: string,
}

export const CategoriesSection: React.FC = () => {
    const { data: categories, error, isLoading } = useGetCategoriesQuery();
    const dispatch = useDispatch();

    // Access the selected category and categories from the Redux state
    const { selectedCategory } = useSelector((state: RootState) => state.categories);

    if (isLoading) {
        return (
            <div className="container mx-auto overflow-scroll flex flex-col justify-center space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 md:px-7">
                {[...Array(6)].map((_, index) => (
                    <RaceSelectSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto overflow-scroll flex flex-col gap-3 lg:flex-row lg:space-y-0 md:px-7">
            {categories && categories.map((item: IRaceType, i: number) => (
                <RaceSelect key={i} {...item} type={item.titles.en} />
            ))}
        </div>
    );
};
