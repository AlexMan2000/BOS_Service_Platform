


export interface Right {
    name: string,
    description: string,
    price: number,
    image: string,
    total: number,
    remain: number,
    active: boolean,
    exp_date: string,
    deleted?: boolean,
    created_by?: string,
    created_time?: string,
    updated_time?: string
}

export interface RightCardType extends Right {
}


export interface RightTableType extends Right {
    status: "active" | "inactive" | "expired"
}


