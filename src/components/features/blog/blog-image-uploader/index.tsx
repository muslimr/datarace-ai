"use client"

import { useUploadBlogImageMutation } from '@api/upload-api';
import { useTranslations } from 'next-intl';
// import { useUploadBlogImageMutation, useUploadFileMutation } from '@api/upload-api';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';




interface ImageUploaderProps {
    blogId?: string,
    image?: string,
    setImageId: (val: number | string | null) => void,
}

const BlogImageUploader: React.FC<ImageUploaderProps> = ({ blogId, image, setImageId }) => {
    const t = useTranslations();

    const [uploadedImage, setUploadedImage] = React.useState<File | null>(null);
    const [initialImage, setInitialImage] = React.useState<string>('');

    const [uploadBlogImage] = useUploadBlogImageMutation();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) {
            return;
        }

        setUploadedImage(uploadedFile);

        try {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            let response = await uploadBlogImage({ file: formData }).unwrap();
            setImageId(response?.id)
        } catch (error) {
            console.log(error)
        }
    };

    const onDeleteImage = () => {
        setInitialImage('');
        setImageId(null);
        setUploadedImage(null);
    }

    React.useEffect(() => {
        if (image) setInitialImage(image);
    }, [image])


    return (
        <div>
            {
                (uploadedImage || initialImage) ?
                    <>
                        <div
                            id="FileUpload"
                            className="relative w-full h-[500px] flex items-center justify-center content-center cursor-pointer appearance-none rounded-2xl border-2 border-dashed border-gray-300 dark:bg-meta-4 overflow-hidden"
                        >
                            {
                                !!uploadedImage
                                    ?
                                    <img
                                        src={URL.createObjectURL(uploadedImage)} // Create a URL for the uploaded image
                                        alt="Uploaded Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    :
                                    <img
                                        src={initialImage} // Create a URL for the uploaded image
                                        alt="Uploaded Preview"
                                        className="w-full h-full object-cover"
                                    />
                            }
                            <button
                                onClick={onDeleteImage}
                                className="absolute z-2330 w-auto text-center items-center px-6 py-2.5 text-white transition-all bg-gray-700 rounded-xl sm:w-auto hover:bg-dark shadow-neutral-300 focus:shadow-none animate-button"
                            >
                                {t('deleteImage')}
                            </button>
                        </div>
                        {
                            uploadedImage &&
                            <p className="text-gray-400 text-sm">{t('uploadedImage')}: {uploadedImage.name}</p>
                        }
                    </>

                    :
                    <div
                        id="FileUpload"
                        className="relative w-full h-[500px] inline-block items-center content-center cursor-pointer appearance-none rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 p-[4rem] sm:py-7.5"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                            onChange={handleImageChange}
                        />
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 font-light">
                            <p className="text-md">{t('clickToUploadImage')}</p>
                            <p className='text-xl text-gray-300 my-5'>{t('or')}</p>
                            <p className="text-md">{t('dragAndDrop')}</p>
                        </div>
                    </div>
            }
        </div>
    );
};

export default BlogImageUploader;
