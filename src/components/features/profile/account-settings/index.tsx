"use client"

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDeleteUserMutation, useLogoutUserMutation, useUpdateUserMutation } from '@api/user-api';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@slices/user-slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { ConfirmationModal, FormInput } from '@components/shared';
import { useLocale, useTranslations } from 'next-intl';
import { TrashIcon } from '@assets/icons';



interface IFormInput {
    fullName: string,
    email: string,
    nickname: string,
    phoneNumber: string,
    profileFileId?: number | string,
}


export const AccountSettings: React.FC = () => {
    const t = useTranslations();
    const lng = useLocale();
    const dispatch = useDispatch();
    const router = useRouter();
    const [logoutModal, setLogoutModal] = React.useState<boolean>(false);
    const [deleteModal, setDeleteModal] = React.useState<boolean>(false);


    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .matches(/^[a-zA-Z_ ]+$/, t('fullNameOnlyLettersAndUnderscore')) // Only letters and "_"
            .min(5, t('fullNameMustBeBetween5And20Characters')) // Minimum 5 characters
            .max(20, t('fullNameMustBeBetween5And20Characters')) // Maximum 20 characters
            .required(t('fullNameIsRequired')),
        email: Yup.string()
            .email(t('invalidEmail'))
            .required(t('emailIsRequired')),
        nickname: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, t('usernameOnlyLettersAndNumbers')) // Only letters and numbers
            .min(5, t('usernameMustBeBetween5And15Characters')) // Minimum 5 characters
            .max(15, t('usernameMustBeBetween5And15Characters')) // Maximum 15 characters
            .required(t('usernameIsRequired')),
        phoneNumber: Yup.string()
            .matches(
                /^\+?[1-9]\d{1,14}$/,
                t('invalidPhoneNumber') // Translation key for invalid phone number message
            ) // International format, allows + and digits
            .required(t('phoneNumberIsRequired')),
    });

    const selectAuthData = createSelector(
        (state: RootState) => state.user.user,
        (state: RootState) => state.user.isAuthenticated,
        (state: RootState) => state.user.loading,
        (user, isAuthenticated, loading) => ({ user, isAuthenticated, loading })
    );

    const { user } = useSelector(selectAuthData);

    const [logoutUser] = useLogoutUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            await updateUser({
                id: user?.id || '',
                data: data,
                lang: lng,
            }).unwrap();
        } catch (err: any) {
            console.error('Unknown error:', err);
            toast.error(err.data?.message || 'An unexpected error occurred');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            router.push('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser({ id: user?.id || '' }).unwrap();
            router.push('/');
        } catch (error) {
            console.error('Account deletion failed', error);
        }
    };

    const onCancel = () => {
        if (user) {
            setValue('fullName', user.fullName || '');
            setValue('email', user.email || '');
            setValue('nickname', user.nickname || '');
            setValue('phoneNumber', user.phoneNumber || '');
        }
    }


    React.useEffect(() => {
        if (user) {
            // Set default values when user data is available
            setValue('profileFileId', user.profileFileId || 1);
            setValue('fullName', user.fullName || '');
            setValue('email', user.email || '');
            setValue('nickname', user.nickname || '');
            setValue('phoneNumber', user.phoneNumber || '');
        }
    }, [user, setValue]);


    return (
        <div>
            <div className="flex gap-5">
                <form className="space-y-4 w-full sm:w-80 min-w-[30%]" onSubmit={handleSubmit(onSubmit)}>
                    <FormInput
                        label={t('fullName')}
                        type='string'
                        name='fullName'
                        placeholder="Jon Doe"
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        label={t('userName')}
                        type='text'
                        name='nickname'
                        placeholder="@nickname"
                        register={register}
                        errors={errors}
                    />
                    <div className="space-y-2">
                        <FormInput
                            label={t('Email')}
                            type='email'
                            name='email'
                            placeholder="email@example.com"
                            register={register}
                            errors={errors}
                        />
                        <FormInput
                            label={t('phone')}
                            type='string'
                            name='phoneNumber'
                            placeholder="994xxxxxxxxx"
                            register={register}
                            errors={errors}
                        />
                    </div>

                    <div className="flex w-full space-x-3 py-4">
                        <button type="submit" className="flex w-full text-center justify-center px-4 py-2 text-white transition-all bg-primary rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                            {t('save')}
                        </button>
                        <button type="button" onClick={onCancel} className="flex w-full text-center justify-center px-4 py-2 text-primaryDark transition-all border border-primaryDark rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                            {t('cancel')}
                        </button>
                    </div>
                </form>

                <div className="w-full">
                    <div className="text-lg font-medium mb-2">{t('accountControl')}</div>
                    <div className="flex w-full bg-red rounded-xl pl-[3px]">
                        <div className="flex items-center justify-between w-full bg-[#F5F5F7] rounded-xl p-5">
                            <div className="flex items-center gap-5">
                                <TrashIcon />
                                <div>
                                    <span className="text-md font-medium">{t('deleteYourAccount')}</span>
                                    <p className="text-xs text-[#2C2C2C] mt-1">{t('deleteAccDescription')}</p>
                                </div>
                            </div>

                            <button type="button" onClick={() => setDeleteModal(true)} className="flex text-center justify-center px-4 py-2 text-red transition-all rounded-lg bg-red hover:bg-darkRed text-white shadow-neutral-300 dark:shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                                {t('delete')}
                            </button>
                        </div>
                    </div>

                    <button onClick={() => setLogoutModal(true)} className="flex w-full sm:w-40 mt-20 text-center justify-center px-4 py-2 text-gray-500 transition-all bg-gray-100 rounded-lg hover:bg-primaryDark hover:text-white shadow-neutral-300 hover:shadow-lg hover:shadow-neutral-300 hover:-tranneutral-y-px focus:shadow-none">
                        <span>{t('signOut')}</span>
                    </button>
                </div>
            </div>

            <ConfirmationModal
                visible={logoutModal}
                onConfirm={handleLogout}
                onClose={() => setLogoutModal(false)}
            />
            <ConfirmationModal
                visible={deleteModal}
                onConfirm={handleDeleteAccount}
                onClose={() => setDeleteModal(false)}
            />
        </div>
    );
};
