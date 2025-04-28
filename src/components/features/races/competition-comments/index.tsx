import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import getImgFromBase64 from '@utils/base64toImg';
import { useTranslations } from 'next-intl';
import { useCreateCompetitionCommentMutation, useLazyGetCompetitionCommentsQuery } from '@api/competition-api';
import { CompetitionComment } from '@components/shared/competition-comment';
import dynamic from 'next/dynamic';
import { EmojiClickData } from 'emoji-picker-react';
import { AuthModal } from '@components/shared';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface ICompetitionCommentsProps {
    competitionId: number | string | undefined,
    isEditable?: boolean,
}

export const CompetitionComments: React.FC<ICompetitionCommentsProps> = ({ competitionId, isEditable }) => {

    const [page, setPage] = React.useState(0);
    const [count, setCount] = React.useState(5)
    const [newComment, setNewComment] = React.useState<string>('');
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false);

    const [triggerGetComments, { data: commentsData, isLoading: commentsLoading }] = useLazyGetCompetitionCommentsQuery();
    const [createCompetitionComment, { isLoading, error }] = useCreateCompetitionCommentMutation();
    const { user, isAuthenticated, loading: isUserLoading } = useSelector((state: RootState) => state.user);
    const pickerRef = useRef<HTMLDivElement>(null);

    const t = useTranslations();

    const userImage = React.useMemo(
        () => (user?.profileImage ? getImgFromBase64(user.profileImage) : '/svg/user.svg'),
        [user?.profileImage]
    );

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewComment((prevComment) => `${prevComment}${emojiData.emoji}`);
    };

    const onCreateComment = async () => {
        try {
            if (newComment.trim() !== "") {
                await createCompetitionComment({
                    id: competitionId,
                    data: {
                        text: newComment
                    }
                }).unwrap();
                setNewComment('');
            }
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || 'An unexpected error occurred');
        }
    };


    React.useEffect(() => {
        if (competitionId) {
            triggerGetComments({
                id: competitionId,
                page: page,
                count: count,
            });
        }
    }, [competitionId, page, count])


    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsEmojiPickerVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <section className="relative space-y-2 py-2 border-gray-200">
            {
                (!!commentsData?.comments?.length || isAuthenticated) &&
                <h2 className="text-2xl font-semibold text-black dark:text-white">
                    {t('comments')}
                </h2>
            }
            <div className="flex flex-col py-3">
                <div className="w-full inline-flex flex-col">
                    {
                        commentsData?.comments?.map((comment) =>
                            <CompetitionComment key={comment.id} {...comment} />
                        )
                    }
                    {
                        !!commentsData?.comments?.length &&
                        commentsData?.comments?.length > 2 &&
                        <button
                            onClick={() => setCount(count > 3 ? 3 : 10)}
                            className='text-start text-gray-500 hover:text-primary hover:underline font-medium hover:text-primary min-w-[300px] py-2 ml-10 rounded-3xl mb-3'
                        >
                            {count > 3 ? 'Hide Comments' : 'View More Comments'}
                        </button>
                    }
                </div>

                <div className="flex w-full gap-2">
                    <div className="relative w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full overflow-hidden">
                        <Image
                            src={userImage || "/png/user.png"}
                            alt="Avatar"
                            fill={true}
                            className="object-cover"
                            priority={true}
                        />
                    </div>
                    <div className="flex w-full space-y-3 flex-col items-end">
                        <textarea
                            value={newComment}
                            placeholder={t('whatsOnYourMind')}
                            className={`w-full h-[100px] bg-gray-50 px-5 py-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primaryLight transition duration-200 ease-in-out transform resize-none`}
                            onChange={(e) => isAuthenticated ? setNewComment(e.target.value) : setShowAuthModal(true)}
                        />
                        <div className="flex gap-3">
                            <div className="h-[40px] w-[40px] flex items-center justify-center bg-gray-200 hover:bg-gray-300 focus:outline-none transition rounded-full">
                                <button
                                    onClick={() => isAuthenticated ? setIsEmojiPickerVisible((prev) => !prev) : setShowAuthModal(true)}
                                    className="text-2xl"
                                    aria-label="Open Emoji Picker"
                                >
                                    😊
                                </button>
                            </div>
                            <button
                                onClick={() => isAuthenticated ? onCreateComment() : setShowAuthModal(true)}
                                className="h-[40px] font-regmed bg-primary text-md text-white px-6 py-1 rounded-lg ring-2 ring-primary hover:bg-primaryDark hover:ring-primaryDark hover:shadow-lg hover:shadow-neutral-300 focus:outline-none focus:ring-2 focus:ring-primaryDark transition duration-200 ease-in-out transform"
                            >
                                {t('comment')}
                            </button>
                        </div>

                        {isEmojiPickerVisible && (
                            <div
                                ref={pickerRef}
                                className="absolute bottom-[-10px] right-0 translate-y-full z-50"
                            >
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                </div>

                <AuthModal
                    visible={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </div>
        </section>
    )
}