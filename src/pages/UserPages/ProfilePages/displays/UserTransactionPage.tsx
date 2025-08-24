import { TransactionTableType } from "@/commons/types/txn"
import styles from "./UserTransactionPage.module.less"
import { Table, Space, Button, Tag } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"

export const UserTransactionPage = () => {
    const DEFAULT_DATA_DISPLAY: TransactionTableType[] = [
        {
            sourceAccountId: "1",
            sourceAccountType: "PERSONAL",
            targetAccountId: "2",
            targetAccountType: "PERSONAL",
            sourceName: "张三",
            targetName: "李四",
            amount: "100",
            txType: "TRANSFER",
            reason: "转账",
            startTime: "2021-01-01 12:00:00",
            endTime: "2021-01-01 12:00:00"
        },
        {
            sourceAccountId: "1",
            sourceAccountType: "PERSONAL",
            targetAccountId: "2",
            targetAccountType: "PERSONAL",
            sourceName: "张三",
            targetName: "李四",
            amount: "100",
            txType: "TRANSFER",
            reason: "转账",
            startTime: "2021-01-01 12:00:00",
            endTime: "2021-01-01 12:00:00"
        },
        {
            sourceAccountId: "1",
            sourceAccountType: "PERSONAL",
            targetAccountId: "2",
            targetAccountType: "PERSONAL",
            sourceName: "张三",
            targetName: "李四",
            amount: "100",
            txType: "TRANSFER",
            reason: "转账",
            startTime: "2021-01-01 12:00:00",
            endTime: "2021-01-01 12:00:00"
        }
    ]

    return (
        <div className={styles.container}>
            <Table<TransactionTableType> dataSource={DEFAULT_DATA_DISPLAY} className={styles.table}>
                <Column title="Source Account" dataIndex="sourceAccountId" key="sourceAccountId" />
                <Column title="Target Account" dataIndex="targetAccountId" key="targetAccountId" />
                <Column title="Source Name" dataIndex="sourceName" key="sourceName" />
                <Column title="Target Name" dataIndex="targetName" key="targetName" />
                <Column title="Amount" dataIndex="amount" key="amount" />
                <Column title="Tx Type" dataIndex="txType" key="txType" />
                <Column title="Reason" dataIndex="reason" key="reason" />
                <Column title="Start Time" dataIndex="startTime" key="startTime"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />
                <Column title="End Time" dataIndex="endTime" key="endTime"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />

            </Table>
        </div>
    )
}