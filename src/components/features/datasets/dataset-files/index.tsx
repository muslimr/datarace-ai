import React from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import { DocumentDownloadIcon, DocUpload, TrashIcon } from '@assets/icons';
import { useUploadDatasetFileMutation } from '@api/upload-api';
import { IDatasetFilesDto } from '@api/types/dataset-types';
import { useDeleteDatasetFileMutation, useDeleteDatasetMutation } from '@api/datasets-api';
import { AuthModal } from '@components/shared';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';


const BASE_URL = 'https://api.datarace.ai/v1';

interface IOriginalFilesProps {
    datasetId: number | string | undefined,
    isEditable?: boolean,
    files?: IDatasetFilesDto[],
    refetch: () => void,
}

export const DatasetFiles: React.FC<IOriginalFilesProps> = ({ files, datasetId, isEditable, refetch }) => {
    let t = useTranslations();
    let lng = useLocale();
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const [uploadDatasetFile] = useUploadDatasetFileMutation();
    const [deleteDatasetFile] = useDeleteDatasetFileMutation();


    const handleDownload = async (fileName: string, datasetFileId: number | undefined, fileType: string) => {
        try {
            const token = Cookies.get('dtr-token');
            const response = await fetch(BASE_URL + `/files/download/dataset/${datasetFileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/csv',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download the file');
            }

            const blob = await response.blob();
            saveAs(blob, `${fileName}.${fileType}`);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    const handleOriginalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            try {
                const formData = new FormData();
                formData.append("file", uploadedFile);

                await uploadDatasetFile({
                    datasetId: datasetId,
                    file: formData,
                }).unwrap();
                toast.success("File has been uploaded successfully!");
                await refetch();
            } catch (error) {
                toast.error("Failed to save the file.", {
                    position: "bottom-left",
                });
                console.error("Upload error: ", error);
            } finally {

            }
        }
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            try {
                const formData = new FormData();
                formData.append("file", droppedFile);

                await uploadDatasetFile({
                    datasetId: datasetId,
                    file: formData,
                }).unwrap();
                toast.success("Solution has been saved successfully!", { position: "bottom-left" });

            } catch (error) {
                toast.error("Failed to save the file.", {
                    position: "bottom-left",
                });
                console.error("Upload error: ", error);
            } finally {

            }
        }
    };


    const onDeleteFile = async (fileId: any) => {
        try {
            await deleteDatasetFile({ id: fileId });
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <section className="space-y-2 py-2 border-gray-200">
            {
                !!files?.length &&
                <>
                    {/* <h2 className="text-2xl font-semibold text-black dark:text-white">
                        {t('files')}
                    </h2> */}
                    <div className="flex flex-col gap-3">
                        {files?.map((row: any, index: number) => (
                            <div
                                key={row.id}
                                className={`flex bg-[#EFEFF2] rounded-xl p-3`}
                            >
                                <div className="flex bg-[#9493A5] rounded-xl text-sm font-semibold text-white w-[60px] h-[50px] items-center justify-center">{row.fileType.toUpperCase()}</div>
                                <div className="flex w-full items-center justify-between">
                                    <div className="font-medium ml-3">{row.fileName}.{row.fileType}</div>
                                    <div
                                        className="flex items-center gap-2 h-full font-regmed bg-primary text-sm text-white px-4 py-1 rounded-lg ring-2 ring-primary hover:bg-primaryDark hover:ring-primaryDark hover:shadow-lg hover:shadow-neutral-300 focus:outline-none focus:ring-2 focus:ring-primaryDark transition duration-200 ease-in-out transform cursor-pointer"
                                        onClick={() => isAuthenticated ? handleDownload(row.fileName, row.id, row.fileType) : setShowAuthModal(true)}
                                    >
                                        <DocumentDownloadIcon />
                                        <span>{t('download')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <AuthModal
                        visible={showAuthModal}
                        onClose={() => setShowAuthModal(false)}
                        onSignUp={() => router.push(`/${lng}/sign-up`)}
                        onConfirm={() => router.push(`/${lng}/sign-in`)}
                    />
                </>
            }

            {
                isEditable &&
                <div
                    className={`w-full h-full p-6 border rounded-2xl border-gray-200 bg-white hover:border-bluePrimary cursor-pointer`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex text-start h-[100%] items-center gap-4">
                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept=".xls,.docx,.txt,.csv"
                            onChange={handleOriginalFileUpload}
                        />
                        <label htmlFor="file-upload" className='p-3 bg-bluePrimaryLight rounded-xl cursor-pointer'>
                            <DocUpload />
                        </label>
                        <div>
                            <div className="flex gap-2 font-medium">
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex cursor-pointer w-auto text-center text-bluePrimary items-center transition-all underline rounded-lg sm:w-auto"
                                >
                                    {t('upload')}
                                </label>
                                <span>{t('or')} {t('dragAndDropFile')}</span>
                            </div>

                            <p className="text-gray-400 text-md">
                                {t('acceptedFileTypesAre')} xls, docx, txt, or csv ({t('fileLimit')} 50MB)
                            </p>
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}