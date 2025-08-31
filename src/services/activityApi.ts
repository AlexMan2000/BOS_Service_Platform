import { ActivitySubmitType } from "@/commons/types/activity"
import { getRequest } from "./axiosInstance";


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
