export interface IDataset {
    id: number | string,
    title: string,
    description: string,
    content: string,
    imageId?: number,
    imageUrl?: string | null,
    visibility?: string,
    status?: string,
    isEditable?: boolean,
    datasetFileDownloadDto?: IDatasetFilesDto[],
    tags: { name: string }[],
    userDto: {
        email: string,
        fullName: string,
        id: number,
        phoneNumber: string,
        username: string,
        userImageUrl?: string,
    }
}

export interface IDatasetFilesDto {
    id: number,
    fileName: string,
    fileType: string,
}

export interface IDatasetsRequest {
    data: { page: number, count: number },
    lang: string,
}

export interface IDatasetCreateRequest {
    title: string,
    description?: string,
    content: string,
    visibility?: string,
    usability?: number,
    status?: string,
    datasetImageId?: number | null,
    datasetProfileImageId?: number,
    tags?: { name: string }[],
}


export interface IDatasetsResponse {
    userDatasets: IDataset[],
    hasNextPage: boolean,
    lastPageNumber: boolean,
    totalElements: number,
}


export interface IDatasetInfoRequest {
    id: string | number,
    lang: string,
}


export interface IDatasetUpdateRequest {
    dataId: string,
    title: string,
    description?: string,
    content: string,
    visibility?: string,
    status?: string,
    usability?: number,
    datasetImageId?: number | null,
    datasetUpdateProfileImageId?: number | null,
    datasetFileDownloadDto: number[] | [],
    tags?: { name: string }[],
    lang: string,
}



export interface IDatasetComment {
    id: number,
    text: string,
    userId: number,
    datasetId: number,
    isEditable?: true,
    repliedCommentDto: IDatasetComment,
    datasetChildCommentDtos: IDatasetComment[],
    fullName: string,
    nickname: string,
    userImageUrl: string,
    createdAt: number,
}

export interface IDatasetCreateCommentRequest {
    id: string | number | undefined,
    data: {
        repliedComment?: {
            commentId: string | number | undefined,
        },
        text: string,
    }
}

export interface IDatasetCreateCommentResponse { }


export interface IGetDatasetCommentsRequest {
    id: string | number | undefined,
    page: number,
    count: number,
}


export interface IGetDatasetCommentsResponse {
    comments: IDatasetComment[],
    hasNext: boolean,
    lastPageNumber: number,
    totalElements: number,
}

export interface IDeleteDatasetCommentRequest {
    commentId: string | number | undefined,
}

export interface IDatasetUpdateCommentRequest {
    commentId: string | number | undefined,
    data: {
        text: string,
    }
}