"use client";

import { FormInput, Modal } from '@components/shared';
import React from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocale, useTranslations } from 'next-intl';
import { useSendContactDetailsMutation } from '@api/contact-api';


interface IFormInput {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}


export const ContactForm: React.FC = () => {
    const lng = useLocale();
    const t = useTranslations();

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Full name is required'),
        email: Yup.string().email(t('invalidEmail')).required(t('emailIsRequired')),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required'),
    });


    const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    // RTK Query mutation hook
    const [sendContactDetails, { isLoading, error }] = useSendContactDetailsMutation()

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            await sendContactDetails(data);
            toast.success("Success! We have received your data and will get back to you shortly!");
            reset();
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || err);
        }
    };


    return (
        <div className="w-full mx-auto animate-right-svg">
            <form className="space-y-5 select-none" onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label={`${t('nameAndSurname')}*`}
                    type='text'
                    name='fullName'
                    placeholder={t('enterFullName')}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    label={`${t('emailAddress')}*`}
                    type='email'
                    name='email'
                    placeholder="example@company.com"
                    register={register}
                    errors={errors}
                />
                <FormInput
                    label={`${t('subject')}*`}
                    type="text"
                    name='subject'
                    placeholder={t('enterYourTopic')}
                    register={register}
                    errors={errors}
                />
                <FormInput
                    isTextarea={true}
                    label={`${t('message')}*`}
                    name='message'
                    placeholder={t('enterYourMessage')}
                    register={register}
                    errors={errors}
                />
                <button
                    type="submit"
                    className="w-full h-[50px] font-regmed bg-primary text-white py-2 rounded-lg ring-2 ring-primary hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:outline-none focus:ring-2 focus:ring-primaryDark focus:shadow-none focus:bg-primaryDark transition duration-200 ease-in-out transform disabled:bg-gray-400 disabled:ring-gray-400 disabled:cursor-not-allowed"
                >
                    {t('submit')}
                </button>
            </form>
        </div>
    )
}
