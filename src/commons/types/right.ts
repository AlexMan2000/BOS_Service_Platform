


export interface Right {
    id: number,
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


export interface RightUpdateVO {
    id: number; // update 时需传入 id；create 时可不传
    name: string;
    accountId: string;
    description: string;
    price: number;
    image: string;
    total: number;
    remain: number;
    active: boolean;
    expDate: string;

    userId: string;
}


export interface BenefitCreateVO {
    id: number; // update 时需传入 id；create 时可不传
    name: string;
    description: string;
    price: number; 
    image: string;
    total: number;
    remain: number;
    active: boolean;
    expDate: string | null;
    createdBy?: string;
}


export interface ListAllBenefitVO {
    pageNum: number,
    pageSize: number
}

export interface RightCardType extends Right {
}


export interface RightTableType extends Right {
    status: "active" | "inactive" | "expired"
}


