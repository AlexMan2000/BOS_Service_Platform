import { ActivitySubmitType } from "@/commons/types/activity"
import { deleteRequest, getRequest, postRequest, putRequest } from "./axiosInstance";
import axiosInstance from "./axiosInstance";


export const createActivity = async (body: ActivitySubmitType, config?:any) => {

    const res = await postRequest("/activity/create", body, {
        ...config
    });
    return res.data;
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


export const getActivityById = async (id: number, config?:any) => {
    try {
        const res = await getRequest(`/activity/selectById/${id}`, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting activity by id:", error);
        throw error;
    }
}


export const exportActivityFlowData = async (id: number, config?:any) => {
    try {
        // Use axiosInstance directly to ensure responseType is properly set
        const response = await axiosInstance.get(`/activity/export-excel/${id}`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            ...config
        });
        
        console.log('Export response:', response);
        console.log('Response data type:', typeof response.data);
        console.log('Response data size:', response.data?.size);
        console.log('Content type:', response.headers['content-type']);
        
        // Check if we got a valid blob
        if (!response.data || response.data.size === 0) {
            throw new Error('Empty file received from server');
        }
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `activity-${id}-export-${timestamp}.xlsx`;
        
        // Create download using URL.createObjectURL
        const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup after a short delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
        return { code: 200, message: '导出成功' };
    } catch (error: any) {
        console.error("Error exporting activity flow data:", error);
        console.error("Error details:", error.response?.data);
        throw error;
    }
}