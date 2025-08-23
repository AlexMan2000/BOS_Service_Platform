import styles from "./RightsManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"


export const RightsManagementIndexPage = () => {
    return (
        <div className={styles.container}>
            <BreadCrumb />
            <h1>Rights Management</h1>
        </div>
    )
}
