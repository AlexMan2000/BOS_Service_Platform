import { PersonalTransferVO } from "@/commons/types/txn";
import { postRequest } from "./axiosInstance";


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