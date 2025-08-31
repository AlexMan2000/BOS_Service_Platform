
export interface AccountCreateVO {
    employeeNo: string,
    name: string,
    department: string,
    createdBy: string
}

export interface LoginRequest {
    employeeNo: string,
    password: string
}

export interface ListAllAccountVO {
    pageNum: number,
    pageSize: number
}