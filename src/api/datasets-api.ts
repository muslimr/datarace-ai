import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@utils/axiosBaseQuery';
import { IDataset, IDatasetCreateCommentRequest, IDatasetCreateRequest, IDatasetInfoRequest, IDatasetsRequest, IDatasetsResponse, IDatasetUpdateCommentRequest, IDatasetUpdateRequest, IDeleteDatasetCommentRequest, IGetDatasetCommentsRequest, IGetDatasetCommentsResponse } from './types/dataset-types';
import { IMessageResponse } from './types/competition-types';


export const datasetsApi = createApi({
    reducerPath: 'datasetsApi',
    baseQuery: axiosBaseQuery,
    tagTypes: ['AllDatasets', 'MyDatasets', 'DatasetInfo', 'DatasetComments'],
    endpoints: (builder) => ({
        getAllDatasets: builder.query<IDatasetsResponse, IDatasetsRequest>({
            query: ({ data }) => ({
                url: `/datasets/public/page?isMyDataset=false`,
                method: 'GET',
                params: { page: data.page, count: data.count },
            }),
            providesTags: ['AllDatasets'],
        }),
        getMyDatasets: builder.query<IDatasetsResponse, IDatasetsRequest>({
            query: ({ data }) => ({
                url: `/datasets/public/page?isMyDataset=true`,
                method: 'GET',
                params: { page: data.page, count: data.count },
            }),
            providesTags: ['MyDatasets'],
        }),
        createDataset: builder.mutation<IMessageResponse, IDatasetCreateRequest>({
            query: (data) => ({
                url: `/datasets`,
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['AllDatasets', 'MyDatasets'],
        }),
        getDatasetInfo: builder.query<IDataset, IDatasetInfoRequest>({
            query: ({ id, lang }) => ({
                url: `/datasets/${id}`,
                method: 'GET',
                headers: { "Accept-language": lang || "en" }
            }),
            providesTags: ['DatasetInfo'],
        }),
        updateDataset: builder.mutation<IMessageResponse, IDatasetUpdateRequest>({
            query: (data) => ({
                url: `/datasets/${data.dataId}`,
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['DatasetInfo'],
        }),
        deleteDataset: builder.mutation<void, { id: number | string }>({
            query: ({ id }) => ({
                url: `/datasets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DatasetInfo'],
        }),
        createDatasetComment: builder.mutation<IMessageResponse, IDatasetCreateCommentRequest>({
            query: ({ id, data }) => ({
                url: `/datasets/${id}/comment`,
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['DatasetComments'],
        }),
        getDatasetComments: builder.query<IGetDatasetCommentsResponse, IGetDatasetCommentsRequest>({
            query: ({ id, page, count }) => ({
                url: `/datasets/${id}/comment`,
                method: 'GET',
                params: { page, count },
            }),
            providesTags: ['DatasetComments'],
        }),
        deleteDatasetFile: builder.mutation<void, { id: number | string }>({
            query: ({ id }) => ({
                url: `/files/dataset/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DatasetInfo'],
        }),
        deleteDatasetComment: builder.mutation<void, IDeleteDatasetCommentRequest>({
            query: ({ commentId }) => ({
                url: `/datasets/comment/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DatasetComments'],
        }),
        updateDatasetComment: builder.mutation<IMessageResponse, IDatasetUpdateCommentRequest>({
            query: ({ commentId, data }) => ({
                url: `/datasets/comment/${commentId}`,
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['DatasetComments'],
        }),
    }),
});

export const {
    useLazyGetAllDatasetsQuery,
    useLazyGetMyDatasetsQuery,
    useCreateDatasetMutation,
    useGetDatasetInfoQuery,
    useUpdateDatasetMutation,
    useDeleteDatasetMutation,
    useCreateDatasetCommentMutation,
    useLazyGetDatasetCommentsQuery,
    useDeleteDatasetCommentMutation,
    useUpdateDatasetCommentMutation,
    useDeleteDatasetFileMutation,
} = datasetsApi;
