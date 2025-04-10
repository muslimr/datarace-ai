import React from 'react';
import { useTranslations } from 'next-intl';
import { FormInput } from '@components/shared';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import DatasetImageUploader from '../dataset-image-uploader';
import { useCreateDatasetMutation } from '@api/datasets-api';
import { toast } from 'react-toastify';
import { IDatasetCreateRequest } from '@api/types/dataset-types';
import TextEditor from '@components/shared/text-editor';
import TagInput from '@components/shared/tag-input';


interface IDatasetSidebarProps {
    visible: boolean;
    setSidebarOpen: (val: boolean) => void;
}

interface IFormInput extends IDatasetCreateRequest { }

export const CreateDatasetSidebar: React.FC<IDatasetSidebarProps> = ({ visible, setSidebarOpen }) => {
    const t = useTranslations();
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const [imageId, setImageId] = React.useState<number | null>(0);
    const [tags, setTags] = React.useState<{ name: string }[]>([]);

    const [createDataset, { isLoading, error }] = useCreateDatasetMutation();

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t('titleIsRequired')),
        content: Yup.string().required(t('descriptionIsRequired'))
    });

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<IFormInput>({
        // resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const visibility = watch('visibility');

    const onResetData = () => {
        reset();
        setImageId(null);
        setTags([]);
        setValue('visibility', 'PUBLIC');
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (!data.title?.trim()) {
            toast.error(t('titleIsRequired'));
            return;
        }
        if (!data.content?.trim()) {
            toast.error(t('contentIsRequired'));
            return;
        }
        try {
            await createDataset({
                datasetImageId: imageId,
                ...data,
                tags
            }).unwrap();
            toast.success('Your dataset has been created and will be available for public view after approval by the admins.');
            setSidebarOpen(false);
            onResetData();
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || 'An unexpected error occurred');
        }
    };

    const onCancel = () => {
        setSidebarOpen(false);
        onResetData();
    }


    React.useEffect(() => {
        setValue('visibility', 'PUBLIC')
    }, [])


    return (
        <div
            data-testid="sidebar-overlay"
            className={`fixed inset-0 z-20 overflow-hidden bg-[rgba(0,0,0,.5)] top-[65px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`fixed overflow-scroll top-0 right-0 w-full lg:w-[50%] h-full items-between bg-white shadow-xl pt-20 transition-transform transform ${visible ? 'translate-x-0' : 'translate-x-full'}`}
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-5 pb-20 text-start space-y-1 overflow-auto space-y-5">
                        <DatasetImageUploader imageId={imageId} setImageId={setImageId} />

                        <div className="space-y-5 select-none">
                            <FormInput
                                type='text'
                                name='title'
                                placeholder={t('datasetTitle')}
                                register={register}
                                errors={errors}
                            />
                            <TextEditor
                                name='content'
                                initialValue=' '
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
                            {t('createDataset')}
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
