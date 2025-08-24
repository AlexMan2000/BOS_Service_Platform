import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { BreadcrumbConfig } from "@/commons/types/configs"
import styles from "./ActivityIndexPage.module.less"
import { Outlet } from "react-router-dom"


export const ActivityIndexPage = () => {

    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/home",
            crumb: "首页"
        },
        {
            pathname: "/home/activities",
            crumb: "活动列表"
        },
        {
            pathname: "/home/activities/projects",
            crumb: "活动详情"
        },
        {
            pathname: "/home/activities/projects/detail",
            crumb: "作品详情"
        },
    ]



    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <BreadCrumb items={BREADCRUMBS_CONFIGS} />
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}