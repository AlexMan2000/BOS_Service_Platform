import { postRequest } from "./axiosInstance";
import { LoginRequest } from "@/commons/types/account";
import { User } from "@/commons/types/user";



export const loginUser = async (body: LoginRequest, config?:any): Promise<User> => {
    try {
        const res = await postRequest(
            "/user/login",
            body,
            {
                timeout: 2000,
                ...config
            }
        );

        return res.data; // User object
    } catch (error: any) {
        throw error;
    }
}


