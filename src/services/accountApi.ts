import { UserTransferSubmitType } from "@/commons/types/user";
import { deleteRequest, getRequest, postRequest } from "./axiosInstance";
import { AccountCreateVO, ListAllAccountVO } from "@/commons/types/account";

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

export const downloadTemplate = async (url: string, type: string) => {
    try {

        console.log(url, type)
        // // 定义模板文件映射
        const templateFileMap: { [key: string]: string } = {
            'account': 'user_batch_import_template.csv',
            'user': 'user_batch_import_template.csv',
            'activity': 'activity_batch_import_template.csv',
            'project': 'project_batch_import_template.csv',
            'right': 'right_batch_import_template.csv',
            'transfer': 'user_batch_transfer_template.csv',
            'transaction': 'user_batch_transfer_template.csv'
        };

        const templateFileName = templateFileMap[type] || 'user_batch_import_template.csv';
        // const templatePath = `/src/assets/templates/${templateFileName}`;

        // 使用 fetch 从本地获取文件
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.statusText}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        // 根据类型设置下载文件名
        const downloadFileName = templateFileName.replace('.csv', '_download.csv');

        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = downloadFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
    } catch (error: any) {
        console.error("Error downloading template:", error);
        throw error;
    }
}


export const uploadCSV = async (type: string, file: File, config?: any) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await postRequest(`${type}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 增加超时时间用于文件上传
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error uploading CSV:", error);
        throw error;
    }
}


export const getUserAccountInfo = async (userId: string, config?: any) => {
    try {
        const res = await postRequest(`/account/getByUserId/${userId}`,
             {
            },
            {
                timeout: 2000,
                ...config
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Error getting user account info:", error);
        throw error;
    }
}

export const batchTransfer = async (body: UserTransferSubmitType[], config?: any) => {
    try {
        const res = await postRequest(`/transaction/import-list`, body, {
            timeout: 2000,
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error batch transferring:", error);
        throw error;
    }
}

export const getUserBalance = async (userId: string, config?: any) => {
    try {
        const res = await getRequest(`/account/getBalance/${userId}`, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting user balance:", error);
        throw error;
    }
}