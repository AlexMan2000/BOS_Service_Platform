

export interface Activity {
    id: number
    name: string
    accountId: number
    balance: string
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
    startTime: Date
    endTime: Date
}


export interface ActivityTableType extends Activity {
    id: number
    name: string
    freeCredit: string
    cover: string
    description: string
    link: string
    startTime: string
    endTime: string
    status: number
}

export interface ActivitySubmitType extends Activity {
    id: number,
    name: string,
    freeCredit: string,
    cover: string,
    description: string,
    link: string,
    startTime: string,
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
    activityId: string,
    description: string,
    cover: string,
    link: string
}

export interface ProjectTableType {
    title: string,
    amount: number,
    authors: string,
    activityId: string,
    description: string,
    cover: string,
    link: string,
    createdTime: string,
    updatedTime: string
}