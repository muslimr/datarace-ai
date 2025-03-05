"use client"

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";


const CountdownTimer: React.FC<{ date: string }> = ({ date }) => {
    const targetDate = new Date(`${date}T00:00:00`).getTime();

    const now = new Date().getTime();
    const difference = targetDate - now;

    let t = useTranslations();

    const calculateTimeLeft = () => {

        if (difference <= 0) {
            // setTimerVisibility(false)
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


    if (difference < 0) return (
        <div className="flex gap-2 p-5 rounded-xl">
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-red/50 px-3 py-2 rounded-md">
                    <span className="text-sm text-white">{t('challengeHasEnded')}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex gap-2 p-5 rounded-xl">
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-white/70 px-3 py-2 rounded-md">
                    <span className="text-lg font-bold">{timeLeft.days}</span>
                </div>
                <span className="text-xs text-white">Days</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-white/70 py-2 min-w-10 rounded-md">
                    <span className="text-lg font-bold">{timeLeft.hours}</span>
                </div>
                <span className="text-xs text-white">Hours</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-white/70 py-2 min-w-10 rounded-md">
                    <span className="text-lg font-bold">{timeLeft.minutes}</span>
                </div>
                <span className="text-xs text-white">Min.</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex flex-col items-center backdrop-blur-xl bg-white/70 py-2 min-w-10 rounded-md">
                    <span className="text-lg font-bold">{timeLeft.seconds}</span>
                </div>
                <span className="text-xs text-white">Sec.</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
