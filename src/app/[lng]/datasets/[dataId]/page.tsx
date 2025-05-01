"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useDeleteDatasetMutation, useGetDatasetInfoQuery } from '@api/datasets-api';
import { UpdateDatasetSidebar } from '@components/features/datasets/update-dataset-sidebar';
import { DatasetFiles } from '@components/features/datasets/dataset-files';
import { DatasetComments, DatasetFeedbacks } from '@components/features';
import { DatasetsSection } from '@components/features/home';
import { Tooltip } from 'react-tooltip';
import { AuthModal, Loader, UpvoteButton } from '@components/shared';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';


const DatasetDetails: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const params = useParams();
    const router = useRouter();
    const { dataId } = params;
    const datasetId = Array.isArray(dataId) ? dataId[0] : dataId;

    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false)
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


    if (isLoading) return <Loader />

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container md:flex flex-col gap-5 items-center mx-auto py-[6rem] px-5 md:px-10 xl:px-[100px]">
                {/* Breadcrumb */}
                <div className="flex flex-col w-full md:flex-row items-start justify-between xl:min-w-[1100px] xl:max-w-[1100px] mb-5 md:mb-0">
                    <nav className="text-sm flex justify-start items-center text-gray-600 gap-3">
                        <Link href={`/${lng}`} className="hover:text-primaryLight" style={{ whiteSpace: "nowrap" }}>{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <Link href={`/${lng}/datasets`} className="hover:text-primaryLight">{t('datasets')}</Link>
                        <span className="text-lg">&gt;</span>
                        <span className='truncate-text-1'>{t('datasetInfo')}</span>
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
                <main id="#main-content" className="space-y-5 xl:min-w-[1100px] xl:max-w-[1100px]">
                    <div className="flex gap-7">
                        <div className="w-full space-y-5">
                            <section className="flex flex-col lg:flex-row gap-3 md:gap-7">
                                <div className="flex relative rounded-2xl lg:min-w-[18rem] lg:max-w-[18rem]">
                                    <img src={datasetInfo?.imageUrl || "/svg/dr_banner.svg"} alt="Race Image" className="w-full h-[12rem] rounded-2xl object-cover" />
                                </div>
                                <div className="w-full flex flex-col md:justify-center gap-3 w-full md:h-[12rem]">
                                    <div className="w-full flex flex-col gap-2">
                                        <h1 id="title" className="bottom-0 left-0 text-2xl md:text-3xl md:leading-[2xl] font-semi truncate-text-2">
                                            {datasetInfo?.title}
                                        </h1>
                                        <Tooltip anchorSelect="#title">
                                            {datasetInfo?.title}
                                        </Tooltip>
                                        <p id="description" className='text-sm truncate-text-2 text-gray-500'>
                                            {datasetInfo?.description}
                                        </p>
                                        <Tooltip anchorSelect="#description">
                                            <div className="max-w-[300px]">{datasetInfo?.description}</div>
                                        </Tooltip>
                                    </div>
                                    <div className="inline-flex" onClick={() => !isAuthenticated && setShowAuthModal(true)}>
                                        <UpvoteButton
                                            id={Number(datasetId)}
                                            isLiked={datasetInfo?.likedByCurrentUser}
                                            count={Number(datasetInfo?.likeCount)}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <iframe
                                    src="https://docs.google.com/gview?url=https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv&embedded=true"
                                    style={{ width: '100%', height: '600px', borderRadius: 20, backgroundColor: '#fff' }}
                                    frameBorder="0"
                                ></iframe>
                            </section>

                            {/* <section>
                                <iframe
                                    src="https://docs.google.com/gview?url=https://file-examples.com/storage/fe3f83658db26d01c53bd0c/2017/02/file_example_XLS_10.xls&embedded=true"
                                    style={{ width: '100%', height: '600px', borderRadius: 20, backgroundColor: '#fff' }}
                                    frameBorder="0"
                                ></iframe>
                            </section> */}

                            <section className="grid rounded-2xl">
                                <div dangerouslySetInnerHTML={{ __html: datasetInfo?.content || '' }}></div>
                            </section>

                            <section>
                                <DatasetFiles
                                    datasetId={datasetId}
                                    isEditable={datasetInfo?.isEditable}
                                    files={datasetInfo?.datasetFileDownloadDto}
                                    refetch={refetch}
                                />
                            </section>

                            <section className="flex flex-col gap-5">
                                <DatasetFeedbacks datasetId={Number(datasetId)} />
                            </section>
                        </div>

                        {/* Right Box */}
                        <div className="hidden lg:flex md:min-w-[30%] xl:min-w-[25%] space-y-7 border rounded-xl p-5">
                            <div className="space-y-2">
                                <div className="flex space-x-3 mb-5">
                                    <div className="h-[30px] w-[2px] bg-primaryLight" />
                                    <span className="text-lg font-medium">Tags</span>
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    {
                                        datasetInfo?.tags?.map((tag, index) =>
                                            <div className="inline-flex text-sm px-3 py-2 text-[1rem] rounded-2xl gap-1 mr-2 border border-gray-500 max-w-[80%]">
                                                <div className="text-primaryLight">#</div>
                                                <p className="truncate-text-1">{tag.name}</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

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
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div >
    );
};

export default DatasetDetails;
