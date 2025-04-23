"use client";

import React from 'react';
import { AuthModal, CompetitionInfoRightSkeleton, Modal } from '@components/shared';
import { CertificateIcon, CheckFilledIcon, CoinsGreenIcon, CoinsIcon, GreenCertificate, RaceFlag } from '@assets/icons';
import { RacesSidebar } from '../races-sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { useJoinCompetitionMutation } from '@api/competition-api';
import { toast } from 'react-toastify';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';


interface IRightContentProps {
    raceId: number | string,
}

export const RigthContent: React.FC<IRightContentProps> = (props) => {
    let { raceId } = props;

    let lng = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);
    const [selectedOption, setSelectedOption] = React.useState<string>('option1');
    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

    const { loading: competitionLoading, competitionInfo } = useSelector((state: RootState) => state.competitions);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    const [joinCompetition, { data, isError, isLoading }] = useJoinCompetitionMutation();

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    };

    const onJoinTheRace = async () => {
        try {
            await joinCompetition({ id: raceId }).unwrap();
            toast.success(t('joinedSuccessfully'), { position: "bottom-left" });
            setShowModal(false);
        } catch (error: any) {
            if (error.data) {
                toast.error(t('failedToJoin'), { position: "bottom-left" });
            } else if (error.error) {
                toast.error(t('failedToJoin'), { position: "bottom-left" });
            } else {
                toast.error(t('failedToJoin'), { position: "bottom-left" });
            }
            setShowModal(false);
        }
    }


    return (
        <div>
            <div className="space-y-7 border rounded-xl p-5">
                {/* Prize */}
                <div className="space-y-2 mb-auto">
                    <div className="flex space-x-3 mb-2">
                        <div className="h-[30px] w-[2px] bg-primaryLight" />
                        <span className="text-xl font-medium">{t('prize')}</span>
                    </div>
                    <div className="inline-flex items-center gap-3 border border-[#29B78140] bg-[#F3F9F5] py-2 px-3 rounded-lg">
                        <CoinsGreenIcon />
                        <p className="font-bold text-customBlue-900">{competitionInfo?.awardAmount} {competitionInfo?.currencySymbol}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 border border-[#29B78140] bg-[#F3F9F5] py-2 px-3 rounded-lg">
                        <GreenCertificate />
                        <p className="text-customBlue-900">{t('awardMedals')}</p>
                    </div>
                </div>

                {/* Tags */}
                {
                    !!competitionInfo?.tags?.length &&
                    <div className="space-y-2">
                        <div className="flex space-x-3 mb-5">
                            <div className="h-[30px] w-[2px] bg-primaryLight" />
                            <span className="text-xl font-medium">{t('tags')}</span>
                        </div>
                        <div className="space-y-2">
                            {
                                competitionInfo?.tags?.map((tag, index) =>
                                    <div className="inline-block text-sm px-4 py-2 text-[1rem] rounded-lg space-x-2 mr-2 bg-gray-100">
                                        <span className="text-primaryLight">#</span>
                                        <span>{tag.name}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }

                {/* Join Button */
                    competitionInfo?.joinAvailable &&
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex w-full text-center justify-center items-center px-6 py-3 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                        aria-label="Join the Race"
                    >
                        {t('joinTheRace')}
                    </button>
                }

                {/* Join Button for not Authentificated Users */
                    !isAuthenticated &&
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="flex w-full text-center justify-center items-center px-6 py-3 text-white transition-all bg-gray-900 rounded-lg hover:bg-dark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                        aria-label="Join the Race"
                    >
                        {t('joinTheRace')}
                    </button>
                }

                {/* Upload Soulution Button */
                    competitionInfo?.uploadAvailable &&
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex w-full text-center justify-center items-center px-6 py-3 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                        aria-label="Join the Race"
                    >
                        {t('uploadTheSolution')}
                    </button>
                }
                {/* Submittion Notification for submitted users */
                    isAuthenticated &&
                    !competitionInfo?.joinAvailable &&
                    !competitionInfo?.uploadAvailable &&
                    <div className="flex align-center justify-center space-x-3 pt-10">
                        <CheckFilledIcon className="w-10 h-10" />
                        <span className="text-sm text-gray-500">{t('submittedDescription')}</span>
                    </div>
                }
            </div>
            <Modal
                visible={showModal}
                content={<ModalContent onConfirm={onJoinTheRace} />}
                onClose={() => setShowModal(false)}
            />
            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSignUp={() => router.push(`/${lng}/sign-up`)}
                onConfirm={() => router.push(`/${lng}/sign-in`)}
            />
            <RacesSidebar
                visible={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
        </div>
    )
}


interface IModalContent {
    onConfirm: () => void,
}

const ModalContent: React.FC<IModalContent> = (props) => {
    let { onConfirm } = props;

    const t = useTranslations();

    return (
        <div className="flex flex-col max-w-[400px] items-center justify-center p-6 space-y-5 text-center">
            <RaceFlag />
            <h2 className="text-3xl mx-3">{t('joinTheRaceDescription')}</h2>
            <p>{t('readAcceptTerms')}</p>
            <button
                onClick={onConfirm}
                className="flex w-full text-center justify-center items-center px-6 py-3 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                aria-label="Join the Race"
            >
                {t('continue')}
            </button>
        </div>
    )
}