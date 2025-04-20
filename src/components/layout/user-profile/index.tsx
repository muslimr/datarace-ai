"use client";

import { useGetUserQuery, useLogoutUserMutation } from '@api/user-api';
import { ConfirmationModal, UserProfileSkeleton } from '@components/shared';
import Divider from '@components/shared/divider';
import { Dropdown } from '@components/shared/dropdown';
import { useAuthenticate } from '@hooks/use-auth';
import { logout } from '@slices/user-slice';
import { RootState } from '@store/store';
import getImgFromBase64 from '@utils/base64toImg';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const DROPDOWN_MENU: { route: string; label: string }[] = [
    { route: '/profile', label: 'profile' },
    { route: '/races', label: 'races' },
];

interface IUserProfileProps {
    // t?: (val: string) => string,
    // lng?: string,
}

export const UserProfile: React.FC<IUserProfileProps> = () => {
    const lng = useLocale();
    const t = useTranslations();
    const [logoutUser, { isLoading, isError, error }] = useLogoutUserMutation();
    const [askModal, setAskModal] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const loading = useAuthenticate();

    const { user, isAuthenticated, loading: isUserLoading } = useSelector((state: RootState) => state.user);

    const userImage = React.useMemo(
        () => (user?.profileImage ? getImgFromBase64(user.profileImage) : '/svg/user.svg'),
        [user?.profileImage]
    );


    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            router.push('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const DropdownContent = (
        <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu" className="w-40">
            {DROPDOWN_MENU.map((item, index) => (
                <Link
                    key={index}
                    href={`/${lng}${item.route}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-all duration-200 ease-in-out"
                    role="menuitem"
                >
                    {t(item.label)}
                </Link>
            ))}
            <Divider />
            <button
                disabled={isLoading}
                onClick={() => setAskModal(true)}
                className="flex w-full text-sm text-medium text-center justify-center px-5 py-2 text-gray-500 transition-all bg-gray-100 rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none"
            >
                {t('signOut')}
            </button>
        </div>
    );

    if (loading || isUserLoading) {
        return <UserProfileSkeleton />;
    }

    if (!isAuthenticated) {
        return (
            <div className="flex md:space-x-3">
                <Link href={`/${lng}/sign-in`}>
                    <button type="button" className="inline-flex w-auto text-sm md:text-md font-medium min-w-[80px] text-center items-center justify-center px-2 md:px-4 py-2 transition-all rounded-lg sm:w-auto hover:text-primary hover:underline focus:underline-none">
                        {t('signIn')}
                    </button>
                </Link>
                {/* <Link href={`/${lng}/sign-up`}>
                    <button type="button" className="inline-flex w-auto text-sm md:text-md text-center items-center px-3 md:px-4 py-2 text-white transition-all bg-gray-800 rounded-lg sm:w-auto hover:bg-dark hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                        {t('signUp')}
                    </button>
                </Link> */}
            </div>
        );
    }

    return (
        <Dropdown content={DropdownContent}>
            <div className="flex items-center cursor-pointer group select-none">
                <div className="hidden md:flex text-gray-600 font-regmed mr-3 group-hover:text-primary transition-all duration-200 ease-in-out">
                    {user?.fullName?.split(" ")[0]}
                </div>
                <div className="relative w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full overflow-hidden">
                    <Image
                        src={userImage}
                        alt="Avatar"
                        fill={true}
                        className="object-cover"
                        priority={true}
                    />
                </div>
            </div>

            <ConfirmationModal
                visible={askModal}
                onConfirm={handleLogout}
                onClose={() => setAskModal(false)}
            />
        </Dropdown>
    );
};
