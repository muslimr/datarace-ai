import { useGiveFeedbackMutation, useLazyGetDatasetFeedbacksQuery } from '@api/datasets-api';
import { AuthModal } from '@components/shared';
import { RootState } from '@store/store';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { useSelector } from 'react-redux';


interface IDatasetFeedbacksListProps {
    datasetId: number
}

export const DatasetFeedbacks: React.FC<IDatasetFeedbacksListProps> = (props) => {
    let { datasetId } = props;

    let lng = useLocale();

    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

    const [showAuthModal, setShowAuthModal] = React.useState<boolean>(false)

    const [triggerFeedbacks, { data: feedbacksList }] = useLazyGetDatasetFeedbacksQuery();
    const [giveFeedback] = useGiveFeedbackMutation();


    async function getFeedbacksList() {
        try {
            await triggerFeedbacks({ id: datasetId || null, lang: lng }).unwrap();
        } catch (err: any) {
            console.log(err)
        }
    }

    async function onChangeFeedback(answerId: number) {
        try {
            await giveFeedback({ id: datasetId || null, datasetFeedbackAnswersId: answerId }).unwrap();
        } catch (err: any) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        if (datasetId) {
            getFeedbacksList()
        }
    }, [datasetId])


    return (
        <div>
            <div className="flex flex-col gap-5">
                {
                    feedbacksList?.map((feedback, i) =>
                        <div key={i} className="flex flex-col gap-3">
                            <label className="text-lg font-medium">{feedback?.question}</label>
                            <div className="flex flex-wrap gap-3">
                                {
                                    feedback?.answers.map(answer =>
                                        <div
                                            key={answer.id}
                                            className={`flex items-center text-sm px-3 py-2 text-[1rem] rounded-2xl gap-1 border border-gray-500 cursor-pointer hover:bg-gray-200 ${answer.likedByCurrentUser ? 'bg-primary border-primary text-white' : ''}`}
                                            onClick={() => isAuthenticated ? onChangeFeedback(answer.id) : setShowAuthModal(true)}
                                        >
                                            {!!answer.likeCount && <div className="text-sm">{answer.likeCount}</div>}
                                            <div className="text-primaryLight">#</div>
                                            <p className="truncate-text-1">{answer.answer}</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>

            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </div>
    )
}