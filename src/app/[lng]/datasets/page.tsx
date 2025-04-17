"use client"

import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { DatasetsTable } from '@components/features/datasets/datasets-table';
import { MyDatasetsTable } from '@components/features/datasets/my-datasets-table';
import { DatasetsHeaderSection } from '@components/features/datasets/datasets-header';
import TabSelects from '@components/shared/tab-selects';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';


// export const metadata: Metadata = {
//     title: "Datasets | DataRace.ai",
//     description: "DataRace is an innovative platform designed to bring data scientists and AI enthusiasts together to compete in data-driven challenges.",
// };


const Datasets: React.FC = () => {
    const t = useTranslations();
    const { user, isAuthenticated, loading: isUserLoading } = useSelector((state: RootState) => state.user);

    const TABS: { title: string, value: string, content: ReactNode }[] = [
        {
            value: 'all',
            title: t('allDatasets'),
            content: <DatasetsTable />,
        },
        {
            value: 'my',
            title: t('myDatasets'),
            content: <MyDatasetsTable />,
        },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
            <main id="main-content" className="flex-grow bg-gray-50 space-y-10 py-10 pt-20 md:py-[6rem]">
                <section className="container mx-auto px-7 text-center">
                    <DatasetsHeaderSection />
                </section>

                <section className="container mx-auto px-7">
                    {/* <TabSelects tabs={TABS} /> */}
                    <DatasetsTable />
                </section>
            </main>
        </div>
    );
};

export default Datasets;
