import { TransactionTableType } from "@/commons/types/txn"
import styles from "./UserTransactionPage.module.less"
import { Table, Tag, message } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { getUserTransactions, getUserTransactionsByAdmin } from "@/services/txnApi"
import { ResponseCode } from "@/commons/defs/code"  
import { useState, useEffect } from "react"

export const UserTransactionPage = () => {


    const { userId, accountId,role } = useSelector(selectUser)

    const [transactionDataSource, setTransactionDataSource] = useState<TransactionTableType[]>([])

    console.log("userId", userId, "accountId", accountId)
    const fetchData = async () => {

        let commonResult:any = null
        if(role === "ADMIN" || role ==="SUPER"){
            commonResult = await getUserTransactionsByAdmin()
        } else {
            commonResult = await getUserTransactions({ accountId: accountId })
        }
        if(commonResult == null){
            message.error("获取交易记录失败")
            return
        }
        if (commonResult.code === ResponseCode.SUCCESS) {
            setTransactionDataSource(commonResult.data as TransactionTableType[])
        } else {
            message.error(commonResult.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className={styles.container}>
            {role === "NORMAL" && <Table<TransactionTableType> dataSource={transactionDataSource} className={styles.table}>
               
                <Column title="交易对象" dataIndex="targetName" key="targetName" />
                <Column title="交易数额" dataIndex="amount" key="amount" />
                <Column title="交易类型" dataIndex="txType" key="txType" 
                render={(text: string) => {
                    return <Tag color={text === "TRANSFER" ? "blue" : text === "GRANT" ? "green" : text === "ACTIVITY_BET" ? "red" : text === "BENEFIT_REDEEM" ? "purple" : "gray"}>{text === "TRANSFER" ? "转账" : text === "GRANT" ? "发放" : text === "ACTIVITY_BET" ? "活动投注" : text === "BENEFIT_REDEEM" ? "权益核销" : "--"}</Tag>
                }}
                />
                <Column title="交易事由" dataIndex="reason" key="reason"
                    render={(text: string) => {
                        return <span>{text ? text : "--"}</span>
                    }}
                />
                <Column title="交易时间" dataIndex="startTime" key="startTime"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />

            </Table>}
            {(role === "ADMIN" || role ==="SUPER")&& <Table<TransactionTableType> dataSource={transactionDataSource} className={styles.table}>
                    
                <Column title="源账户ID" dataIndex="sourceAccountId" key="sourceAccountId" />
                <Column title="目标账户ID" dataIndex="targetAccountId" key="targetAccountId" />
                <Column title="源账户名称" dataIndex="sourceName" key="sourceName" />
                <Column title="目标账户名称" dataIndex="targetName" key="targetName" />
                <Column title="交易数额" dataIndex="amount" key="amount" />
                <Column title="交易类型" dataIndex="txType" key="txType" 
                render={(text: string) => {
                    return <Tag color={text === "TRANSFER" ? "blue" : text === "GRANT" ? "green" : text === "ACTIVITY_BET" ? "red" : text === "BENEFIT_REDEEM" ? "purple" : "gray"}>{text === "TRANSFER" ? "转账" : text === "GRANT" ? "发放" : text === "ACTIVITY_BET" ? "活动投注" : text === "BENEFIT_REDEEM" ? "权益核销" : "--"}</Tag>
                }}
                />
                <Column title="交易事由" dataIndex="reason" key="reason" />
                <Column title="交易开始时间" dataIndex="startTime" key="startTime"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />
                <Column title="交易结束时间" dataIndex="endTime" key="endTime"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />

            </Table>}
        </div>
    )
}