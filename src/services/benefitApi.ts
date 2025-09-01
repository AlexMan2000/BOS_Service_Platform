import { BenefitCreateVO, ListAllBenefitVO, RightUpdateVO } from "@/commons/types/right";
import { deleteRequest, postRequest, putRequest } from "./axiosInstance";

export const getAllRights = async (body: ListAllBenefitVO, config?:any) => {
    try {
        const res = await postRequest( "/benefit/listAll", 
            body,
            {
                timeout: 5000,
                ...config
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error getting all accounts:", error);
        throw error;
    }
}


export const deleteBenefit = async (id: number, config?:any) => {
    try {
        const res = await deleteRequest("/benefit/delete/" + id, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error deleting right:", error);
        throw error;
    }
}

export const updateBenefit = async (body: BenefitCreateVO, config?:any) => {
    try {
        const res = await postRequest("/benefit/update", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error updating right:", error);
        throw error;
    }
}

export const createBenefit = async (body: BenefitCreateVO, config?:any) => {
    try {
        const res = await postRequest("/benefit/create", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error creating right:", error);
        throw error;
    }
}