import { BenefitCodeQryByNameVO, BenefitCodeQryVO, BenefitCreateVO, BenefitRedeemVO, CheckBenefitCodeVO, ListAllBenefitVO } from "@/commons/types/right";
import { deleteRequest, postRequest } from "./axiosInstance";

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


export const benefitRedeem = async (body: BenefitRedeemVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/getBenefitCodes", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error redeeming benefit:", error);
        throw error;
    }
}

export const getUserBenefitInfo = async (body: BenefitCodeQryVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/listByUser", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting user benefit info:", error);
        throw error;
    }
}

export const listAllBenefitCodes = async (body: BenefitCodeQryVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/listAll", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error listing all benefit codes:", error);
        throw error;
    }
}


export const listAllBenefitCodesAdmin = async (body: BenefitCodeQryVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/listAll", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error listing all benefit codes:", error);
        throw error;
    }
}


export const checkAllBenefitCodes = async (body: CheckBenefitCodeVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/check", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error checking all benefit codes:", error);
        throw error;
    }
}

export const listAllBenefitCodesAdminByUserName = async (body: BenefitCodeQryByNameVO, config?:any) => {
    try {
        const res = await postRequest("/benefitCode/queryByUserName", body, {
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error listing all benefit codes by user name:", error);
        throw error;
    }
}