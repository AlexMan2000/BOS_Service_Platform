import styles from "./UserRightsPage.module.less"
import { BenefitCodeListVO } from "@/commons/types/right"
import { Table, Tag } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { getUserBenefitInfo } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"

export const UserRightsPage = () => {

    const [benefitCodeDataSouce, setBenefitCodeDataSource] = useState<BenefitCodeListVO[]>([])
    const { userId } = useSelector(selectUser)


    const fetchData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResult = await getUserBenefitInfo({userId: Number(userId), pageNum: pageNum, pageSize: pageSize})
        if (commonResult.code === ResponseCode.SUCCESS) {
            setBenefitCodeDataSource(commonResult.data as BenefitCodeListVO[])
        }
    }

    useEffect(() => {
        fetchData(0, 10)
    }, [])

    return (
        <div className={styles.container}>
            <Table<BenefitCodeListVO> dataSource={benefitCodeDataSouce} className={styles.table}>
                <Column title="Name" dataIndex="benefitName" key="benefitName" />
                <Column title="Redeem Code" dataIndex="code" key="code" />
                <Column title="Benefit Account Id" dataIndex="accountId" key="accountId" />
                <Column title="Benefit Id" dataIndex="benefitId" key="benefitId" />
                <Column title="Exp Date" dataIndex="expDate" key="expDate"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />
                <Column title="Status" dataIndex="status" key="status" render={(text: boolean) => {
                    return <Tag color={text ? "green" : "red"}>{text ? "未核销" : "已核销"}</Tag>
                }} />
                
            </Table>
        </div>
    )
}