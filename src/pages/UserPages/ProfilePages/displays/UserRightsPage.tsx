import styles from "./UserRightsPage.module.less"
import { BenefitCodeListVO, CheckBenefitCodeVO } from "@/commons/types/right"
import { Table, Tag, Button, message } from "antd"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { getUserBenefitInfo, checkAllBenefitCodes } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"

export const UserRightsPage = () => {

    const [benefitCodeDataSouce, setBenefitCodeDataSource] = useState<BenefitCodeListVO[]>([])
    const [loading, setLoading] = useState(false)
    const { userId, role } = useSelector(selectUser)


    const fetchData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResult = await getUserBenefitInfo({userId: Number(userId), pageNum: pageNum, pageSize: pageSize})
        if (commonResult.code === ResponseCode.SUCCESS) {
            setBenefitCodeDataSource(commonResult.data as BenefitCodeListVO[])
        }
    }

    const handleRedeem = async (record: BenefitCodeListVO) => {
        if (record.status === 0) {
            message.warning('该权益已经核销过了')
            return
        }

        setLoading(true)
        try {
            const redeemData: CheckBenefitCodeVO = {
                codes: [record.code],
                redeemedBy: userId?.toString() || ''
            }
            
            const result = await checkAllBenefitCodes(redeemData)
            
            if (result.code === ResponseCode.SUCCESS) {
                message.success('核销成功')
                // 刷新数据
                fetchData()
            } else {
                message.error('核销失败: ' + (result.message || '未知错误'))
            }
        } catch (error: any) {
            console.error('核销错误:', error)
            message.error('核销失败: ' + (error.message || '网络错误'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(0, 10)
    }, [])

    return (
        <div className={styles.container}>
            <Table<BenefitCodeListVO> 
                dataSource={benefitCodeDataSouce} 
                className={styles.table}
                scroll={{ x: 800 }}
                loading={loading}
            >
                <Column title="Name" dataIndex="benefitName" key="benefitName" />
                <Column title="Redeem Code" dataIndex="code" key="code" />
                <Column title="Benefit Account Id" dataIndex="accountId" key="accountId" />
                <Column title="Benefit Id" dataIndex="benefitId" key="benefitId" />
                <Column title="Exp Date" dataIndex="expDate" key="expDate"
                    render={(text: string) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                />
                <Column title="Status" dataIndex="status" key="status" render={(text: number) => {
                    return <Tag color={text === 1 ? "red" : "green"}>{text === 1 ? "未核销" : "已核销"}</Tag>
                }} />
                {role === "ADMIN" && <Column 
                    title="Action" 
                    key="action" 
                    fixed="right"
                    width={100}
                    render={(_, record: BenefitCodeListVO) => (
                        <Button 
                            type="primary" 
                            size="small"
                            disabled={record.status === 0}
                            onClick={() => handleRedeem(record)}
                        >
                            核销
                        </Button>
                    )}
                />}
            </Table>
        </div>
    )
}