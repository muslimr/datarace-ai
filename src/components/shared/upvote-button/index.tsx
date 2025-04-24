import { UpvoteIcon } from '@assets/icons';
import { useTranslations } from 'next-intl';
import React from 'react';


export const UpvoteButton = () => {
    let t = useTranslations();
    const [vote, setVote] = React.useState<number>(0);

    return (
        <div className="flex border rounded-full overflow-hidden cursor-pointer select-none">
            <div className="flex items-center gap-2 px-2 py-1 bg-dark" onClick={() => setVote(vote ? 0 : 1)}>
                <UpvoteIcon className="w-3 h-3" />
                {!!vote && <div className="text-xs text-white">{vote}</div>}
            </div>
            <div className="text-sm px-2 py-1 hover:bg-primary hover:text-white" onClick={() => setVote(vote ? 0 : 1)}>{vote ? t('upvoted') : t('upvote')}</div>
        </div>
    )
}