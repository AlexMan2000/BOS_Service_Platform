import { postRequest } from "./axiosInstance";
import { ChangePasswordRequest, LoginRequest } from "@/commons/types/account";
import { CommonResult } from "@/commons/types/response";



export const loginUser = async (body: LoginRequest, config?:any): Promise<CommonResult<any>> => {
    try {
        const res = await postRequest(
            "/user/login",
            body,
            {
                timeout: 2000,
                ...config
            }
        );

        return res.data; // CommonResult<User>， 这个data是Promise的data
    } catch (error: any) {
        throw error;
    }
}


export const changePassword = async (body: ChangePasswordRequest, config?:any): Promise<CommonResult<boolean>> => {
    try {
        const res = await postRequest(
            "/user/changePassword",
            body,
            {
                timeout: 2000,
                ...config
            }
        );
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

