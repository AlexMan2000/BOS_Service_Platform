import { ListAllBenefitVO } from "@/commons/types/right";

import axios from "axios";
import ENDPOINT from "./config";

export const getAllRights = async (body: ListAllBenefitVO, config?:any) => {
    try {
        const res = await axios.get(ENDPOINT + "/account/listAll", {
            data: body,
            timeout: 5000,
            ...config
        });
        return res.data;
    } catch (error: any) {
        console.error("Error getting all accounts:", error);
        throw error;
    }
}