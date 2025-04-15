import React from 'react';
import { DropIcon, EducationIcon, EnvironmentIcon, RaceIcon, StarsIcon, TechIcon } from '@assets/icons';
import { setSelectedCategory } from '@slices/category-slice';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocale, useTranslations } from 'next-intl';
import { ICategory } from '@api/types/category-types';


interface IRaceSelectProps extends ICategory {
    id: number;
    titles: any,
    type?: string,
    selected?: boolean,
    onClick?: () => void,
}


const RaceSelect: React.FC<IRaceSelectProps> = (props) => {
    let { type, id } = props;

    const dispatch = useDispatch();
    const { selectedCategory } = useSelector((state: RootState) => state.categories);

    const selectCategory = (categoryId: number) => {
        dispatch(setSelectedCategory(categoryId));
    };

    switch (type) {
        case "All races": return (
            <RaceTypeSelect
                {...props}
                selected={id == selectedCategory}
                onClick={() => selectCategory(id)} />
        );
        case "Environment": return (
            <EnvironmentTypeSelect
                {...props}
                selected={id == selectedCategory}
                onClick={() => selectCategory(id)} />
        );
        case "Education": return (
            <EducationTypeSelect
                {...props}
                selected={id == selectedCategory}
                onClick={() => selectCategory(id)} />
        );
        case "Oil & Industry": return (
            <IndustryTypeSelect
                {...props}
                selected={id == selectedCategory}
                onClick={() => selectCategory(id)} />
        );
        case "Technology": return (
            <TechTypeSelect
                {...props}
                selected={id == selectedCategory}
                onClick={() => selectCategory(id)} />
        );
        default: return null
    }
};

export default RaceSelect



const RaceTypeSelect: React.FC<IRaceSelectProps> = ({ selected, titles, competitionsCount, onClick }) => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div onClick={onClick} className={`flex flex-col w-full min-w-[200px] ${selected ? 'bg-primaryLight' : 'bg-none'} h-md px-5 py-4 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:bg-primaryLight transition-all duration-300 ease-in-out transform group`}>
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out transform">
                <RaceIcon className={`w-[40px] text-current transition-colors duration-200 ease-in-out`} />
            </div>
            <div className="column">
                <p className={`text-md font-medium transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-none'}`}>
                    {titles[lng]}
                </p>
                {
                    !!competitionsCount &&
                    <p className={`text-sm transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-[#444355]'}`}>
                        {competitionsCount} {t('competitions3').toLowerCase()}
                    </p>
                }
            </div>
        </div>
    );
}

const EnvironmentTypeSelect: React.FC<IRaceSelectProps> = ({ selected, titles, competitionsCount, onClick }) => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div onClick={onClick} className={`flex flex-col w-full min-w-[200px] ${selected ? 'bg-primaryLight' : 'bg-none'} h-md px-5 py-4 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:bg-primaryLight transition-all duration-300 ease-in-out transform group`}>
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out transform">
                <EnvironmentIcon className={`w-[40px] text-current transition-colors duration-200 ease-in-out`} />
            </div>
            <div className="column">
                <p className={`text-md font-medium transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-none'}`}>
                    {titles[lng]}
                </p>
                {
                    !!competitionsCount &&
                    <p className={`text-sm transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-[#444355]'}`}>
                        {competitionsCount} {t('competitions3').toLowerCase()}
                    </p>
                }
            </div>
        </div>
    );
}

const EducationTypeSelect: React.FC<IRaceSelectProps> = ({ selected, titles, competitionsCount, onClick }) => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div onClick={onClick} className={`flex flex-col w-full min-w-[200px] ${selected ? 'bg-primaryLight' : 'bg-none'} h-md px-5 py-4 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:bg-primaryLight transition-all duration-300 ease-in-out transform group`}>
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out transform">
                <EducationIcon className={`w-[40px] text-current transition-colors duration-200 ease-in-out`} />
            </div>
            <div className="column">
                <p className={`text-md font-medium transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-none'}`}>
                    {titles[lng]}
                </p>
                {
                    !!competitionsCount &&
                    <p className={`text-sm transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-[#444355]'}`}>
                        {competitionsCount} {t('competitions3').toLowerCase()}
                    </p>
                }
            </div>
        </div>
    );
}

const IndustryTypeSelect: React.FC<IRaceSelectProps> = ({ selected, titles, competitionsCount, onClick }) => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div onClick={onClick} className={`flex flex-col w-full min-w-[200px] ${selected ? 'bg-primaryLight' : 'bg-none'} h-md px-5 py-4 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:bg-primaryLight transition-all duration-300 ease-in-out transform group`}>
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out transform">
                <DropIcon className={`w-[40px] text-current transition-colors duration-200 ease-in-out`} />
            </div>
            <div className="column">
                <p className={`text-md font-medium transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-none'}`}>
                    {titles[lng]}
                </p>
                {
                    !!competitionsCount &&
                    <p className={`text-sm transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-[#444355]'}`}>
                        {competitionsCount} {t('competitions3').toLowerCase()}
                    </p>
                }
            </div>
        </div>
    );
}

const TechTypeSelect: React.FC<IRaceSelectProps> = ({ selected, titles, competitionsCount, onClick }) => {
    const t = useTranslations();
    const lng = useLocale();

    return (
        <div onClick={onClick} className={`flex flex-col w-full min-w-[200px] ${selected ? 'bg-primaryLight' : 'bg-none'} h-md px-5 py-4 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:bg-primaryLight transition-all duration-300 ease-in-out transform group`}>
            <div className="flex-shrink-0 transition-all duration-300 ease-in-out transform">
                <TechIcon className={`w-[40px] text-current transition-colors duration-200 ease-in-out`} />
            </div>
            <div className="column">
                <p className={`text-md font-medium transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-none'}`}>
                    {titles[lng]}
                </p>
                {
                    !!competitionsCount &&
                    <p className={`text-sm transition-colors duration-200 ease-in-out group-hover:text-white ${selected ? 'text-white' : 'text-[#444355]'}`}>
                        {competitionsCount} {t('competitions3').toLowerCase()}
                    </p>
                }
            </div>
        </div>
    );
}
