import { Outlet } from "react-router-dom"
import styles from "./RightsManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { BreadcrumbConfig } from "@/commons/types/configs"


export const RightsManagementIndexPage = () => {

    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/admin",
            crumb: "管理员" 
        },

        {
            pathname: "/admin/rights-management",
            crumb: "权益管理"
        },
        {
            pathname: "/admin/rights-management/rights-detail",
            crumb: "权益详情"
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
