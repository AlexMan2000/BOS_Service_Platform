

export interface Activity {
    accountId: string
    balance: string
    cover: string
    description: string
    status: string
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
    name: string
    freeCredit: string
    cover: string
    description: string
    link: string
    startTime: string
    endTime: string
    status: string
}

export interface ActivitySubmitType {
    name: string,
    freeCredit: string,
    cover: string,
    description: string,
    link: string,
    startTime: string,
    endTime: string
}

export interface ActivityTransferSubmitType {
    accountId: string,
    balance: string,
}

export interface ActivityDetail {
    workList: Project[],
    freeCredit: number,
}


export interface Project {
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


export interface ProjectCardType {
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