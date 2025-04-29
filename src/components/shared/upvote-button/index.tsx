import { useLikeDatasetMutation } from '@api/datasets-api';
import { UpvoteIcon } from '@assets/icons';
import { useTranslations } from 'next-intl';
import React from 'react';


interface IUpvoteButtonProps {
    id: number,
    count: number,
    isLiked: boolean | undefined,
}

export const UpvoteButton: React.FC<IUpvoteButtonProps> = ({ id, count, isLiked }) => {
    let t = useTranslations();

    const [likeDataset] = useLikeDatasetMutation();


    async function onLikeChange() {
        try {
            await likeDataset({ id: id }).unwrap();
        } catch (err: any) {
            console.log(err)
        }
    }


    return (
        <div className="flex border rounded-full overflow-hidden cursor-pointer select-none">
            <div className="flex items-center gap-2 px-2 py-1 bg-dark" onClick={onLikeChange}>
                <UpvoteIcon className="w-3 h-3" />
                {!!count && <div className="text-xs text-white">{count}</div>}
            </div>
            <div className={`text-sm pl-2 pr-3 py-1 hover:bg-primary hover:text-white ${isLiked ? 'text-white bg-primary' : ''}`} onClick={onLikeChange}>
                {isLiked ? t('upvoted') : t('upvote')}
            </div>
        </div>
    )
}