import { User } from "@/commons/types/user"
import styles from "./UserRightsPage.module.less"
import { Right, RightTableType } from "@/commons/types/right"
import { Table, Space, Button, Tag } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"

export const UserRightsPage = () => {


    const DEFAULT_DATA_DISPLAY: RightTableType[] = [
        {
            name: "星巴克咖啡抵用券100元",
            description: "星巴克咖啡抵用券100元",
            price: 100,
            image: "https://picsum.photos/200/300",
            total: 100,
            remain: 100,
            active: true,
            exp_date: "2021-01-01 12:00:00",
            status: "active"
        },
        {
            name: "免考",
            description: "免考一次",
            price: 100,
            image: "https://picsum.photos/200/300",
            total: 100,
            remain: 100,
            active: true,
            exp_date: "2021-01-01 12:00:00",
            status: "expired"
        },
        {
            name: "免考",
            description: "免考一次",
            price: 100,
            image: "https://picsum.photos/200/300",
            total: 100,
            remain: 100,
            active: true,
            exp_date: "2021-01-01 12:00:00",
            status: "inactive"
        }
    ]

    return (
        <div className={styles.container}>
            <Table<RightTableType> dataSource={DEFAULT_DATA_DISPLAY} className={styles.table}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Description" dataIndex="description" key="description" />
                <Column title="Price" dataIndex="price" key="price" />
                <Column title="Image" dataIndex="image" key="image" />
                <Column title="Total" dataIndex="total" key="total" />
                <Column title="Exp Date" dataIndex="exp_date" key="exp_date"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />
                <Column title="Status" dataIndex="status" key="status" render={(text: string) => {
                    return <Tag color={text === "active" ? "green" : text === "expired" ? "red" : "orange"}>{text}</Tag>
                }} />
                
            </Table>
        </div>
    )
}