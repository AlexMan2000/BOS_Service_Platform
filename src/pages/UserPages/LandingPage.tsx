import styles from './LandingPage.module.less'
import { Outlet } from 'react-router-dom'
import { SideBar } from '@/commons/components/Layouts/SideBar'
import activityManagementIcon from "@/assets/icons/activityManagement.png"
import rightsManagementIcon from "@/assets/icons/rightManagement.png"
import { selectGlobalState } from '@/store/slice/globalSlice/globalSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '@/store/slice/userSlice/userSlice'
import userManagementIcon from "@/assets/icons/userManagement.png"
import rightManagementIcon from "@/assets/icons/rightManagement.png"

export const LandingPage = () => {

    const { role} = useSelector(selectUser)
    const menuItems = [
        {
            label: "活动",
            path: "/home/activities",
            icon: activityManagementIcon
        },
        {
            label: "权益",
            path: "/home/rights",
            icon: rightsManagementIcon
        },
    ]


    const adminMenuItems = [
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

    const defaultSelectedKey = "/home/activities"

    const { isSideBarCollapsed } = useSelector(selectGlobalState)

    return (
        <div className={styles.container}>
            <div className={`${styles.sideBar} ${isSideBarCollapsed ? styles.collapsed : ""}`}>
                <SideBar menuItems={(role === "ADMIN" || role === "SUPER") ? adminMenuItems :menuItems} defaultSelectedKey={defaultSelectedKey} />
            </div>
            <div className={`${styles.mainContent} ${isSideBarCollapsed ? styles.collapsed : ""}`}>
                <Outlet />
            </div>
        </div>
    )
}