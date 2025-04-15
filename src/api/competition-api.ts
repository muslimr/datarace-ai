import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@utils/axiosBaseQuery';
import { IAttendedCompetitionsRequest, IAttendedCompetitionsResponse, ICompetition, ICompetitionCreateCommentRequest, ICompetitionInfoRequest, ICompetitionsRequest, ICompetitionsResponse, ICompetitionUpdateCommentRequest, IDeleteCompetitionCommentRequest, IDeleteCompetitionFileRequest, IGetCompetitionCommentsRequest, IGetCompetitionCommentsResponse, IMessageResponse, IScoreboardRequest, IScoreboardResponse } from './types/competition-types';
import { IResultSaveRequest } from './types/upload-types';


export const competitionApi = createApi({
    reducerPath: 'competitionApi',
    baseQuery: axiosBaseQuery,
    tagTypes: ['Competition', 'CompetitionComments'],
    endpoints: (builder) => ({
        getCompetitions: builder.query<ICompetitionsResponse, ICompetitionsRequest>({
            query: ({ categoryId, data, lang }) => ({
                url: `/competitions/${categoryId}/page`,
                method: 'GET',
                params: { page: data.page, count: data.count },
                headers: { "Accept-language": lang || "en" }
            }),
        }),
        getAttendedCompetitions: builder.query<IAttendedCompetitionsResponse, IAttendedCompetitionsRequest>({
            query: ({ data, lang }) => ({
                url: `/competitions/user/page`,
                method: 'GET',
                params: { page: data.page, count: data.count, userHasSubmitted: data.userHasSubmitted, criteria: {}, },
                headers: { "Accept-language": lang || "en" },
            }),
        }),
        getScoreBoard: builder.query<IScoreboardResponse, IScoreboardRequest>({
            query: ({ data, lang }) => ({
                url: `/competitions/score/page`,
                method: 'GET',
                params: { page: data.page, count: data.count, competitionId: data.competitionId },
                headers: { "Accept-language": lang || "en" },
            }),
        }),
        getCompetitionInfo: builder.query<ICompetition, ICompetitionInfoRequest>({
            query: ({ id, lang }) => ({
                url: `/competitions/${id}`,
                method: 'GET',
                headers: { "Accept-language": lang || "en" }
            }),
            providesTags: ['Competition'],
        }),
        joinCompetition: builder.mutation<IMessageResponse, ICompetitionInfoRequest>({
            query: ({ id }) => ({
                url: `/competitions/${id}/join`,
                method: 'POST',
            }),
            invalidatesTags: ['Competition'],
        }),
        createCompetitionComment: builder.mutation<IMessageResponse, ICompetitionCreateCommentRequest>({
            query: ({ id, data }) => ({
                url: `/competitions/${id}/comment`,
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['CompetitionComments'],
        }),
        getCompetitionComments: builder.query<IGetCompetitionCommentsResponse, IGetCompetitionCommentsRequest>({
            query: ({ id, page, count }) => ({
                url: `/competitions/${id}/comment`,
                method: 'GET',
                params: { page, count },
            }),
            providesTags: ['CompetitionComments'],
        }),
        deleteCompetitionFile: builder.mutation<void, IDeleteCompetitionFileRequest>({
            query: ({ fileId }) => ({
                url: `/files/delete/result/${fileId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Competition'],
        }),
        deleteCompetitionComment: builder.mutation<IMessageResponse, IDeleteCompetitionCommentRequest>({
            query: ({ commentId, lang }) => ({
                url: `/competitions/comment/${commentId}`,
                method: 'DELETE',
                headers: { "Accept-language": lang }
            }),
            invalidatesTags: ['CompetitionComments'],
        }),
        updateCompetitionComment: builder.mutation<IMessageResponse, ICompetitionUpdateCommentRequest>({
            query: ({ commentId, data }) => ({
                url: `/competitions/comment/${commentId}`,
                method: 'PUT',
                data: data,
            }),
            invalidatesTags: ['CompetitionComments'],
        }),
        saveResult: builder.mutation<IMessageResponse, IResultSaveRequest>({
            query: ({ competitionId, file }) => ({
                url: `/files/upload/result/${competitionId}`,
                method: 'POST',
                data: file,
            }),
            invalidatesTags: ['Competition'],
        }),
    }),
});

export const {
    useGetCompetitionInfoQuery,
    useLazyGetCompetitionsQuery,
    useJoinCompetitionMutation,
    useLazyGetAttendedCompetitionsQuery,
    useLazyGetScoreBoardQuery,
    useCreateCompetitionCommentMutation,
    useLazyGetCompetitionCommentsQuery,
    useDeleteCompetitionCommentMutation,
    useUpdateCompetitionCommentMutation,
    useDeleteCompetitionFileMutation,
    useSaveResultMutation,
} = competitionApi;
