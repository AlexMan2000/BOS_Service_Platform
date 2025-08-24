import styles from './LandingPage.module.less'
import { Outlet } from 'react-router-dom'
import { SideBar } from '@/commons/components/Layouts/SideBar'
import activityManagementIcon from "@/assets/icons/activityManagement.png"
import rightsManagementIcon from "@/assets/icons/rightManagement.png"
import { selectGlobalState } from '@/store/slice/globalSlice/globalSlice'
import { useSelector } from 'react-redux'


export const LandingPage = () => {


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

    const defaultSelectedKey = "/home/activities"

    const { isSideBarCollapsed } = useSelector(selectGlobalState)

    return (
        <div className={styles.container}>
            <div className={`${styles.sideBar} ${isSideBarCollapsed ? styles.collapsed : ""}`}>
                <SideBar menuItems={menuItems} defaultSelectedKey={defaultSelectedKey} />
            </div>
            <div className={`${styles.mainContent} ${isSideBarCollapsed ? styles.collapsed : ""}`}>
                <Outlet />
            </div>
        </div>
    )
}