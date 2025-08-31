import axios from "axios";
import { deleteRequest, postRequest } from "./axiosInstance";
import { AccountCreateVO, ListAllAccountVO } from "@/commons/types/account";
import ENDPOINT from "./config";

export const createAccount = async (body: AccountCreateVO, config?: any): Promise<Boolean> => {
    try {

        // url will be changed
        const res = await postRequest(
            "/account/create",
            body,
            {
                timeout: 2000,
                ...config
            }
        );

        return res.data; // boolean to show if successful or not

    } catch (error: any) {
        console.error("Error initializing model:", error);
        throw error;
    }
}

export const deleteAccount = async (id: string, config?: any) => {
    try {
        const res = await deleteRequest(
            "/account/delete/" + id,
            {
                timeout: 2000,
                ...config
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export const getAllAccounts = async (body: ListAllAccountVO, config?: any) => {
    try {
        const res = await postRequest("/account/listAll",
            body,
            {
                timeout: 5000,
                ...config
            });
        return res.data;
    } catch (error: any) {
        console.error("Error getting all accounts:", error);
        throw error;
    }
}