import { ActivityCard as ActivityCardType } from "@/commons/types/activity"
import { ActivityCard } from "../cards/ActivityCard"
import styles from "./ActivityGridPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { BreadcrumbConfig } from "@/commons/types/configs"

export const ActivityGridPage = () => {


    const ACTIVITY_CARDS: ActivityCardType[] = [
        {
            name: "活动1",
            description: "活动1描述，这个活动旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/200/300",
            status: "进行中",
            startTime: "2021-01-01 11:00:00",
            endTime: "2021-01-01 12:00:00",
        },
        {
            name: "活动2",
            description: "活动2描述, 这个活动旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/200/300",
            status: "进行中",
            startTime: "2021-01-01 08:00:00",
            endTime: "2021-01-01 12:00:00",
        },
    ]

    return (
        <div className={styles.container}>
            {ACTIVITY_CARDS.map((card) => (
                <ActivityCard key={card.name} {...card} />
            ))}
        </div>
    )
}
