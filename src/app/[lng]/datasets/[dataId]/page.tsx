"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useDeleteDatasetMutation, useGetDatasetInfoQuery } from '@api/datasets-api';
import { UpdateDatasetSidebar } from '@components/features/datasets/update-dataset-sidebar';
import { DatasetFiles } from '@components/features/datasets/dataset-files';
import { DatasetComments } from '@components/features';
import { DatasetsSection } from '@components/features/home';


const DatasetDetails: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const params = useParams();
    const router = useRouter();
    const { dataId } = params;
    const datasetId = Array.isArray(dataId) ? dataId[0] : dataId;

    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
    const [deleteDataset] = useDeleteDatasetMutation();
    const { data: datasetInfo, error, isLoading, refetch } = useGetDatasetInfoQuery({ id: dataId as string, lang: lng }, { skip: !dataId });


    const onDeleteDataset = async () => {
        try {
            await deleteDataset({ id: datasetId })
            router.push(`/${lng}/datasets`)
        } catch (err: any) {
            console.log('Error: ', err)
        }
    }


    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto px-3 md:px-7 py-[6rem] space-y-5">
                {/* Breadcrumb */}
                <div className="flex flex-col md:flex-row justify-between gap-3">
                    <nav className="px-2 md:px-0 text-sm flex justify-start items-center text-gray-600 space-x-3">
                        <Link href={`/${lng}`} className="hover:text-primaryLight" style={{ whiteSpace: "nowrap" }}>{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <Link href={`/${lng}/datasets`} className="hover:text-primaryLight">{t('datasets')}</Link>
                        <span className="text-lg">&gt;</span>
                        <span className='truncate-text-1'>{datasetInfo?.title}</span>
                    </nav>

                    {
                        datasetInfo?.isEditable &&
                        <div className='flex gap-3 justify-end'>
                            <button
                                aria-label="Delete Dataset"
                                className="inline-flex w-auto text-center items-center px-6 py-2.5 text-white transition-all bg-red rounded-lg sm:w-auto hover:bg-dark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                                onClick={onDeleteDataset}
                            >
                                {t('delete')}
                            </button>
                            <button
                                aria-label="Upload Dataset"
                                className="inline-flex w-auto text-center items-center px-6 py-2.5 text-white transition-all bg-gray-700 rounded-lg sm:w-auto hover:bg-dark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                                onClick={() => setSidebarOpen(true)}
                            >
                                {t('editDataset')}
                            </button>
                        </div>
                    }
                </div>

                <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

                {/* Main Content */}
                <main id="#main-content" className="space-y-5">
                    <section className="relative border">
                        <img src={datasetInfo?.imageUrl || "/svg/dr_banner.svg"} alt="Race Image" className="w-full h-[20rem] object-cover" />
                        <h1 className="absolute w-full bottom-0 left-0 text-2xl text-white font-regmed px-7 py-2 backdrop-blur-xl bg-dark/30">
                            {datasetInfo?.title}
                        </h1>
                    </section>
                    <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 rounded-2xl">
                        <div className="lg:col-span-3 gap-8">
                            <div dangerouslySetInnerHTML={{ __html: datasetInfo?.content || '' }}></div>
                        </div>
                        {/* Tags */
                            !!datasetInfo?.tags?.length &&
                            <div className="space-y-2">
                                <div className="flex space-x-3 mb-5">
                                    <div className="h-[30px] w-[2px] bg-primaryLight" />
                                    <span className="text-xl font-medium">Tags</span>
                                </div>
                                <div className="space-y-2">
                                    {
                                        datasetInfo?.tags?.map((tag, index) =>
                                            <div className="inline-block text-sm px-4 py-2 text-[1rem] rounded-lg space-x-2 mr-2 bg-gray-100">
                                                <span className="text-primaryLight">#</span>
                                                <span>{tag.name}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        }
                    </section>
                    <section>
                        <DatasetFiles
                            datasetId={datasetId}
                            isEditable={datasetInfo?.isEditable}
                            files={datasetInfo?.datasetFileDownloadDto}
                            refetch={refetch}
                        />
                    </section>
                    <section>
                        <DatasetComments
                            datasetId={datasetId}
                            isEditable={datasetInfo?.isEditable}
                        />
                    </section>
                    <section className="pt-10">
                        <div className='container mx-auto'>
                            <DatasetsSection />
                        </div>
                    </section>
                </main>
            </div>

            <UpdateDatasetSidebar
                visible={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
        </div >
    );
};

export default DatasetDetails;
