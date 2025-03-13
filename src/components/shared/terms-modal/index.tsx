import React from 'react';
import { Modal } from '../modal';
import { useTranslations } from 'next-intl';
import Link from 'next/link';


interface IConfirmationModalProps {
    visible: boolean,
    hideButtons?: boolean,
    onClose: () => void,
    onConfirm: () => void,
}

export const TermsModal: React.FC<IConfirmationModalProps> = (props) => {
    let { visible, onConfirm, onClose } = props;

    return (
        <Modal
            visible={visible}
            content={
                <TermsModalContent {...props} />
            }
            onClose={onClose}
        />
    )
}

interface ITermsModalContent {
    hideButtons?: boolean,
    onConfirm: () => void,
    onClose: () => void,
}

const TermsModalContent: React.FC<ITermsModalContent> = (props) => {
    let { hideButtons, onConfirm, onClose } = props;

    const t = useTranslations();

    return (
        <div className="flex flex-col items-center space-y-5 text-center max-w-[600px] max-h-[800px] pt-5 pb-[100px] px-10 overflow-auto">
            <h2 className="w-full text-xl rounded-lg mx-3 py-3 top-0 font-medium absolute bg-white/20 backdrop-blur-xl">{t('termsTitle').toUpperCase()}</h2>
            <div className="w-full flex-column text-sm items-start text-start space-y-2 font-thin pt-10">
                <p className="font-medium -ml-4">
                    <strong>1. </strong>
                    {t('pr1')}
                </p>
                <p>
                    <strong className="font-medium">1.1. </strong>
                    {t('pr11')}
                </p>
                <p>
                    <strong className="font-medium">1.2. </strong>
                    {t('pr12')}
                </p>
                <p>
                    <strong className="font-medium">1.3. </strong>
                    {t('pr13')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">2. </strong>
                    {t('pr2')}
                </p>
                <p>
                    <strong className="font-medium">2.1. </strong>
                    {t('pr21')}
                </p>
                <p>
                    <strong className="font-medium">2.2. </strong>
                    {t('pr22')}
                </p>
                <p>
                    <strong className="font-medium">2.3. </strong>
                    {t('pr23')}
                </p>
                <p>
                    <strong className="font-medium">2.4. </strong>
                    {t('pr24')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">3. </strong>
                    {t('pr3')}
                </p>
                <p>
                    <strong className="font-medium">3.1. </strong>
                    {t('pr31')}
                </p>
                <p>
                    <strong className="font-medium">3.2. </strong>
                    {t('pr32')}
                </p>
                <p>
                    <strong className="font-medium">3.3. </strong>
                    {t('pr33')}
                </p>
                <p>
                    <strong className="font-medium">3.4. </strong>
                    {t('pr34')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">4. </strong>
                    {t('pr4')}
                </p>
                <p>
                    <strong className="font-medium">4.1. </strong>
                    {t('pr41')}
                </p>
                <p>
                    <strong className="font-medium">4.2. </strong>
                    {t('pr42')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">5. </strong>
                    {t('pr5')}
                </p>
                <p>
                    <strong className="font-medium">5.1. </strong>
                    {t('pr51')}
                </p>
                <p>
                    <strong className="font-medium">5.2. </strong>
                    {t('pr52')}
                </p>
                <p>
                    <strong className="font-medium">5.3. </strong>
                    {t('pr53')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">6. </strong>
                    {t('pr6')}
                </p>
                <p>
                    <strong className="font-medium">6.1. </strong>
                    {t('pr61')}
                </p>
                <p>
                    <strong className="font-medium">6.2. </strong>
                    {t('pr62')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">7. </strong>
                    {t('pr7')}
                </p>
                <p>
                    <strong className="font-medium">7.1. </strong>
                    {t('pr71')}
                </p>
                <p>
                    <strong className="font-medium">7.2. </strong>
                    {t('pr72')}
                </p>
                <p className="font-medium -ml-4">
                    <strong className="font-medium">8. </strong>
                    {t('pr8')}
                </p>
                <p>
                    <strong className="font-medium">8.1. </strong>
                    {t('pr81')}
                </p>
            </div>
            {
                hideButtons &&
                <div className="flex w-full space-x-3 absolute bg-white p-4 left-0 bottom-0 rounded-xl">
                    <button onClick={onClose} className="flex w-full text-center justify-center px-4 py-2 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                        {t('close')}
                    </button>
                </div>
            }
            {
                !hideButtons &&
                <div className="flex w-full space-x-3 absolute bg-white p-4 left-0 bottom-0 rounded-xl">
                    <button onClick={onConfirm} className="flex w-full text-center justify-center px-4 py-2 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                        {t('accept')}
                    </button>
                    <button onClick={onClose} className="flex w-full text-center justify-center px-4 py-2 text-primaryDark transition-all border border-primaryDark rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                        {t('cancel')}
                    </button>
                </div>
            }
        </div>
    )
}
