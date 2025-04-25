"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import TabSelects from '@components/shared/tab-selects';
import { GeneralSection } from '@components/features/races/general-section';
import { DatasetsSection, FeaturedCompetitionsSection, RigthContent, ScoreBoardSection } from '@components/features';
import { useGetCompetitionInfoQuery } from '@api/competition-api';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CompetitionComments } from '@components/features/races/competition-comments';
import CountdownTimer from '@components/shared/countdown-timer';
import { UpvoteButton } from '@components/shared';


const RaceDetails: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const params = useParams();
    const { raceId } = params;
    const competitionId = Array.isArray(raceId) ? raceId[0] : raceId;
    const { data: competitionInfo, error, isLoading, refetch } = useGetCompetitionInfoQuery({ id: competitionId as string, lang: lng }, { skip: !competitionId });


    const TABS: { title: string, value: string, content: ReactNode }[] = [
        {
            value: 'general',
            title: t('generalOverview'),
            content: <GeneralSection />,
        },
        {
            value: 'data',
            title: t('data'),
            content: <DatasetsSection />,
        },
        {
            value: 'scoreboard',
            title: t('scoreBoard'),
            content: <ScoreBoardSection />,
        },
    ]


    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto py-[6rem] space-y-5 px-7">
                {/* Breadcrumb */}
                <div className="flex flex-col md:flex-row items-end justify-between">
                    <nav className="mb-5 md:mb-0 px-2 md:px-0 text-sm flex justify-start items-center text-gray-600 space-x-3">
                        <Link href={`/${lng}`} className="hover:text-primaryLight" style={{ whiteSpace: "nowrap" }}>{t('mainPage')}</Link>
                        <span className="text-lg">&gt;</span>
                        <Link href={`/${lng}/races`} className="hover:text-primaryLight">{t('races')}</Link>
                        <span className="text-lg">&gt;</span>
                        <div className='truncate-text-1'>{competitionInfo?.name}</div>
                    </nav>

                    {/* <UpvoteButton /> */}
                </div>

                <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

                {/* Main Content */}
                <main id="#main-content" className="space-y-5">
                    <section className="flex flex-col lg:flex-row gap-7">
                        <div className="flex relative rounded-2xl lg:min-w-[23rem] lg:max-w-[23rem]">
                            <img src={competitionInfo?.imageUrl || "/svg/dr_banner.svg"} alt="Race Image" className="md:w-full h-[15rem] rounded-2xl object-cover" />
                        </div>
                        <div className="flex flex-col justify-between w-full h-[15rem]">
                            <div className="flex flex-col gap-2">
                                <h1 className="bottom-0 left-0 text-2xl font-semibold truncate-text-3">
                                    {competitionInfo?.name}
                                </h1>
                                <p className='text-sm truncate-text-3 text-gray-500'>{competitionInfo?.text}</p>
                            </div>
                            {
                                competitionInfo?.expirationDate &&
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xs'>Time left:</label>
                                    <CountdownTimer date={competitionInfo?.expirationDate || ''} />
                                </div>
                            }
                        </div>
                        {/* Right Sidebar */}
                        <div className="min-w-[25%]">
                            <RigthContent raceId={competitionId} />
                        </div>
                    </section>

                    <section className="grid rounded-2xl">
                        <TabSelects tabs={TABS} />
                    </section>
                    <section>
                        <CompetitionComments
                            competitionId={competitionId}
                            isEditable={competitionInfo?.isEditable}
                        />
                    </section>

                    <section className="py-10">
                        <div className='container mx-auto'>
                            <FeaturedCompetitionsSection />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RaceDetails;