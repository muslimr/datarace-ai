import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@utils/axiosBaseQuery';
import { ICompetition, ICompetitionInfoRequest, ICompetitionsRequest, ICompetitionsResponse, IMessageResponse } from './types/competition-types';


export const competitionApi = createApi({
    reducerPath: 'competitionApi',
    baseQuery: axiosBaseQuery,
    endpoints: (builder) => ({
        getCompetitions: builder.query<ICompetitionsResponse, ICompetitionsRequest>({
            query: ({ categoryId, data }) => ({
                url: `/competitions/${categoryId}/page`,
                method: 'GET',
                params: { page: data.page, count: data.count },
            }),
        }),
        getCompetitionInfo: builder.query<ICompetition, ICompetitionInfoRequest>({
            query: ({ id }) => ({
                url: `/competitions/${id}`,
                method: 'GET',
            }),
        }),
        joinCompetition: builder.mutation<IMessageResponse, ICompetitionInfoRequest>({
            query: ({ id }) => ({
                url: `/competitions/${id}/join`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetCompetitionInfoQuery,
    useLazyGetCompetitionsQuery,
    useJoinCompetitionMutation,
} = competitionApi;
