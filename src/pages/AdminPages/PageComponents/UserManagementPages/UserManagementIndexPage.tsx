import { Outlet } from "react-router-dom"
import styles from "./UserManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { BreadcrumbConfig } from "@/commons/types/configs"


export const UserManagementIndexPage = () => {

    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/admin",
            crumb: "管理员" 
        },

        {
            pathname: "/admin/user-management",
            crumb: "用户管理"
        },
        {
            pathname: "/admin/user-management/user-detail",
            crumb: "用户详情"
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
