import { GetUserTransactionsVO, PersonalTransferVO } from "@/commons/types/txn";
import { getRequest, postRequest } from "./axiosInstance";


export const personalTransfer = async (body: PersonalTransferVO, config?:any) => {
    try {
        const res = await postRequest("/account/trans", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error personal transferring:", error);
        throw error;
    }
}

export const getUserTransactions = async (body: GetUserTransactionsVO, config?:any) => {
    try {
        const res = await getRequest(`/transaction/listAll/${body.accountId}`, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting user transactions:", error);
        throw error;
    }
}

export const getUserTransactionsByAdmin = async (config?:any) => {
    try {
        const res = await getRequest(`/transaction/listAll`, {
            ...config
        });
        return res.data;
    
    } catch (error: any) {
        console.error("Error getting user transactions by admin:", error);
        throw error;
    }
}