import { ActivitySubmitType } from "@/commons/types/activity"
import { deleteRequest, getRequest, putRequest } from "./axiosInstance";


export const createActivity = async (body: ActivitySubmitType, config?:any) => {


}


export const getAllActivities = async (params?, config?:any) => {
    try {
        const res = await getRequest("/activity/listAll", {
            params,
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting all activities:", error);
        throw error;
    }
}


export const deleteActivity = async (id: number, config?:any) => {
    try {
        const res = await deleteRequest("/activity/delete/" + id, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error deleting activity:", error);
        throw error;
    }
}


export const updateActivity = async (body: ActivitySubmitType, config?:any) => {
    try {
        const res = await putRequest("/activity/update", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error updating activity:", error);
        throw error;
    }
}