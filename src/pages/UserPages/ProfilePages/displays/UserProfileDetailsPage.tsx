import { List, Card, Typography, Avatar } from "antd"
import { UserOutlined, PhoneOutlined, BankOutlined, IdcardOutlined, DollarOutlined, TransactionOutlined } from "@ant-design/icons"
import styles from "./UserProfileDetailsPage.module.less"
import { useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { TransferModal } from "@/commons/components/Modal/TransferModal"

const { Title, Text } = Typography

export const UserProfileDetailsPage = () => {
    const [transferOpen, setTransferOpen] = useState(false)

    const { employeeNo, name, department, phone, balance } = useSelector(selectUser)
    
    console.log("employeeNo", employeeNo, "name", name, "department", department, "phone", phone, "balance", balance)

    // 构建用户信息数据
    const userInfoData = [
        {
            title: '工号',
            value: employeeNo || '--',
            icon: <IdcardOutlined />,
            key: 'employeeNo'
        },
        {
            title: '用户名',
            value: name || '--',
            icon: <UserOutlined />,
            key: 'name'
        },
        {
            title: '部门',
            value: department || '--',
            icon: <BankOutlined />,
            key: 'department'
        },
        {
            title: '余额',
            value: balance ? `¥${balance.toLocaleString()}` : '--',
            icon: <DollarOutlined />,
            key: 'balance',
            hasAction: true
        },
        {
            title: '手机号',
            value: phone || '--',
            icon: <PhoneOutlined />,
            key: 'phone'
        }
    ]

    return (
        <div className={styles.container}>
            <TransferModal
                title="转账"
                transferOpen={transferOpen}
                setTransferOpen={setTransferOpen}
            />
            
            <Card className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <Avatar size={64} icon={<UserOutlined />} className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <Title level={3} className={styles.userName}>{name || '未知用户'}</Title>
                        <Text type="secondary">{department || '未知部门'}</Text>
                    </div>
                </div>
                
                <List
                    className={styles.userInfoList}
                    dataSource={userInfoData}
                    renderItem={(item) => (
                        <List.Item className={styles.listItem}>
                            <List.Item.Meta
                                avatar={<div className={styles.iconWrapper}>{item.icon}</div>}
                                title={<Text strong className={styles.itemTitle}>{item.title}</Text>}
                                description={
                                    <div className={styles.itemValue}>
                                        <Text className={styles.valueText}>{item.value}</Text>
                                        {item.hasAction && (
                                            <TransactionOutlined 
                                                className={styles.actionIcon}
                                                onClick={() => setTransferOpen(true)}
                                                title="转账"
                                            />
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}