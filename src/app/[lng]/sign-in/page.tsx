"use client";

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import { useLoginUserMutation } from '@api/user-api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormInput, Loader } from '@components/shared';
import { toast } from 'react-toastify';
import { EmailIcon, EyeClosedIcon, EyeIcon, GoogleIcon, } from '@assets/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import withProtectedRoute from '@utils/withProtectedRoute';


interface IFormInput {
    emailOrNickname: string;
    password: string;
    rememberMe?: boolean;
}


const SignInContent: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const selectAuthData = createSelector(
        (state: RootState) => state.user.isAuthenticated,
        (isAuthenticated) => ({ isAuthenticated })
    );

    const { isAuthenticated } = useSelector(selectAuthData);


    const validationSchema = Yup.object().shape({
        emailOrNickname: Yup.string().required(t('emailNicknameIsRequired')),
        password: Yup.string()
            .required(t('passwordIsRequired'))
            .min(3, t('atLeast3Characters')),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // RTK Query mutation hook
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            // Passing rememberMe along with the login data
            const payload = {
                ...data,
                rememberMe: data.rememberMe || false,
            };

            await loginUser(payload).unwrap();
            router.push('/');
        } catch (err: any) {
            if (err?.data?.code === "UNEXPECTED_EXCEPTION = USER_NOT_FOUND") {
                toast.error("User is not found");
            } else {
                toast.error(err.data?.message || 'An unexpected error occurred');
            }
        }
    };

    React.useEffect(() => {
        if (token) {
            router.push('/');
            Cookies.set('dtr-token', token as string, {
                secure: process.env.NODE_ENV === 'production',
                expires: 47 / 24,
            });
        }
    }, [token]);


    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    if (isAuthenticated) router.push('/')


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
                    {/* <Link className="flex cursor-pointer justify-center mb-10" href={`/${lng}`}>
                        <Image src="/svg/datarace-logo.svg" alt="Logo" width={250} height={70} />
                    </Link> */}
                    <h1 className="text-5xl font-medium text-white md:max-w-[80%]">{t('title')}</h1>
                    <p className="text-lg text-white">{t('description')}</p>
                </div>
            </div>

            {/* Right side with form */}
            <div className="w-full lg:w-1/2 bg-white content-center px-8 py-[30px] lg:p-20 overflow-y-scroll">
                <div className="w-full mx-auto lg:max-w-md space-y-10 animate-right-svg">
                    <Link className="flex items-center lg:hidden justify-center cursor-pointer mb-[50px]" href={`/${lng}`}>
                        <Image src="/svg/datarace-logo.svg" alt="Logo" width={250} height={70} priority />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-semi mb-4 lg:text-start text-center">{t('logIn')}</h2>
                        <p className="mb-4 text-sm text-gray-600 lg:text-start text-center">{t('enterEmailPasswordToLogIn')}</p>
                    </div>
                    <form className="space-y-5 select-none" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            nonCapitalize
                            label={`${t('emailOrNickname')}*`}
                            type='text'
                            name='emailOrNickname'
                            placeholder="example@company.com"
                            register={register}
                            errors={errors}
                            icon={<EmailIcon />}
                        />
                        <FormInput
                            label={`${t('password')}*`}
                            type={showPassword ? "text" : "password"}
                            name='password'
                            placeholder={t('enterPassword')}
                            register={register}
                            errors={errors}
                            onClickIcon={togglePasswordVisibility}
                            icon={showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                        />
                        <div className="flex justify-between items-center pb-4 pt-1 select-none">
                            <label className="inline-flex items-center cursor-pointer">
                                {/* Hidden native checkbox */}
                                <input
                                    type="checkbox"
                                    className="hidden peer"
                                    {...register("rememberMe")}
                                />
                                {/* Custom checkbox */}
                                <span className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-white peer-checked:bg-blue-400 peer-checked:border-transparent transition-colors duration-200">
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
                                <span className="ml-2 text-gray-700">{t('rememberMe')}</span>
                            </label>
                            <Link href={`/${lng}/forgot`} className="!text-gray-700 font-medium hover:!text-primaryLight transition duration-200 ease-in-out transform">{t('forgotPassword')}</Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full h-[50px] font-regmed bg-primary text-white py-2 rounded-xl ring-2 ring-primary hover:bg-primaryDark hover:ring-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:outline-none focus:ring-2 focus:ring-primaryDark focus:shadow-none transition duration-200 ease-in-out transform"
                        >
                            {t('logIn')}
                        </button>
                        <div className="text-center my-4">{t('or')}</div>
                        <Link
                            href="https://api.datarace.ai/oauth2/authorization/google"
                            type="button"
                            className="w-full h-[50px] bg-none text-primary py-2 rounded-xl hover:bg-black ring-2 ring-primary hover:ring-black hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:outline-none hover:-tranneutral-y-px focus:shadow-none focus:outline-none focus:ring-2 focus:ring-black flex items-center justify-center space-x-2 transition duration-200 ease-in-out transform animate-button"
                        >
                            <GoogleIcon />
                            <span className="font-regmed">{t('loginWithGoogle')}</span>
                        </Link>
                    </form>
                    <p className="mt-6 text-center font-light">
                        {t('dontHaveAnAccount')}
                        <Link href={`/${lng}/sign-up`} className="!text-gray-700 font-semi hover:!text-primaryLight transition duration-200 ease-in-out transform ml-2">
                            {t('signUp')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SignIn: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <SignInContent />
        </Suspense>
    )
}

export default withProtectedRoute(SignIn);
