/**
 * 错误码枚举定义
 * 与后端保持一致的错误码常量
 */

export enum ResponseCode {
    // 通用错误码
    SUCCESS = 0,
    FAILED = 10000,

    // 活动错误码
    ACTIVITY_NAME_EMPTY = 20001,
    ACTIVITY_NAME_DUPLICATED = 20002,
    ACTIVITY_NO_EXISTS = 20003,

    // 登录相关
    FIRST_LOGIN = 30001,
}

/**
 * 错误码对应的消息
 */
export const ResponseMessage: Record<ResponseCode, string> = {
    [ResponseCode.SUCCESS]: "操作成功！",
    [ResponseCode.FAILED]: "操作失败！",

    // 活动错误码
    [ResponseCode.ACTIVITY_NAME_EMPTY]: "活动名不能为空！",
    [ResponseCode.ACTIVITY_NAME_DUPLICATED]: "活动名不能重复！",
    [ResponseCode.ACTIVITY_NO_EXISTS]: "活动不存在！",

    // 登录相关
    [ResponseCode.FIRST_LOGIN]: "用户首次登录",
};

/**
 * 检查是否为成功响应
 * @param code 响应码
 * @returns 是否成功
 */
export const isSuccess = (code: number): boolean => {
    return code === ResponseCode.SUCCESS;
};

/**
 * 检查是否为失败响应
 * @param code 响应码
 * @returns 是否失败
 */
export const isError = (code: number): boolean => {
    return code !== ResponseCode.SUCCESS;
};

/**
 * 获取错误码对应的消息
 * @param code 响应码
 * @returns 对应的消息
 */
export const getResponseMessage = (code: number): string => {
    return ResponseMessage[code as ResponseCode] || "未知错误";
};

/**
 * 检查是否为特定的错误码
 * @param code 响应码
 * @param targetCode 目标错误码
 * @returns 是否为指定错误码
 */
export const isSpecificError = (code: number, targetCode: ResponseCode): boolean => {
    return code === targetCode;
};

/**
 * 检查是否为活动相关错误
 * @param code 响应码
 * @returns 是否为活动相关错误
 */
export const isActivityError = (code: number): boolean => {
    return code >= 20001 && code <= 20999;
};

/**
 * 检查是否为登录相关错误
 * @param code 响应码
 * @returns 是否为登录相关错误
 */
export const isLoginError = (code: number): boolean => {
    return code >= 30001 && code <= 30999;
};