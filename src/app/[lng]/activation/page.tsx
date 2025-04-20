"use client";

import React, { useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FailedOperation, SuccessfullOperation } from '@components/features/activation';
import { useActivateUserQuery } from '@api/user-api';
import { Loader } from '@components/shared';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

enum ErrorType {
    EXCEED_REQUEST_COUNT = "EXCEED_REQUEST_COUNT",
    NOT_FOUND = "NOT_FOUND"
}

const errorMessages = {
    [ErrorType.EXCEED_REQUEST_COUNT]: "You have reached your request limit. Please wait for an hour before trying again.",
    [ErrorType.NOT_FOUND]: "Your token has expired. Please register your account again to obtain a new one."
};

interface ApiError {
    error: ErrorType;
    message: string;
}

const ActivationPageContent: React.FC = () => {
    let lng = useLocale();
    let t = useTranslations();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Fetch user activation on page load if the token exists
    const { data, error, isSuccess, isLoading, refetch } = useActivateUserQuery(
        { token: token || "" },
        { skip: !token }
    );

    useEffect(() => {
        if (token) {
            refetch(); // Ensure the query is run on page load when the token is available
        }
    }, [token, refetch]);

    const apiError = (error as { data?: ApiError } | undefined)?.data;
    const errorMessage = apiError && errorMessages[apiError.error];

    if (isLoading) return <Loader />;


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
                {errorMessage && <FailedOperation message={errorMessage} />}
                {isSuccess && <SuccessfullOperation />}
            </div>
        </div>
    );
};

const Activation: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <ActivationPageContent />
        </Suspense>
    );
};

export default Activation;
