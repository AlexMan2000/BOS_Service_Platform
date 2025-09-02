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

            </Table>}
            {(role === "ADMIN" || role ==="SUPER")&& <Table<TransactionTableType> dataSource={transactionDataSource} className={styles.table}>
                    
                <Column title="Source Account" dataIndex="sourceAccountId" key="sourceAccountId" />
                <Column title="Target Account" dataIndex="targetAccountId" key="targetAccountId" />
                <Column title="Source Name" dataIndex="sourceName" key="sourceName" />
                <Column title="Target Name" dataIndex="targetName" key="targetName" />
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

            </Table>}
        </div>
    )
}