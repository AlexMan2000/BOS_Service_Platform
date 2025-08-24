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
            pathname: "/home/activity",
            crumb: "活动"
        },
        {
            pathname: "/home/activity/project",
            crumb: "项目"
        },
        {
            pathname: "/home/activity/project/detail",
            crumb: "项目详情"
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