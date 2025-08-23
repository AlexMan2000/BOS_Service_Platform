import { User } from "@/commons/types/user"
import styles from "./UserManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"

export const UserManagementIndexPage = () => {


    const breadcrumbsConfigs = [
        {
            pathname: "/admin",
            crumb: "管理员"
        },
        
        {
            pathname: "/admin/user-management",
            crumb: "用户管理"
        },
        {
            pathname: "/admin/user-management/user-detail",
            crumb: "用户列表"
        },
    ]


    const users: User[] = [
        {
            employeeNo: "1234567890",
            name: "张三",
            department: "技术部",
            balance: "1000",
            lastLogin: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin"
        },
        {
            employeeNo: "1234567890",
            name: "张三",
            department: "技术部",
            balance: "1000",
            lastLogin: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin"
        },
    ]


    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <BreadCrumb items={breadcrumbsConfigs} />
            </div>
            <div className={styles.content}>
                <h1>User Management</h1>
            </div>
        </div>
    )
}
