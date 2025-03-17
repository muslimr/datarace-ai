"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import BlogImageUploader from '@components/features/blog/blog-image-uploader';
import { FormInput } from '@components/shared';
import TextEditor from '@components/shared/text-editor';
import { useCreateBlogMutation } from '@api/blogs-api';
import * as Yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ITag } from '@api/types/blog-types';
import TagInput from '@components/shared/tag-input';
import { yupResolver } from '@hookform/resolvers/yup';


interface IFormInput {
    title: string,
    content: string,
    tags?: ITag[],
}


const BlogCreate: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const router = useRouter();

    const [imageId, setImageId] = React.useState<number | string | null>(null);
    const [tags, setTags] = React.useState<{ name: string }[]>([]);

    const [createBlog, { isLoading, isError, isSuccess }] = useCreateBlogMutation();

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t('titleIsRequired')),
        content: Yup.string().required(t('contentIsRequired'))
    });


    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<IFormInput>({
        // resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (!imageId) {
            toast.error(t('imageIsRequired'));
            return;
        }
        if (!data.title?.trim()) {
            toast.error(t('titleIsRequired'));
            return;
        }
        if (!data.content?.trim()) {
            toast.error(t('contentIsRequired'));
            return;
        }
        try {
            await createBlog({
                blogImageId: imageId,
                ...data,
                tags,
            }).unwrap();
            toast.success('Your blog has been created and will be available for public view after approval by the admins.');
            onResetData();
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || 'An unexpected error occurred');
        }
    };


    const onResetData = () => {
        reset()
        router.push(`/${lng}/blog`)
    }


    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto px-7 py-[6rem] space-y-5">
                <div>
                    <nav className="text-sm flex justify-start items-center text-gray-600 space-x-3">
                        <Link href={`/${lng}`} className="hover:text-primary">{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <Link href={`/${lng}/blog`} className="hover:text-primary">{t('blog')}</Link>
                        <span className="text-lg">&gt;</span>
                        <span>{t('createBlog')}</span>
                    </nav>
                    <div className='flex items-center justify-between py-5'>
                        <h2 className="text-[1.7rem] leading-[2.5rem] md:text-[2.5rem] text-center font-semibold">
                            {t('createBlog')}
                        </h2>
                    </div>
                </div>

                <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

                {/* Main Content */}
                <main id="#main-content" className="space-y-5">
                    <section className="relative">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="pb-5 text-start space-y-1 space-y-5 select-none">
                                <BlogImageUploader setImageId={setImageId} />
                                <FormInput
                                    label={t('mainTitle')}
                                    type='text'
                                    name='title'
                                    placeholder={t('blogTitle')}
                                    register={register}
                                    errors={errors}
                                />
                                <TextEditor
                                    label={t('content')}
                                    name='content'
                                    initialValue=' '
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                                <TagInput
                                    label={t('tags')}
                                    tags={tags}
                                    setTags={setTags}
                                    placeholder={t('pressEnterToAddTags')}
                                />
                            </div>
                            <div className='flex gap-3 border-t justify-end py-3'>
                                <Link href={`/${lng}/blog`}>
                                    <button
                                        type="button"
                                        onClick={onResetData}
                                        className="flex w-40 text-center items-center justify-center px-4 py-3 text-gray-500 transition-all bg-gray-100 rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none"
                                    >
                                        {t('cancel')}
                                    </button>
                                </Link>
                                <button
                                    type='submit'
                                    className="flex w-40 text-center items-center justify-center px-4 py-3 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                                >
                                    {t('submit')}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default BlogCreate;
