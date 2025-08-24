

export interface Transaction {
    "sourceAccountId": string, //源账户id
    "sourceAccountType": "PERSONAL" | "ACTIVITY" | "BENEFIT", //源账户类型
    "targetAccountId": string, //目标账户id
    "targetAccountType": "PERSONAL" | "ACTIVITY" | "BENEFIT", //目标账户类型
    "sourceName": string, //源账户用户名
    "targetName": string, //目标账户用户名
    "amount": string, //金额
    "txType": "TRANSFER" | "GRANT" | "ACTIVITY_BET" | "BENEFIT_REDEEM", //交易类型
    "reason": string, //事由说明
    "startTime": string,  //交易发起时间
    "endTime": string  //交易完成时间
}


export interface TransactionTableType extends Transaction {
}