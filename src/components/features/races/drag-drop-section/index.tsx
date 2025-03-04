"use client"

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { CheckIcon, DownloadIcon, TrashIcon, ZipIcon } from '@assets/icons';
import { useGetResultQuery, useLazyDownloadResultQuery, useLazySubmitResultQuery } from '@api/upload-api';
import { useDeleteCompetitionFileMutation, useGetCompetitionInfoQuery, useSaveResultMutation } from '@api/competition-api';
import { ConfirmationModal } from '@components/shared';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || '';

interface FileUploaderProps {
    competitionId?: number,
    onClose: () => void,
}

const FileUploader: React.FC<FileUploaderProps> = ({ competitionId, onClose }) => {
    const t = useTranslations();
    const [askModal, showAskModal] = React.useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isFakeUploading, setIsFakeUploading] = useState(false);

    const [saveResult, { isLoading: isSaving }] = useSaveResultMutation();
    const { competitionInfo } = useSelector((state: RootState) => state.competitions);
    const { user } = useSelector((state: RootState) => state.user);
    const [triggerSubmitResult, { isLoading: isSubmitting }] = useLazySubmitResultQuery();
    const { data: resultData, isLoading: isResultLoading, refetch: refetchResult } = useGetResultQuery(
        { competitionId: competitionInfo?.id as number, userId: user?.id as number },
        { skip: !competitionInfo?.id }
    );
    const { refetch: refetchCompetitionInfo } = useGetCompetitionInfoQuery(
        { id: competitionInfo?.id as number },
        { skip: !competitionInfo?.id }
    );
    const [triggerDownloadResult, { isLoading: isDownloading }] = useLazyDownloadResultQuery();
    const [deleteFile] = useDeleteCompetitionFileMutation();


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setUploadProgress(0);
            startFakeUpload();
        }
    };


    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];

        if (droppedFile) {
            const isZipFile = droppedFile.type === 'application/zip' || droppedFile.name.endsWith('.zip');
            if (!isZipFile) {
                toast.error("Only .zip files are allowed.", { position: "bottom-left" });
                return;
            }
            setFile(droppedFile);
            setUploadProgress(0);
            startFakeUpload(); // Start fake upload on drop
        }
    };



    const startFakeUpload = () => {
        setIsFakeUploading(true);
        setUploadProgress(0);

        // Simulate the fake upload progress with smaller increments and faster updates
        const fakeInterval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(fakeInterval);
                    setIsFakeUploading(false);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 50);
    };


    const handleSave = async () => {
        if (!file) {
            toast.error("Please select a file to upload.", { position: "bottom-left" });
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            await saveResult({
                competitionId: competitionInfo?.id,
                file: formData,
            }).unwrap();
            toast.success(t("solutionSavedSuccessfully"), { position: "bottom-left" })
            handleFileRemove();
            refetchResult();
        } catch (error) {
            toast.error("Failed to save the file.", {
                position: "bottom-left",
            });
            console.error("Upload error: ", error);
        } finally {
            setIsUploading(false);
        }
    };


    const handleSubmit = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                await saveResult({
                    competitionId: competitionInfo?.id,
                    file: formData,
                }).unwrap();
            }
            await triggerSubmitResult({ competitionId: competitionInfo?.id as number });
            toast.success(t('uploadedSuccessfully'), { position: "bottom-left" })
            await refetchCompetitionInfo();
            handleFileRemove();
            onClose();
        } catch (error) {
            toast.error("Failed to submit the file.", { position: "bottom-left", });
            console.error("Submit error: ", error);
        }
    };


    const handleDownload = async () => {
        try {
            const token = Cookies.get('dtr-token');
            const response = await fetch(BASE_URL + `/files/download/result/${resultData?.id || competitionInfo?.resultFileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/zip',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download the file');
            }

            const blob = await response.blob();
            saveAs(blob, 'filename.zip');
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };


    const handleFileDelete = async () => {
        try {
            await deleteFile({ fileId: competitionInfo?.resultFileId }).unwrap();
            toast.success('File has been deleted successfully!');
        } catch (error) {
            console.error('Error deleting the file:', error);
        }
    };


    const handleFileRemove = () => {
        setFile(null);
        setUploadProgress(0);
    };

    const onCloseSidebar = () => {
        handleFileRemove();
        onClose();
    }

    let submitIsDisabled = !resultData?.id || isSaving || isSubmitting || isFakeUploading
    let saveIsDisabled = !file || isSaving || isSubmitting || isFakeUploading


    return (
        <div className="flex flex-col justify-center items-center h-[300px] space-y-2 mb-40 pt-20">
            <div className="w-full space-y-2">
                {
                    (file || competitionInfo?.resultFileId) &&
                    <div className="flex items-center space-x-3">
                        <ZipIcon className="w-9 h-9" />
                        <div className="w-full">
                            <p className="text-sm">{file?.name || competitionInfo?.resultFileName}</p>
                            {
                                file &&
                                <p className="text-xs text-gray-500 w-full">{(file?.size / (1024 * 1024)).toFixed(2)} MB</p>
                            }
                        </div>
                        <div className="flex space-x-3 items-center justify-center">
                            {((uploadProgress == 100) || resultData?.id) && <CheckIcon className="w-10 h-10" />}
                            {competitionInfo?.resultFileName && <DownloadIcon onClick={handleDownload} className="w-6 h-6 cursor-pointer fill-gray-800 hover:fill-primaryLight" />}
                            {competitionInfo?.resultFileId && <TrashIcon onClick={handleFileDelete} className="w-6 h-6 cursor-pointer hover:stroke-red" />}
                        </div>
                    </div>
                }
                {
                    (isUploading || isFakeUploading) &&
                    <div className="relative w-full h-1 bg-gray-200 rounded-full">
                        <div
                            className="absolute top-0 h-full bg-primary rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                }
            </div>

            {/* )} */}
            <div
                className={`w-full h-full p-6 border-dashed border-2 rounded-xl ${isFakeUploading || isUploading ? 'border-primaryLight bg-primaryExtra' : 'border-gray-300 bg-white'
                    }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className="flex flex-col text-center h-[100%] items-center justify-center">
                    {file && (uploadProgress == 100) ? (
                        <>
                            <p className="text-primaryLight mb-4">{file.name} {t('uploadedSuccessfully')}!</p>
                            <button
                                onClick={handleFileRemove}
                                className="mb-10 inline-flex w-full sm:w-40 text-center justify-center px-4 py-2 text-white bg-red transition-all border border-red rounded-lg hover:bg-red hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px focus:shadow-none"
                            >
                                Remove File
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-500">{t('dragDropFiles')}</p>
                            <p className="text-gray-500 text-lg">OR</p>
                            <input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                accept=".zip"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-flex cursor-pointer w-auto text-center items-center px-10 py-2 text-white transition-all bg-primary rounded-lg sm:w-auto hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px focus:shadow-none"
                            >
                                {resultData?.id ? t('uploadNewFile') : t('browseFile')}
                            </label>
                            <p className="text-gray-500 text-sm">
                                {t('acceptFileLimit')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white absolute left-0 w-full bottom-0 shadow-[0px_-2px_10px_0px_rgba(0,0,0,0.10)]">
                <div className="flex space-x-3 p-5">
                    <button
                        onClick={() => showAskModal(true)}
                        disabled={submitIsDisabled}
                        className={`inline-flex w-auto text-center items-center px-10 py-2 text-white transition-all ${submitIsDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none'} rounded-lg sm:w-auto animate-button`}
                    >
                        {isSubmitting ? t('uploading') : t('submit')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveIsDisabled}
                        className={`inline-flex w-auto text-center items-center px-10 py-2 text-white transition-all ${saveIsDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-dark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none'} rounded-lg sm:w-auto animate-button`}
                    >
                        {isSaving ? t('saving') : t('save')}
                    </button>
                    <button onClick={onCloseSidebar} className="inline-flex w-auto text-center items-center px-10 py-2 text-primary transition-all border border-primary rounded-lg sm:w-auto hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none animate-button">
                        {t('cancel')}
                    </button>
                </div>
            </div>

            <ConfirmationModal
                visible={askModal}
                onConfirm={handleSubmit}
                onClose={() => showAskModal(false)}
            />
        </div>
    );
};

export default FileUploader;
