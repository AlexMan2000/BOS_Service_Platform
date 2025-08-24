import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { BreadcrumbConfig } from "@/commons/types/configs"
import styles from "./ActivityIndexPage.module.less"
import { ActivityCard } from "./cards/ActivityCard"
import { ActivityCard as ActivityCardType } from "@/commons/types/activity"


export const ActivityIndexPage = () => {

    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/home",
            crumb: "首页"
        },
        {
            pathname: "/home/activity",
            crumb: "活动"
        },
    ]


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
            <div className={styles.breadcrumbs}>
                <BreadCrumb items={BREADCRUMBS_CONFIGS} />
            </div>
            <div className={styles.content}>
                {ACTIVITY_CARDS.map((card, index) => (
                    <ActivityCard key={card.name + index} {...card} />
                ))}
            </div>
        </div>
    )
}