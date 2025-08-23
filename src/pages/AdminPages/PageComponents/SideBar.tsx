import styles from "./SideBar.module.less"
import { UsergroupAddOutlined, UserOutlined } from "@ant-design/icons"
import userManagementIcon from "@/assets/icons/userManagement.png"
import rightManagementIcon from "@/assets/icons/rightManagement.png"
import activityManagementIcon from "@/assets/icons/activityManagement.png"
import { useNavigate } from "react-router-dom"



export const SideBar = () => {

    const navigate = useNavigate()

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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    {/* <img src={logo} alt="logo" /> */}
                </div>
                <div className={styles.collapse}>
                    Coll
                </div>
            </div>
            <div className={styles.menuItems}>
                {menuItems.map((item) => (
                    <div className={styles.menuItem} key={item.path} onClick={() => navigate(item.path)}>
                        <img src={item.icon} alt={item.label} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}