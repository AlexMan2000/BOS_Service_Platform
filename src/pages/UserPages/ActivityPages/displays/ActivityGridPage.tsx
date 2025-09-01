import { ActivityCardType } from "@/commons/types/activity"
import { ActivityCard } from "../cards/ActivityCard"
import styles from "./ActivityGridPage.module.less"
import { useState, useEffect } from "react"
import { getAllActivities } from "@/services/activityApi"
import { ResponseCode } from "@/commons/defs/code"
import { message } from "antd"

export const ActivityGridPage = () => {


    const [activityCard, setActivityCard] = useState<ActivityCardType[]>([])



    useEffect(() => {
        const fetchData = async () => {
            const commonResult = await getAllActivities();
            if (commonResult.code === ResponseCode.SUCCESS) {
                setActivityCard(commonResult.data as ActivityCardType[])
            } else {
                message.error(commonResult.message)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            {activityCard.map((card) => (
                <ActivityCard key={card.name} {...card} />
            ))}
        </div>
    )
}
