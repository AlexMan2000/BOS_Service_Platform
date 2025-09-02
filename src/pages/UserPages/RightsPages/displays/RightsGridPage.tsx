import { RightCardType } from "@/commons/types/right"
import styles from "./RightsGridPage.module.less"
import { RightCard } from "../cards/RightCard"
import { useEffect, useState } from "react"
import { getAllRights } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { message } from "antd"

export const RightsGridPage = () => {


    const [rightsCard, setRightsCard] = useState<RightCardType[]>([])



    useEffect(() => {
        const fetchData = async () => {
            const commonResult = await getAllRights({pageNum: 0, pageSize: 10});
            if (commonResult.code === ResponseCode.SUCCESS) {
                setRightsCard(commonResult.data as RightCardType[])
            } else {
                message.error(commonResult.message)
            }
        }
        fetchData()
    }, [])
    

    return (
        <div className={styles.container}>
            {rightsCard && rightsCard.length > 0 && rightsCard.map((card) => (
                <RightCard key={card.name} {...card} />
            ))}
        </div>
    )
}
