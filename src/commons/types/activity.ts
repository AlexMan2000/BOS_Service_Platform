

export interface Activity {
    id: number
    name: string
    accountId: number
    freeCredit: number
    cover: string
    description: string
    status: number
    createdTime: string
    updatedTime: string
    startTime: string
    endTime: string
}

export interface ActivityCardType {
    name: string
    description: string
    cover: string
    status: string
    startTime: string
    endTime: string
}


export interface ActivityTableType {
    id: number
    name: string
    accountId: number
    freeCredit: number
    description: string
    status: number
    startTime: string
    endTime: string
}

export interface ActivitySubmitType {
    id: number
    name: string
    accountId: number
    freeCredit: number
    description: string
    status: number
    startTime: string
    endTime: string
}

export interface ActivityTransferSubmitType {
    accountId: number,
    balance: string,
}

export interface ActivityDetail {
    workList: Project[],
    freeCredit: number,
}


export interface Project {
    id: number
    title: string
    amount: number
    authors: string
    activityId: string
    description: string
    cover: string
    link: string
    createdTime: string
    updatedTime: string
    deleted: boolean
}


export interface ProjectCardType {
    status: number,
    title: string
    amount: number
    authors: string
    activityId: string
    description: string
    cover: string
    link: string
    createdTime: string
    updatedTime: string
}


export interface ProjectSubmitType {
    title: string,
    authors: string,
    activityId: number,
    description: string,
    cover: string,
    link: string
}

export interface ProjectUpdateType {
    id: number,
    title: string,
    authors: string,
    activityId: number,
    description: string,
    cover: string,
    link: string
}

export interface ProjectTableType {
    id: number,
    title: string,
    amount: number,
    authors: string,
    activityId: number,
    description: string,
    cover: string,
    link: string,
    createdTime: string,
    updatedTime: string
}


export interface BetWorkVO {
    
}