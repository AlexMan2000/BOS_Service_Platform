import { BreadcrumbConfig } from "@/commons/types/configs"
import styles from "./ActivitiesManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { Outlet } from "react-router-dom"

export const ActivitiesManagementIndexPage = () => {
    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/admin",
            crumb: "管理员" 
        },

        {
            pathname: "/admin/activities-management",
            crumb: "活动管理"
        },
        {
            pathname: "/admin/activities-management/activity-detail",
            crumb: "活动详情"
        },
        {
            pathname: "/admin/activities-management/activity-detail/project-detail",
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