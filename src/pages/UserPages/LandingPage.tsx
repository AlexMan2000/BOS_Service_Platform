import styles from './LandingPage.module.less'
import { Outlet } from 'react-router-dom'
import { SideBar } from '@/commons/components/Layouts/SideBar'
import activityManagementIcon from "@/assets/icons/activityManagement.png"
import rightsManagementIcon from "@/assets/icons/rightManagement.png"


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