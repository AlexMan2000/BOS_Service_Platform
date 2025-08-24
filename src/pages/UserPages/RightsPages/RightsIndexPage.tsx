import { BreadcrumbConfig } from "@/commons/types/configs"
import styles from "./RightsIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"


export const RightsIndexPage = () => {
    const BREADCRUMBS_CONFIGS: BreadcrumbConfig[] = [
        {
            pathname: "/home",
            crumb: "首页"
        },
        {
            pathname: "/home/rights",
            crumb: "权益"
        },
    ]
    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <BreadCrumb items={BREADCRUMBS_CONFIGS} />
            </div>
            <div className={styles.content}>

            </div>
        </div>
    )
}