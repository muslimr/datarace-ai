import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Metadata } from 'next';
import { DropIcon, EducationIcon, EnvironmentIcon, RaceIcon, StarsIcon } from '@assets/icons';

export const metadata: Metadata = {
    title: "Races | DataRace.ai",
    description: "DataRace is an innovative platform designed to bring data scientists and AI enthusiasts together to compete in data-driven challenges.",
};

// Dynamic imports for better performance
const TeamBrainStorm = dynamic(() => import('@assets/icons/team-brainstorm.svg').then(mod => mod.default));
const TeamBrainstorming = dynamic(() => import('@assets/icons/team-brainstorming.svg').then(mod => mod.default));
const HumanRight = dynamic(() => import('@assets/icons/human-right.svg').then(mod => mod.default));
const RaceSelect = dynamic(() => import('@components/shared/race-select').then(mod => mod.default), { ssr: false });
const RaceItem = dynamic(() => import('@components/shared/race-item').then(mod => mod.default), { ssr: false });

interface IRaceType {
    title: string;
    description: string;
    icon: React.ElementType;
    type: string;
}

interface IRaceItemType {
    title: string;
    description: string;
    img: string;
    price: string;
    expiry_date: string | number;
}

const RACE_SELECTS: IRaceType[] = [
    {
        title: 'All races',
        description: '180 races',
        icon: RaceIcon,
        type: "race",
    },
    {
        title: 'Environment',
        description: '180 races',
        icon: EnvironmentIcon,
        type: "environment",
    },
    {
        title: 'Education',
        description: '6 races',
        icon: EducationIcon,
        type: "education",
    },
    {
        title: 'Oil & Industry',
        description: '6 races',
        icon: DropIcon,
        type: "industry",
    },
    {
        title: 'Technology',
        description: '6 races',
        icon: DropIcon,
        type: "tech",
    },
];

const RACE_ITEMS: IRaceItemType[] = [
    {
        title: 'Euismod lacus eu leo arcu leo ultrices morbi nisl.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic1.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
    {
        title: 'Auctor ut luctus euismod euismod quam ut sapien.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic2.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
    {
        title: 'Euismod lacus eu leo arcu leo ultrices morbi nisl.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic3.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
    {
        title: 'Auctor ut luctus euismod euismod quam ut sapien.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic2.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
    {
        title: 'Euismod lacus eu leo arcu leo ultrices morbi nisl.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic1.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
    {
        title: 'Auctor ut luctus euismod euismod quam ut sapien.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        img: '/png/pic2.png',
        price: '6000₼',
        expiry_date: 'Ends in 2 days',
    },
];

const Races: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
            <main id="main-content" className="flex-grow bg-gray-50 px-5 py-20 md:px-0 md:py-[7rem] space-y-20">
                <section className="container mx-auto w-full space-y-10">
                    <div className="flex justify-between">
                        <div className="space-y-3">
                            <h2 className="text-[32px] md:text-[2.3rem]">Choose your <span className="font-medium">Competitions</span></h2>
                            <p className="text-md text-gray-700">Get ready for an exciting race</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 overflow-x-auto hide-scrollbar">
                        {RACE_SELECTS.map((item, i) => (
                            <RaceSelect key={i} {...item} />
                        ))}
                    </div>
                </section>

                <section className="container mx-auto space-y-10">
                    <div className="flex justify-center text-center">
                        <div className="space-y-3">
                            <h2 className="text-[32px] md:text-[2.3rem]">Active <span className="font-medium">Competitions</span></h2>
                            <p className="text-md text-gray-700">Get ready for an exciting race</p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                        {RACE_ITEMS.map((item, i) => (
                            <RaceItem key={i} {...item} />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Link href="/races" className="inline-flex w-auto text-center font-medium items-center px-6 py-3 text-gray-900 transition-all dark:bg-white dark:text-gray-800 rounded-xl sm:w-auto hover:bg-primaryDark hover:text-white hover:shadow-lg hover:shadow-neutral-300 hover:-translate-y-px shadow-neutral-300 dark:shadow-neutral-700 focus:shadow-none">
                            All races
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Races;
