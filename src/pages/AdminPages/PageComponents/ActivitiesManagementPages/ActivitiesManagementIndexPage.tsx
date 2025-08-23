import styles from "./ActivitiesManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"

export const ActivitiesManagementIndexPage = () => {
    return (
        <div className={styles.container}>
            <BreadCrumb />
            <h1>Activities Management</h1>
        </div>
    )
}