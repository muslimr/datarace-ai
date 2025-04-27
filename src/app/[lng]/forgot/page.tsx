"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useForgotPasswordMutation, useLoginUserMutation } from '@api/user-api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormInput, Loader } from '@components/shared';
import { toast } from 'react-toastify';
import { EmailIcon, EyeClosedIcon, EyeIcon, GoogleIcon, } from '@assets/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import { useLocale, useTranslations } from 'next-intl';


interface IFormInput {
    email: string;
}


const ForgetPassword: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const router = useRouter();

    const selectAuthData = createSelector(
        (state: RootState) => state.user.isAuthenticated,
        (isAuthenticated) => ({ isAuthenticated })
    );

    const { isAuthenticated } = useSelector(selectAuthData);

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('emailNicknameIsRequired')),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // RTK Query mutation hook
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            // Passing rememberMe along with the login data
            const payload = {
                ...data,
            };

            await forgotPassword(payload).unwrap();
            router.push('/');
        } catch (err: any) {
            if (err?.data?.code === "UNEXPECTED_EXCEPTION = USER_NOT_FOUND") {
                toast.error("Email is not found");
            } else {
                toast.error(err.data?.message || 'An unexpected error occurred');
            }
        }
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    if (isLoading) return <Loader />

    return (
        <div className="min-h-screen max-h-screen flex">
            {/* Left side with image */}
            <div className="w-full lg:w-1/2 relative hidden lg:block">
                <Image
                    src="/png/dr_banner.png"
                    alt="Banner Picture"
                    layout="fill"
                    objectFit="cover"
                    className="h-full"
                    priority
                />
                <div className="absolute column w-full h-full content-end text-start px-20 py-[10%] space-y-7">
                    <h1 className="text-5xl font-medium text-white md:max-w-[80%]">{t('title')}</h1>
                    <p className="text-lg text-white">{t('description')}</p>
                </div>
            </div>

            {/* Right side with form */}
            <div className="w-full lg:w-1/2 bg-white content-center px-8 py-[30px] lg:p-20 overflow-y-scroll">
                <div className="w-full mx-auto lg:max-w-md space-y-10">
                    <Link className="flex items-center lg:hidden justify-center cursor-pointer mb-[50px]" href={`/${lng}`}>
                        <Image src="/svg/datarace-logo.svg" alt="Logo" width={250} height={70} priority />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-semi mb-4 lg:text-start text-center">{t('forgotPassword')}</h2>
                        <p className="mb-4 text-sm text-gray-600 lg:text-start text-center">{t('restorePasswordText')}</p>
                    </div>
                    <form className="space-y-10 select-none" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label={`${t('email')}*`}
                            type='text'
                            name='email'
                            placeholder="example@company.com"
                            register={register}
                            errors={errors}
                            icon={<EmailIcon />}
                        />
                        <button
                            type="submit"
                            className="w-full h-[50px] font-regmed bg-primary text-white py-2 rounded-xl ring-2 ring-primary hover:bg-primaryDark hover:ring-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:outline-none focus:ring-2 focus:ring-primaryDark focus:shadow-none transition duration-200 ease-in-out transform"
                        >
                            {t('send')}
                        </button>
                    </form>
                    <p className="mt-6 text-center font-light">
                        {t('dontHaveAnAccount')} <a href={`/${lng}/sign-up`} className="!text-gray-700 font-semi hover:!text-primaryLight transition duration-200 ease-in-out transform">{t('signUp')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
