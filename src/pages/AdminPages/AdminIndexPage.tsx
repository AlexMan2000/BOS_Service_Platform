// 管理员登录进去之后的主页
import styles from "./IndexPage.module.less"
import { SideBar } from "./PageComponents/SideBar"
import { Outlet } from "react-router-dom"


export const AdminIndexPage = () => {

    return (
        <div className={styles.container}>  
        <div className={styles.sideBar}>
            <SideBar />
        </div>
        <div className={styles.mainContent}>
            <Outlet />
        </div>
         </div>
    )

}


