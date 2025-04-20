import React from 'react';
import Skeleton from '../skeleton';
import RaceItemSkeleton from '../race-item-skeleton';

const CompetitionsSkeleton: React.FC = () => {
    return (
        <>
            <div className="flex justify-between animate-pulse">
                <div className="space-y-3">
                    <Skeleton width="75%" height="32px" className="rounded-md" />
                    <Skeleton width="50%" height="16px" className="rounded-md" />
                </div>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                {Array.from({ length: 6 }).map((_, i) => <RaceItemSkeleton key={i} />)}
            </div>
            <div className="flex justify-center mt-5">
                <Skeleton width="150px" height="40px" className="rounded-xl" />
            </div>
        </>
    );
};

export default CompetitionsSkeleton;
