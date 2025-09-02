import { BetWorkVO, ProjectSubmitType, ProjectUpdateType } from "@/commons/types/activity";
import { deleteRequest, getRequest, postRequest, putRequest } from "./axiosInstance";

export const getAllWorks = async (body: any, config?:any) => {
    try {
        const res = await postRequest("/work/listAll", 
            body,
            {
                ...config
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error getting all works:", error);
        throw error;
    }
}

export const getWorkById = async (id: number, config?:any) => {
    try {
        const res = await getRequest(`/work/getById/${id}`, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting work by id:", error);
        throw error;
    }
}


export const createNewWork = async (body: ProjectSubmitType, config?:any) => {
    try {
        const res = await postRequest("/work/create", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error creating new work:", error);
        throw error;
    }
}

export const updateWork = async (body: ProjectUpdateType, config?:any) => {
    try {
        const res = await putRequest("/work/update", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error updating work:", error);
        throw error;
    }
}

export const deleteWork = async (id: number, config?:any) => {
    try {
        const res = await deleteRequest(`/work/delete/${id}`, {
            ...config
        });
        return res.data; 
    } catch (error: any) {
        console.error("Error deleting work:", error);
        throw error;
    }
}

export const betWork = async (body: BetWorkVO, config?:any) => {
    try {
        const res = await postRequest("/activityBet/bet", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error betting work:", error);
        throw error;
    }
}