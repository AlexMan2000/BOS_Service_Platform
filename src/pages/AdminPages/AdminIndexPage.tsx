// 管理员登录进去之后的主页
import styles from "./AdminIndexPage.module.less"
import { SideBar } from "@/commons/components/Layouts/SideBar"
import { Outlet } from "react-router-dom"
import userManagementIcon from "@/assets/icons/userManagement.png"
import rightManagementIcon from "@/assets/icons/rightManagement.png"
import activityManagementIcon from "@/assets/icons/activityManagement.png"

export const AdminIndexPage = () => {
    const menuItems = [
        {
            label: "个人账户管理",
            path: "/admin/user-management",
            icon: userManagementIcon
        },
        {
            label: "权益账户管理",
            path: "/admin/rights-management",
            icon: rightManagementIcon
        },
        {
            label: "活动账户管理",
            path: "/admin/activities-management",
            icon: activityManagementIcon
        },
    ]

    const defaultSelectedKey = "/admin/user-management"
    return (
        <div className={styles.container}>
            <div className={styles.sideBar}>
                <SideBar menuItems={menuItems} defaultSelectedKey={defaultSelectedKey} />
            </div>
            <div className={styles.mainContent}>
                <Outlet />
            </div>
        </div>
    )

}


