
export interface User {
    employeeNo: string // 工号
    password: string // 密码
    phone: string // 手机号
    role: string // 角色
    name: string; // 姓名
    department: string; // 部门
    balance: string; // 稳定余额
    deleted: boolean; // 是否删除
    lastLogin: string; // 上一次登录时间
    createdTime: string; // 注册时间
    createdBy: string; // 经办人 
    updatedTime: string; // 更新时间
}

