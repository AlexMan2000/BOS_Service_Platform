


export interface Right {
    name: string,
    description: string,
    price: number,
    image: string,
    total: number,
    remain: number,
    active: boolean,
    expDate: string,
    deleted?: boolean,
    createdBy?: string,
    createdTime?: string,
    updatedTime?: string
}

export interface RightCardType extends Right {
}


export interface RightTableType extends Right {
    status: "active" | "inactive" | "expired"
}


