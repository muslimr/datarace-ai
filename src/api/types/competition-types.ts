export interface IMessageResponse {
    error?: string,
    success?: string,
    message?: string,
    data?: {
        success?: string,
        error?: string,
        message?: string,
    }
}

export interface ICompetitionsRequest {
    categoryId: number;
    data: { page: number, count: number },
}

export interface IAttendedCompetitionsRequest {
    data: { page: number, count: number, userHasSubmitted?: boolean },
}

export interface IScoreboardRequest {
    data: { page: number, count: number, competitionId?: string | number },
}

export interface IAttendedCompetition {
    competitionId: number,
    competitionName: string,
    text: string,
    awardAmount: number,
    currencySymbol: string,
    lifeTimeDays: number,
    fullName: string,
    nickname: string,
    phoneNumber: string | number,
    resultFileId: string,
    imageUrl?: string,
    userId: string | number,
}

export interface IScoreboard extends IAttendedCompetition {
    profileImageUrl?: string,
    score?: number,
    rank?: number,
}

export interface IAttendedCompetitionsResponse {
    userCompetitions: IAttendedCompetition[],
    hasNext: boolean,
    lastPageNumber: number,
    totalElements: number,
}

export interface IScoreboardResponse {
    userCompetitions: IScoreboard[],
    hasNext: boolean,
    lastPageNumber: number,
    totalElements: number,
}

export interface ICompetitionInfoRequest {
    id: string | number,
    lang?: string,
}

export interface ICompetition {
    id: number,
    name: string,
    text: string,
    rules?: string,
    awardAmount: number,
    imageUrl: string | null,
    lifeTimeDays: number,
    joinAvailable: boolean,
    uploadAvailable: boolean,
    expirationDate: string,
    currencySymbol: string,
    resultFileId: number,
    resultFileName: string,
    isEditable?: boolean,
    tags?: { id?: number, name: string }[],
}

export interface ICompetitionsResponse {
    competitions: ICompetition[],
    hasNextPage: boolean,
    totalCount: number,
}


export interface ICompetitionComment {
    id: number,
    text: string,
    userId: number,
    datasetId: number,
    isEditable?: true,
    competitionChildCommentDtos: ICompetitionComment[],
    fullName: string,
    nickname: string,
    userImageUrl: string,
    createdAt: number,
}

export interface ICompetitionCreateCommentRequest {
    id: string | number | undefined,
    data: {
        repliedComment?: {
            commentId: string | number | undefined,
        },
        text: string,
    }
}

export interface ICompetitionCreateCommentResponse { }


export interface IGetCompetitionCommentsRequest {
    id: string | number | undefined,
    page: number,
    count: number,
}

export interface IGetCompetitionCommentsResponse {
    comments: ICompetitionComment[],
    hasNext: boolean,
    lastPageNumber: number,
    totalElements: number,
}

export interface IDeleteCompetitionFileRequest {
    fileId: string | number | undefined,
}

export interface IDeleteCompetitionCommentRequest {
    lang: string,
    commentId: string | number | undefined,
}

export interface ICompetitionUpdateCommentRequest {
    commentId: string | number | undefined,
    data: {
        text: string,
    }
}

export interface IDeleteCompetitionCommentResponse {
    message: string,
}