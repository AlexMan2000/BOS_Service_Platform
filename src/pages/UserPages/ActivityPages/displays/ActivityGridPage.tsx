import { ActivityCardType } from "@/commons/types/activity"
import { ActivityCard } from "../cards/ActivityCard"
import styles from "./ActivityGridPage.module.less"
import { useState, useEffect } from "react"
import { getAllActivities } from "@/services/activityApi"

export const ActivityGridPage = () => {


    const [activityCard, setActivityCard] = useState<ActivityCardType[]>([])

    const ACTIVITY_CARDS: ActivityCardType[] = [
        {
            name: "活动1",
            description: "活动1描述，这个活动旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/200/300",
            status: "进行中",
            startTime: new Date("2021-01-01 11:00:00"),
            endTime: new Date("2021-01-01 12:00:00"),
        },
        {
            name: "活动2",
            description: "活动2描述, 这个活动旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/300/400",
            status: "进行中",
            startTime: new Date("2021-01-01 08:00:00"),
            endTime: new Date("2021-01-01 12:00:00"),
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllActivities();
            setActivityCard(data as ActivityCardType[])
        }
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            {ACTIVITY_CARDS.map((card) => (
                <ActivityCard key={card.name} {...card} />
            ))}
        </div>
    )
}
