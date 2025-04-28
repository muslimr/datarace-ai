import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@utils/axiosBaseQuery';
import { IMessageResponse } from './types/competition-types';
import { DownloadResultResponse, IBlogFileUploadRequest, IDatasetFileUploadRequest, IDownloadResultRequest, IGetDatasetRequest, IGetDatasetResponse, IGetResultRequest, IGetResultResponse, IProfileImageUploadRequest, IProfileImageUploadResponse, IResultSaveRequest, ISubmitResultRequest } from './types/upload-types';


export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: axiosBaseQuery,
    endpoints: (builder) => ({
        getResult: builder.query<IGetResultResponse, IGetResultRequest>({
            query: ({ competitionId, userId }) => ({
                url: `/files/result/${competitionId}/${userId}`,
                method: 'GET',
            }),
        }),
        getDataset: builder.query<IGetDatasetResponse, IGetDatasetRequest>({
            query: ({ competitionId }) => ({
                url: `/files/data/${competitionId}`,
                method: 'GET',
            }),
        }),
        downloadResult: builder.query<DownloadResultResponse, IDownloadResultRequest>({
            query: ({ resultFieldId }) => ({
                url: `/files/download/result/${resultFieldId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/zip' },
                // responseHandler: (response: any) => response.blob(),
            }),
        }),
        downloadData: builder.query<DownloadResultResponse, IDownloadResultRequest>({
            query: ({ dataFieldId }) => ({
                url: `/files/download/data/${dataFieldId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/zip' },
                // responseHandler: (response: any) => response.blob(),
            }),
        }),
        submitResult: builder.query<IMessageResponse, ISubmitResultRequest>({
            query: ({ competitionId }) => ({
                url: `/files/submit/${competitionId}`,
                method: 'GET',
            }),
        }),
        uploadAvatar: builder.mutation<IProfileImageUploadResponse, IProfileImageUploadRequest>({
            query: ({ file }) => ({
                url: '/files/upload/profile-image',
                method: 'POST',
                data: file,
            }),
        }),
        uploadDatasetImage: builder.mutation<IProfileImageUploadResponse, IProfileImageUploadRequest>({
            query: ({ file }) => ({
                url: '/files/upload/dataset-image',
                method: 'POST',
                data: file,
            }),
        }),
        uploadDatasetUpdateImage: builder.mutation<IProfileImageUploadResponse, IProfileImageUploadRequest>({
            query: ({ file }) => ({
                url: '/files/upload/dataset-update-image',
                method: 'POST',
                data: file,
            }),
        }),
        uploadDatasetFile: builder.mutation<IProfileImageUploadResponse, IDatasetFileUploadRequest>({
            query: ({ datasetId, file }) => ({
                url: `/files/upload/dataset/${datasetId}`,
                method: 'POST',
                data: file,
            }),
        }),
        uploadBlogImage: builder.mutation<IProfileImageUploadResponse, IProfileImageUploadRequest>({
            query: ({ file }) => ({
                url: '/files/upload/blog-image',
                method: 'POST',
                data: file,
            }),
        }),
    }),
});

export const {
    useUploadAvatarMutation,
    useGetResultQuery,
    useLazyDownloadResultQuery,
    useLazyDownloadDataQuery,
    useLazySubmitResultQuery,
    useLazyGetDatasetQuery,
    useUploadDatasetImageMutation,
    useUploadDatasetUpdateImageMutation,
    useUploadDatasetFileMutation,
    useUploadBlogImageMutation,
} = uploadApi;
