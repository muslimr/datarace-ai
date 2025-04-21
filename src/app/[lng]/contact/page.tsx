import React from 'react';
import { Metadata } from 'next';
import { Loader } from '@components/shared';
import { useLocale, useTranslations } from 'next-intl';
import { ContactForm, SignUpForm } from '@components/features';
import { InstagramIcon, LinkedinIcon, MailIcon, MapIcon, PhoneIcon, TwitterIcon, YoutubeIcon } from '@assets/icons';
import Link from 'next/link';


export const metadata: Metadata = {
    title: "Contact Us | Datarace.ai",
    description: "DataRace is an innovative platform designed to bring data scientists and Al enthusiasts together to compete in data-driven challenges.",
};


const Contact: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
            <main id="main-content" className="flex-grow bg-gray-50 py-[4rem] lg:py-[6rem] space-y-20">
                <section className="container flex flex-col md:px-10 lg:px-40 mx-auto w-full justify-between space-y-20 lg:space-y-0">
                    <div className="justify-between space-y-[50px]">
                        <div>
                            <h1 className="text-[32px] md:text-[2.3rem] font-medium">{t('contact')}</h1>
                            <nav className="text-sm flex justify-start items-center text-gray-600 space-x-3">
                                <Link href={`/${lng}`} className="hover:text-primaryLight">{t('mainPage')}</Link>
                                <span className="text-lg">&gt;</span>
                                <span>{t('contact')}</span>
                            </nav>
                            {/* <p className="text-md text-gray-700">{t('contactDescription')}</p> */}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row w-full bg-white shadow-md rounded-xl p-10 gap-10">
                        <div className="flex flex-col lg:w-[50%] gap-3">
                            <div className="flex bg-[#F4F4F4] rounded-xl p-3 gap-2">
                                <MapIcon />
                                <div>
                                    <h3 className="text-xs mb-2 text-gray-500">{t('address')}:</h3>
                                    <p className="text-md text-gray-700">90A Nizami St, Baku 1010, Azerbaijan</p>
                                </div>
                            </div>
                            <div className="flex bg-[#F4F4F4] rounded-xl p-3 gap-2">
                                <PhoneIcon />
                                <div>
                                    <h3 className="text-xs mb-2 text-gray-500">{t('phone')}:</h3>
                                    <p className="text-md text-gray-700">(+994) 50 987 00 14</p>
                                </div>
                            </div>
                            <div className="flex bg-[#F4F4F4] rounded-xl p-3 gap-2">
                                <MailIcon />
                                <div>
                                    <h3 className="text-xs mb-2 text-gray-500">{t('email')}:</h3>
                                    <p className="text-md text-gray-700">info@datarace.ai</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex lg:w-[50%]">
                            <ContactForm />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Contact;
