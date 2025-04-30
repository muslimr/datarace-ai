import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FormInput } from '@components/shared';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatasetImageUploader from '../dataset-image-uploader';
import { useGetDatasetInfoQuery, useUpdateDatasetMutation } from '@api/datasets-api';
import { toast } from 'react-toastify';
import { IDatasetUpdateRequest } from '@api/types/dataset-types';
import { useParams } from 'next/navigation';
import TextEditor from '@components/shared/text-editor';
import TagInput from '@components/shared/tag-input';


interface IDatasetSidebarProps {
    visible: boolean;
    setSidebarOpen: (val: boolean) => void;
}

interface IFormInput extends IDatasetUpdateRequest { }

export const UpdateDatasetSidebar: React.FC<IDatasetSidebarProps> = ({ visible, setSidebarOpen }) => {
    const t = useTranslations();
    const lng = useLocale();
    const params = useParams();
    const { dataId } = params;
    const datasetId: string = Array.isArray(dataId) ? dataId[0] : dataId;

    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const [imageId, setImageId] = React.useState<number | null>(null);
    const [tags, setTags] = React.useState<{ name: string }[]>([]);

    const { data: datasetInfo, error: dataInfoError, isLoading: dataInfoLoading, refetch } = useGetDatasetInfoQuery({ id: dataId as string, lang: lng }, { skip: !dataId || !visible });
    const [updateDataset, { isLoading, error }] = useUpdateDatasetMutation();

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t('titleIsRequired')),
        content: Yup.string().required(t('descriptionIsRequired'))
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<IFormInput>({
        // resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const visibility = watch('visibility');
    const status = watch('status');


    const onResetData = () => {
        reset();
        setImageId(0);
        setValue('visibility', 'PUBLIC');
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            await updateDataset({
                ...data,
                dataId: dataId as string,
                datasetFileDownloadDto:
                    !!datasetInfo?.datasetFileDownloadDto?.length
                        ? [...datasetInfo?.datasetFileDownloadDto?.map(item => item.id)]
                        : [],
                tags,
                lang: lng,
            }).unwrap();
            toast.success('Dataset has been updated!');
            setSidebarOpen(false);
            onResetData();
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || 'An unexpected error occurred');
        }
    };

    const onCancel = () => {
        setSidebarOpen(false);
        // onResetData();
    }


    React.useEffect(() => {
        if (datasetInfo) {
            setValue('title', datasetInfo?.title);
            setValue('description', datasetInfo?.description);
            setValue('content', datasetInfo?.content);
            setValue('visibility', datasetInfo?.visibility);
            setValue('status', datasetInfo?.status);
            setValue('datasetUpdateProfileImageId', datasetInfo?.imageId);
            setImageId(datasetInfo.imageId || null);
            setTags(datasetInfo.tags || []);
        }
    }, [datasetInfo])


    React.useEffect(() => {
        setValue('datasetUpdateProfileImageId', imageId || undefined)
    }, [imageId])


    return (
        <div
            data-testid="sidebar-overlay"
            className={`fixed inset-0 z-20 bg-[rgba(0,0,0,.5)] top-[65px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`fixed overflow-scroll top-0 right-0  w-full lg:w-[50%] h-full items-between bg-white shadow-xl pt-20 transition-transform transform ${visible ? 'translate-x-0' : 'translate-x-full'}`}
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="realtive px-5 text-start space-y-1 overflow-auto space-y-5 mb-40">
                        <DatasetImageUploader
                            type="update"
                            setImageId={setImageId}
                            image={datasetInfo?.imageUrl || ''}
                        />
                        <div className="space-y-5 select-none">
                            <FormInput
                                type='text'
                                name='title'
                                placeholder={t('datasetTitle')}
                                register={register}
                                errors={errors}
                            />
                            <FormInput
                                isTextarea
                                type='text'
                                name='content'
                                placeholder={t('datasetDescription')}
                                register={register}
                                errors={errors}
                            />
                            <TextEditor
                                name='description'
                                initialValue={datasetInfo?.description}
                                register={register}
                                setValue={setValue}
                                errors={errors}
                            />
                            <div id="visibility" className='flex gap-3'>
                                <div
                                    className={`flex items-center text-center px-4 py-2 rounded-xl cursor-pointer ${visibility === 'PRIVATE' ? 'bg-primary text-white' : 'text-primary border border-primary'}`}
                                    onClick={() => setValue('visibility', 'PRIVATE')}
                                >
                                    {t('private')}
                                </div>
                                <div
                                    className={`flex items-center text-center px-4 py-2 rounded-xl cursor-pointer ${visibility === 'PUBLIC' ? 'bg-primary text-white' : 'text-primary border border-primary'}`}
                                    onClick={() => setValue('visibility', 'PUBLIC')}
                                >
                                    {t('public')}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 pt-1 select-none">
                                <label className="inline-flex items-center cursor-pointer">
                                    {/* Hidden native checkbox */}
                                    <input
                                        type="checkbox"
                                        className="hidden peer"
                                        onChange={() => status === 'ACTIVE' ? setValue('status', "INACTIVE") : setValue('status', "ACTIVE")}
                                    />
                                    {/* Custom checkbox */}
                                    <span className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-white peer-checked:bg-primary peer-checked:border-transparent transition-colors duration-200">
                                        {/* Checkmark Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 text-white hidden peer-checked:block"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span className="ml-2 text-gray-700">{t('active')}</span>
                                </label>
                                {/* <Link href={`/${lng}/forgot`} className="!text-gray-700 font-medium hover:!text-primaryLight transition duration-200 ease-in-out transform">{t('forgotPassword')}</Link> */}
                            </div>

                            <TagInput
                                label={t('tags')}
                                tags={tags}
                                setTags={setTags}
                                placeholder={t('pressEnterToAddTags')}
                            />
                        </div>
                    </div>
                    <div className="py-3 px-5 flex w-full gap-3 border-t">
                        <button
                            type='submit'
                            className="inline-flex w-[50%] text-center items-center justify-center px-6 py-3 text-white transition-all bg-primary rounded-lg sm:w-auto hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                        >
                            {t('updateDataset')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex w-[50%] text-center items-center justify-center px-4 py-2 text-gray-500 transition-all bg-gray-100 rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none"
                        >
                            {t('close')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
