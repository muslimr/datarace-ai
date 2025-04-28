"use client"

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";


const CountdownTimer: React.FC<{ date: string }> = ({ date }) => {
    const targetDate = new Date(`${date}T00:00:00`).getTime();

    let t = useTranslations();

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / (1000)) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    if (
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
    ) return (
        <div className="flex gap-2 p-5 rounded-xl">
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-red/50 px-3 py-2 rounded-md">
                    <span className="text-sm text-white">{t('challengeHasEnded')}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex gap-2 rounded-xl">
            <div className="w-full flex flex-col items-center bg-[#EFEFF2] px-3 py-2 rounded-md">
                <span className="font-bold">{timeLeft.days}</span>
                <span className="text-xs">Days</span>
            </div>
            <div className="w-full flex flex-col items-center bg-[#EFEFF2] px-3 py-2 rounded-md">
                <span className="font-bold">{timeLeft.hours}</span>
                <span className="text-xs">Hours</span>
            </div>
            <div className="w-full flex flex-col items-center bg-[#EFEFF2] px-3 py-2 rounded-md">
                <span className="font-bold">{timeLeft.minutes}</span>
                <span className="text-xs">Min.</span>
            </div>
            <div className="w-full flex flex-col items-center bg-[#EFEFF2] px-3 py-2 rounded-md">
                <span className="font-bold">{timeLeft.seconds}</span>
                <span className="text-xs">Sec.</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
