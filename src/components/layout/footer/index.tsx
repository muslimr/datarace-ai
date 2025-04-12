"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FooterTermsModal, TermsModal } from '@components/shared';

const InstagramIcon = dynamic(() => import('@assets/icons').then(mod => mod.InstagramIcon), { ssr: false });
const TwitterIcon = dynamic(() => import('@assets/icons').then(mod => mod.TwitterIcon), { ssr: false });
const YoutubeIcon = dynamic(() => import('@assets/icons').then(mod => mod.YoutubeIcon), { ssr: false });
const LinkedinIcon = dynamic(() => import('@assets/icons').then(mod => mod.LinkedinIcon), { ssr: false });
const LogoWhite = dynamic(() => import('@assets/icons').then(mod => mod.LogoWhite), { ssr: false });


export const Footer: React.FC = () => {
    const lng = useLocale();
    const t = useTranslations();
    const pathname = usePathname();
    const [termsModal, setTermsModal] = React.useState(false);

    const hideHeaderRoutes = React.useMemo(() => [`/${lng}/sign-in`, `/${lng}/sign-up`, `/${lng}/activation`, `/${lng}/forgot`, `/${lng}/reset-password`, `/${lng}/coming`], []);
    const shouldHideFooter = React.useMemo(() => hideHeaderRoutes.includes(pathname), [pathname]);

    if (shouldHideFooter) return null;

    return (
        <footer className="bg-dark" role="contentinfo">
            <div className="container mx-auto w-full py-[50px] px-7 space-y-12">
                <section className="grid gap-10 grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] text-white text-center md:text-start">
                    <div className="space-y-6 flex flex-col items-center md:items-start md:pr-40">
                        <LogoWhite aria-hidden="true" />
                        <p className="font-light text-sm">
                            {t('footerDescription')}
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-semibold">{t('company')}</h2>
                        <ul className="text-sm font-light space-y-4">
                            <li>
                                <Link href={`/${lng}/about-us`} className="hover:text-primary">{t('aboutUs')}</Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/faq`} className="hover:text-primary">{t('faq')}</Link>
                            </li>
                            <li>
                                <Link href="#" onClick={() => setTermsModal(true)} className="hover:text-primary">{t('termsTitle')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-semibold">{t('races')}</h2>
                        <ul className="text-sm font-light space-y-4">
                            <li>
                                <Link href={`/${lng}/races`} className="hover:text-primary">{t('activeRaces')}</Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/coming`} className="hover:text-primary">{t('courses')}</Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/coming`} className="hover:text-primary">{t('softwareDevelopment')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-semibold">{t('contact')}</h2>
                        <ul className="text-sm font-light space-y-4">
                            <li>
                                <Link href="mailto:info@datarace.ai" className="hover:text-primary">info@datarace.ai</Link>
                            </li>
                            <li>
                                <Link
                                    href={`https://www.google.com/maps/place/The+Landmark+Hotel+Baku/@40.375979,49.8510411,17z/data=!3m1!4b1!4m9!3m8!1s0x40307da92226dcf3:0xe7030175bf64e918!5m2!4m1!1i2!8m2!3d40.375979!4d49.8510411!16s%2Fg%2F1v2yxbyy?entry=ttu&g_ep=EgoyMDI0MTIwOC4wIKXMDSoASAFQAw%3D%3D`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary"
                                >
                                    90A Nizami St, Baku 1010, Azerbaijan
                                </Link>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
                    <span className="text-gray-400">DataRace AI</span>
                    <div className="flex space-x-5 justify-center">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <InstagramIcon />
                            <span className="sr-only" aria-label='Instagram page'>Instagram page</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <TwitterIcon />
                            <span className="sr-only" aria-label='Twitter page'>Twitter page</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <YoutubeIcon />
                            <span className="sr-only" aria-label='YouTube page'>YouTube page</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <LinkedinIcon />
                            <span className="sr-only" aria-label='LinkedIn page'>LinkedIn page</span>
                        </a>
                    </div>
                </section>
            </div>

            <TermsModal
                visible={termsModal}
                hideButtons
                onConfirm={() => setTermsModal(false)}
                onClose={() => setTermsModal(false)}
            />
        </footer>
    );
};
