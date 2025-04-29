import { UpvoteIcon } from '@assets/icons';
import { useTranslations } from 'next-intl';
import React from 'react';


interface IFeedBackProps {
    label: string,
}

export const FeedbackButton: React.FC<IFeedBackProps> = (props) => {
    let { label } = props;

    let t = useTranslations();
    const [vote, setVote] = React.useState<number>(0);

    return (
        <div className="flex items-center text-sm px-3 py-2 text-[1rem] rounded-2xl gap-1 border border-gray-500 cursor-pointer hover:bg-gray-200" onClick={() => setVote(vote ? 0 : 1)}>
            {!!vote && <div className="text-sm">{vote}</div>}
            <div className="text-primaryLight">#</div>
            <p className="truncate-text-1">{label}</p>
        </div>
    )
}