import { TransactionTableType } from "@/commons/types/txn"
import styles from "./UserTransactionPage.module.less"
import { Table, Tag, message } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { getUserTransactions } from "@/services/txnApi"
import { ResponseCode } from "@/commons/defs/code"  
import { useState, useEffect } from "react"

export const UserTransactionPage = () => {


    const { userId, accountId } = useSelector(selectUser)

    const [transactionDataSource, setTransactionDataSource] = useState<TransactionTableType[]>([])

    console.log("userId", userId, "accountId", accountId)
    const fetchData = async () => {
        const commonResult = await getUserTransactions({ accountId: accountId })
        if (commonResult.code === ResponseCode.SUCCESS) {
            setTransactionDataSource(commonResult.data as TransactionTableType[])
        } else {
            message.error(commonResult.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
            <Table<TransactionTableType> dataSource={transactionDataSource} className={styles.table}>
               
                <Column title="Source Name" dataIndex="sourceName" key="sourceName" render={()=>"您"} />
                <Column title="目标名称" dataIndex="targetName" key="targetName" />
                <Column title="Amount" dataIndex="amount" key="amount" />
                <Column title="交易类型" dataIndex="txType" key="txType" 
                render={(text: string) => {
                    return <Tag color={text === "TRANSFER" ? "blue" : text === "GRANT" ? "green" : text === "ACTIVITY_BET" ? "red" : text === "BENEFIT_REDEEM" ? "purple" : "gray"}>{text === "TRANSFER" ? "转账" : text === "GRANT" ? "发放" : text === "ACTIVITY_BET" ? "活动投注" : text === "BENEFIT_REDEEM" ? "权益核销" : "--"}</Tag>
                }}
                />
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