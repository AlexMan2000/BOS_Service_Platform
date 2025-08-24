import { Outlet, useNavigate } from "react-router-dom"
import styles from "./UserProfileIndexPage.module.less"
import { Tabs } from "antd"
import { useState } from "react"


export const UserProfileIndexPage = () => {
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("details")

    const items = [
        {
            label: "个人中心",
            key: "details",
        },
        {
            label: "权益",
            key: "rights",  
        },
        {
            label: "交易记录",
            key: "transactions",
        }
    ]

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {items.map((item) => (
                    <div key={item.key} className={`${styles.tabItem} ${activeTab === item.key ? styles.active : ""}`} onClick={() => 
                    {
                        setActiveTab(item.key)
                        navigate(`/home/profile/${item.key}`)
                    }}>
                        <div className={styles.tabItemLabel}>{item.label}</div>
                    </div>
                ))}
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}
