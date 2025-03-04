import { ArrowGreenIcon, BookmarkIcon } from "@assets/icons";
import { RootState } from "@store/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

// Define the two types of props
interface IAttendedCompetition {
    competitionId: number,
    competitionName: string,
    text: string,
    awardAmount: number,
    currencySymbol: string,
    lifeTimeDays: number,
    fullName: string,
    nickname: string,
    phoneNumber: string | number,
    resultFileId: string,
    imageUrl?: string,
    t?: (val: string) => string,
    lng?: string,
    onClick?: (e: any) => void,
}

interface IRacesItemProps {
    id: number | string,
    name: string,
    text: string,
    imageUrl?: string | null,
    awardAmount: number | string,
    lifeTimeDays: number | string,
    currencySymbol: string,
    t?: (val: string) => string,
    lng?: string,
    onClick?: (e: any) => void,
}

type RaceProps = IAttendedCompetition | IRacesItemProps;


const isAttendedCompetition = (props: RaceProps): props is IAttendedCompetition => {
    return (props as IAttendedCompetition).competitionId !== undefined;
};

const RaceItem: React.FC<RaceProps> = (props) => {
    let { onClick } = props;
    let lng = useLocale();
    let t = useTranslations();

    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const id = isAttendedCompetition(props) ? props.competitionId : props.id;
    const name = isAttendedCompetition(props) ? props.competitionName : props.name;
    const text = props.text;
    const imageUrl = !!props?.imageUrl ? props.imageUrl : "/svg/noimg.svg";
    const lifeTimeDays = props.lifeTimeDays;
    const currencySymbol = props.currencySymbol;
    const awardAmount = props.awardAmount;

    let endedText = Math.abs(lifeTimeDays as number) > 1 ? `${t('ended')} ${Math.abs(lifeTimeDays as number)} ${t('daysAgo')}` : `${t('ends')} ${t('today').toLowerCase()}`;
    let lifeTimeText = (lifeTimeDays as number) > 0 ? `${t('endsIn')} ${lifeTimeDays} ${t('days')}` : endedText;


    return (
        <Link href={`/${lng}/races/${id}`} className="h-md rounded-custom_md select-none cursor-pointer overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg group active:shadow-none bg-white">
            <div className="relative overflow-hidden">
                <div className="absolute z-10 flex justify-between items-center w-full p-4">
                    {/* <div className="inline-flex px-4 py-2 bg-white bg-opacity-50 backdrop-blur-xl flex-shrink-0 rounded-full">
                        <p className="text-sm font-regmed">{lifeTimeText}</p>
                    </div> */}
                </div>
                <Image
                    src={imageUrl}
                    height="300"
                    width="300"
                    className="w-full transition-transform duration-300 ease-in-out transform group-hover:scale-110 h-[10rem] object-cover"
                    alt={name}
                    priority={true}
                />
            </div>
            <div className="flex flex-col p-5 space-y-3 text-start items-between">
                <div className="h-[70px]">
                    <h3 className="text-md font-semibold text-customBlue-900 truncate-text pb-1">{name}</h3>
                    <p className="text-gray-500 truncate-text description-font">
                        <div dangerouslySetInnerHTML={{ __html: text }}></div>
                    </p>
                </div>
                <div className="flex justify-between items-center pt-5">
                    <p className="text-lg font-medium text-customBlue-900">{currencySymbol} {awardAmount}</p>
                    {/* <div className="w-[4rem] h-[4rem] rounded-full border border-gray-300 flex items-center justify-center transition-transform duration-300 ease-in-out transform group-hover:scale-110 group-hover:border-primaryLight group-active:scale-100">
                        <ArrowGreenIcon />
                    </div> */}
                    <div className="inline-flex px-4 py-2 bg-primary  backdrop-blur-xl flex-shrink-0 rounded-full">
                        <p className="text-sm text-white font-regmed">{lifeTimeText}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RaceItem;
