import { useNavigate } from "react-router-dom"
import { useState } from "react"
import styles from "./SideBar.module.less"

interface SideBarProps {
    menuItems: {
        label: string
        path: string
        icon: string
    }[],
    defaultSelectedKey: string
}

export const SideBar = ({ menuItems, defaultSelectedKey }: SideBarProps) => {

    const navigate = useNavigate()

    // 当前选中的菜单项
    const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey)


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
                    <div className={`${styles.menuItem} ${selectedKey === item.path ? styles.selected : ""}`} key={item.path} onClick={() => {
                        setSelectedKey(item.path)
                        navigate(item.path)
                    }}>
                        <img src={item.icon} alt={item.label} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}