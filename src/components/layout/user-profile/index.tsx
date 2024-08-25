import { UserProfileSkeleton } from '@components/shared';
import { useAuth } from 'hooks/use-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


interface IUserProfileProps {
    name: string,
    image: string,
}

export const UserProfile: React.FC<IUserProfileProps> = (props) => {
    let { name, image } = props;
    const { isLogged, isLoading } = useAuth();


    if (isLoading) return <UserProfileSkeleton />

    // shows Sign In button if user is not logged in
    if (!isLogged && !isLoading) return (
        <Link href="/sign-in">
            <button type="button" className="inline-flex w-auto text-center items-center px-5 py-2 text-white transition-all bg-gray-900 dark:bg-white dark:text-gray-800 rounded-lg shadow-md shadow-neutral-300 sm:w-auto hover:bg-blue-500 hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none focus:bg-blue-500">
                Sign In
            </button>
        </Link>
    );


    return (
        <div className="flex items-center cursor-pointer group select-none">
            <div className="font-regmed mr-3 group-hover:text-blue-400">{name}</div>
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden border border-bg-gray-200">
                <Image
                    src={image}
                    alt="Avatar"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}


