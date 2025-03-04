"use client"

import { IBlogItem } from "@api/types/blog-types";
import { IDataset } from "@api/types/dataset-types";
import { RootState } from "@store/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


interface BlogItemProps extends IBlogItem {
    // id: string | number,
    // image: string | null,
    // title: string,
    // date: string,
    // onClick?: (e: any) => void,
};


const BlogItem: React.FC<BlogItemProps> = (props) => {
    let lng = useLocale();
    let t = useTranslations();
    const router = useRouter();

    let { id, imageUrl, title, userDto } = props

    const imgUrl = imageUrl || "/svg/noimg.svg";


    return (
        <div onClick={() => router.push(`/${lng}/blog/${id}`)} className="h-md rounded-custom_md select-none cursor-pointer overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg group active:shadow-none bg-white">
            <div className="relative overflow-hidden">
                <Image
                    src={imgUrl}
                    height="300"
                    width="300"
                    className="w-full transition-transform duration-300 ease-in-out transform group-hover:scale-110 h-[12rem] object-cover"
                    alt={title}
                    priority={true}
                />
            </div>
            <div className="flex flex-col p-5 space-y-2 text-start justify-between">
                <div className="flex space-y-2 h-[70px]">
                    <h3 className="text-md font-semibold text-customBlue-900 truncate-text pb-1">{title}</h3>
                    {/* <p className="text-md text-gray-500 truncate-text description-font">{date}</p> */}
                </div>
                <div className="flex justify-between items-center">
                    <Link href={`/${lng}/blog/${id}`} className="inline-flex w-auto text-center font-regmed items-center bg-gray-100 px-6 py-3 text-gray-900 transition-all rounded-xl sm:w-auto hover:bg-primaryDark hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 focus:shadow-none">
                        {t('seeMore')}
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </Link>
                    <div className="flex items-center justify-end cursor-pointer group select-none" onClick={(e) => { e.stopPropagation(); router.push(`${lng}/profile/${userDto?.id}`) }}>
                        <div className="flex flex-col items-end text-gray-400 font-regmed mr-3 transition-all duration-200 ease-in-out">
                            <span className='text-xs'>{t('writtenBy')}</span>
                            <span className='ml-2 text-md text-gray-600 font-medium group-hover:text-primary'> {userDto?.fullName?.split(' ')[0]}</span>
                        </div>
                        <div className="relative w-[45px] h-[45px] min-w-[45px] min-h-[45px] rounded-full overflow-hidden">
                            <Image
                                src={userDto?.userImageUrl || '/svg/user.svg'}
                                alt="Avatar"
                                fill={true}
                                className="object-cover"
                                priority={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogItem;
