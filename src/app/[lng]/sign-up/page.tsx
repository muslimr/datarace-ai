import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { SignUpForm } from '@components/features';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';


export const metadata: Metadata = {
    title: "Sign Up | DataRace.ai",
    description: "DataRace is an innovative platform designed to bring data scientists and AI enthusiasts together to compete in data-driven challenges.",
};


const SignUp: React.FC = () => {
    let t = useTranslations();
    let lng = useLocale();

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
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUp;
