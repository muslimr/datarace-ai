"use client";

import React, { useState } from 'react';
import { ProfileSectionSkeleton, ShareModal } from '@components/shared';
import Image from 'next/image';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import getImgFromBase64 from '@utils/base64toImg';
import { useUploadAvatarMutation } from '@api/upload-api';
import { useLazyGetUserByIdQuery, useUpdateUserMutation } from '@api/user-api';
import { useLocale, useTranslations } from 'next-intl';
import { LogoFullWhite } from '@assets/icons';
import { useParams } from 'next/navigation';
import withProtectedRoute from '@utils/withProtectedRoute';



const UserProfile: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();

    const { userId } = useParams();

    const [shareModal, setShareModal] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isClient, setIsClient] = React.useState<boolean>(false);
    const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.user);

    const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();
    const [updateUser, { isLoading: updateLoading, isError: updateError, data }] = useUpdateUserMutation();


    const [triggerGetUser, { data: userData, isLoading: userDataLoading }] = useLazyGetUserByIdQuery();


    const userImage = React.useMemo(
        () => (user?.profileImage ? getImgFromBase64(user.profileImage) : '/svg/user.svg'),
        [user?.profileImage]
    );


    React.useEffect(() => {
        try {
            triggerGetUser({ id: userId as string });
        } catch (err: any) {
            console.log('Error: ', err)
        }
    }, [userId])

    React.useEffect(() => {
        setIsClient(true);
    }, []);


    if (!isClient) return null;

    if (loading || !isAuthenticated) {
        return <ProfileSectionSkeleton />;
    }

    return (
        <div className="min-h-screen flex flex-col p-5">
            <main className="flex-grow py-20">
                <section className="container flex flex-col mx-auto rounded-3xl lg:flex-row lg:space-y-0 overflow-hidden shadow-md border-t border-t-primaryExtra">
                    <div className="flex items-center justify-center min-w-[30%] py-6">
                        <div
                            className="relative w-[150px] h-[150px] min-w-[150px] min-h-[150px] rounded-full overflow-hidden border border-bg-gray-200"
                        >
                            <Image
                                src={userData?.profileImageUrl || '/svg/user.svg'}
                                alt="Avatar"
                                fill={true}
                                className="object-cover"
                                priority={true}
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3 space-y-3 md:flex-row justify-center md:space-y-0">
                            <div className="w-full flex flex-col items-center md:justify-end">
                                <p className="text-[1.7rem] font-medium">{userData?.fullName}</p>
                                {/* <p className="text-md text-gray-500">{userData?.email}</p> */}
                                {
                                    !!userData?.nickname &&
                                    <p className="text-md text-primary">@{userData?.nickname}</p>
                                }
                            </div>
                        </div>
                        {/* <button
                            aria-label="Share Blog"
                            className="inline-flex w-auto text-center items-center px-7 py-2 mt-3 text-white transition-all bg-primary rounded-lg sm:w-auto hover:bg-primaryDark hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none animate-button"
                            onClick={() => setShareModal(true)}
                        >
                            Share
                        </button> */}
                    </div>

                    <div className="flex w-full relative">
                        <Image
                            src={"/svg/dr_banner.svg"}
                            alt="Datarace Banner Image"
                            height={200}
                            width={800}
                            className="w-full h-[23rem] object-cover"
                        />
                        <div className='absolute flex flex-col items-end justify-end gap-7 px-20 py-[4rem] top-0 w-full h-full'>
                            <LogoFullWhite />
                            <p className='text-md text-white font-light max-w-[80%] text-end'>{t('description')}</p>
                        </div>
                    </div>
                </section>

                {/* Show error message if invalid file */}
                {errorMessage && (
                    <div className="text-red-500 text-center mt-4">
                        {errorMessage}
                    </div>
                )}

                <section className="container mx-auto py-10 space-y-5">
                    {/* <TabSelects tabs={TABS} /> */}
                </section>

                <ShareModal
                    title={userData?.fullName || ''}
                    shareUrl={`https://datarace.ai/${lng}/profile/${userId}`}
                    visible={shareModal}
                    onClose={() => setShareModal(false)}
                />
            </main>
        </div>
    );
};

export default withProtectedRoute(UserProfile);
