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

function getFilename(disposition?: string | null, fallback = "template.xlsx") {
    if (!disposition) return fallback;
    // RFC 5987: filename*=UTF-8''<url-encoded>
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match) return decodeURIComponent(utf8Match[1]);
  
    // legacy: filename="<...>" or filename=<...>
    const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
    if (asciiMatch) return decodeURIComponent(asciiMatch[1]);
  
    return fallback;
  }
  


export const downloadTemplate = async (type: string,config?: any) => {
    try {
        const res = await getRequest(`${type}/get-import-template`, {
            responseType: 'blob',
            ...config
        });
        const contentDisposition = res.headers["content-disposition"];
        const filename = getFilename(contentDisposition, "批量导入用户模板.xls");

        const blob = new Blob([res.data], {
            // match your backend's contentType; either is fine for most browsers
            type: "application/vnd.ms-excel;charset=UTF-8",
        });
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
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