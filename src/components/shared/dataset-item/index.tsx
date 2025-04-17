"use client"

import { IDataset } from "@api/types/dataset-types";
import { PaperIcon } from "@assets/icons";
import { RootState } from "@store/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


interface DatasetProps extends IDataset {
    onClick?: (e: any) => void,
};


const DatasetItem: React.FC<DatasetProps> = (props) => {
    let lng = useLocale();
    let t = useTranslations();
    const router = useRouter();

    let { id, title, description, visibility, userDto, datasetFileDownloadDto, onClick } = props

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const imageUrl = props.imageUrl || "svg/noimg.svg";


    return (
        <div onClick={() => router.push(`/${lng}/datasets/${id}`)} className="h-md min-w-[330px] rounded-custom_md select-none cursor-pointer overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg group active:shadow-none bg-white p-7">
            <div className="relative overflow-hidden">
                {
                    !!datasetFileDownloadDto?.length &&
                    <div className="absolute z-10 flex justify-between items-center w-full bottom-2 -right-[90px]">
                        <div className={`flex items-center gap-1 px-2 py-1 bg-white flex-shrink-0 rounded-full border border-[#ACACAC47]`}>
                            <PaperIcon />
                            <p className={`text-sm rounded-md font-regmed`}>{`${datasetFileDownloadDto?.length} file`}</p>
                        </div>
                    </div>
                }
                <Image
                    src={imageUrl}
                    height="300"
                    width="300"
                    className="w-full transition-transform duration-300 ease-in-out transform max-w-[9rem] h-[9rem] rounded-full object-cover"
                    alt={title}
                    priority={true}
                />
            </div>
            <div className="flex flex-col pt-5 space-y-2 justify-between items-between">
                <div className="h-[110px]">
                    <h3 className="text-md font-semibold text-customBlue-900 truncate-text-2 pb-1 group-hover:text-primary">{title}</h3>
                    <p className="text-gray-500 truncate-text description-font truncate-text-3">
                        <div dangerouslySetInnerHTML={{ __html: description }}></div>
                    </p>
                </div>
                <div className="flex justify-between items-center pt-3">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.stopPropagation(); router.push(`/${lng}/profile/${userDto?.id}`) }}>
                        <div className="relative w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full overflow-hidden">
                            <Image
                                src={userDto?.userImageUrl || "/png/user.png"}
                                alt="Avatar"
                                fill={true}
                                className="object-cover"
                                priority={true}
                            />
                        </div>
                        <p className="text-sm text-gray-500 truncate-text">{t('by')} <strong className="font-medium group-hover:text-primary">{userDto?.fullName}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetItem;
