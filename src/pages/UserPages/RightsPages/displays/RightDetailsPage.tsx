import { Right } from "@/commons/types/right"
import styles from "./RightDetailsPage.module.less"
import { useLocation } from "react-router-dom"
import { Button, InputNumber, message, Modal, Popconfirm, Tag, Card, Typography, Space, Divider, Avatar } from "antd"
import { useState } from "react"
import { 
    ShoppingCartOutlined, 
    DollarOutlined, 
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    TrophyOutlined,
    NumberOutlined,
    FileTextOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography

export const RightDetailsPage = () => {

    const { name, description, price, image, total, remain, active, expDate } = useLocation().state as Right

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [amount, setAmount] = useState(1)

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm')
    }

    const getRemainingPercentage = () => {
        return ((remain / total) * 100).toFixed(1)
    }

    const isLowStock = remain / total < 0.2

    return (
        <div className={styles.container}>
            <Modal
                open={isModalOpen}
                onCancel={(e) => {
                    e.stopPropagation()
                    setAmount(1)
                    setIsModalOpen(false)
                }}
                footer={null}
                title={
                    <div className={styles.modalTitle}>
                        <ShoppingCartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        兑换权益
                    </div>
                }
                width={600}
                centered
            >
                <div className={styles.modalContent}>
                    <Card className={styles.modalCard} bordered={false}>
                        <div className={styles.modalRightInfo}>
                            <div className={styles.modalRightName}>{name}</div>
                            <div className={styles.modalRightPrice}>
                                单价: <span className={styles.price}>{formatCurrency(price)}</span>
                            </div>
                            <div className={styles.modalRemainInfo}>
                                剩余库存: <span className={isLowStock ? styles.lowStock : styles.normalStock}>{remain}</span> / {total}
                            </div>
                        </div>
                        
                        <Divider style={{ margin: '20px 0' }} />
                        
                        <div className={styles.inputSection}>
                            <div className={styles.inputLabel}>
                                <NumberOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                兑换数量
                            </div>
                            <div className={styles.inputContainer}>
                                <InputNumber
                                    value={amount}
                                    min={1}
                                    max={remain}
                                    onChange={(value: number | null) => {
                                        if (value) {
                                            setAmount(value)
                                        } else {
                                            setAmount(1)
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className={styles.totalPrice}>
                                总计: <span className={styles.totalAmount}>{formatCurrency(price * amount)}</span>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <Button 
                                onClick={() => {
                                    setAmount(1)
                                    setIsModalOpen(false)
                                }}
                                size="large"
                            >
                                取消
                            </Button>
                            <Popconfirm
                                title="确认兑换"
                                description={
                                    <div>
                                        <div>权益名称: {name}</div>
                                        <div>兑换数量: {amount} 个</div>
                                        <div>总金额: {formatCurrency(price * amount)}</div>
                                    </div>
                                }
                                onConfirm={() => {
                                    setIsModalOpen(false)
                                    message.success({
                                        content: `兑换 ${amount} 个权益成功！兑换码为: ${Math.random().toString(36).substring(2, 15)}，请妥善保存`,
                                        duration: 10,
                                        style: { marginTop: '20vh' }
                                    })
                                }}
                                okText="确认兑换"
                                cancelText="再想想"
                                placement="top"
                            >
                                <Button 
                                    type="primary" 
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    disabled={remain === 0}
                                >
                                    立即兑换
                                </Button>
                            </Popconfirm>
                        </div>
                    </Card>
                </div>
            </Modal>

            <div className={styles.header}>
                <Title level={2}>权益详情</Title>
                <div className={styles.headerActions}>
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                            e.stopPropagation()
                            setAmount(1)
                            setIsModalOpen(true)
                        }}
                        disabled={!active || remain === 0}
                    >
                        {remain === 0 ? '已售罄' : '立即兑换'}
                    </Button>
                </div>
            </div>

            <Card className={styles.rightCard} bordered={false}>
                <div className={styles.rightContent}>
                    <div className={styles.rightImageSection}>
                        <img 
                            className={styles.rightImage}
                            src={image || "https://picsum.photos/400/300"} 
                            alt={name}
                            onError={(e) => {
                                e.currentTarget.src = '/default-img.png'
                            }}
                        />
                        <div className={styles.stockIndicator}>
                            <div className={styles.stockBar}>
                                <div 
                                    className={styles.stockFill}
                                    style={{ 
                                        width: `${(remain / total) * 100}%`,
                                        backgroundColor: isLowStock ? '#ff4d4f' : '#52c41a'
                                    }}
                                />
                            </div>
                            <Text type="secondary">
                                库存: {remain}/{total} ({getRemainingPercentage()}%)
                            </Text>
                        </div>
                    </div>

                    <div className={styles.rightDetails}>
                        <div className={styles.rightHeader}>
                            <Avatar size={64} icon={<TrophyOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <div className={styles.rightTitle}>
                                <Title level={3} style={{ margin: 0 }}>
                                    {name}
                                </Title>
                                <div className={styles.statusTags}>
                                    {active ? (
                                        <Tag icon={<CheckCircleOutlined />} color="green">有效</Tag>
                                    ) : (
                                        <Tag icon={<CloseCircleOutlined />} color="red">无效</Tag>
                                    )}
                                    {isLowStock && <Tag color="orange">库存紧张</Tag>}
                                    {remain === 0 && <Tag color="red">已售罄</Tag>}
                                </div>
                            </div>
                        </div>

                        <Divider style={{ margin: '20px 0' }} />

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div className={styles.infoSection}>
                                <div className={styles.infoItem}>
                                    <FileTextOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                                    <Text strong>权益描述：</Text>
                                </div>
                                <Paragraph 
                                    style={{ 
                                        marginTop: 8, 
                                        marginLeft: 24,
                                        padding: '16px',
                                        background: '#fafafa',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #722ed1'
                                    }}
                                >
                                    {description}
                                </Paragraph>
                            </div>

                            <div className={styles.priceSection}>
                                <div className={styles.infoItem}>
                                    <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                                    <Text strong>单价：</Text>
                                    <Text style={{ 
                                        color: '#52c41a', 
                                        fontSize: '20px', 
                                        fontWeight: 'bold',
                                        marginLeft: '8px'
                                    }}>
                                        {formatCurrency(price)}
                                    </Text>
                                </div>
                            </div>

                            <div className={styles.inventorySection}>
                                <Space split={<Divider type="vertical" />} size="large">
                                    <div className={styles.infoItem}>
                                        <NumberOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                        <Text strong>总量：</Text>
                                        <Text style={{ marginLeft: '8px', fontSize: '16px' }}>{total}</Text>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <NumberOutlined style={{ marginRight: 8, color: isLowStock ? '#ff4d4f' : '#52c41a' }} />
                                        <Text strong>剩余：</Text>
                                        <Text style={{ 
                                            marginLeft: '8px', 
                                            fontSize: '16px',
                                            color: isLowStock ? '#ff4d4f' : '#52c41a',
                                            fontWeight: 'bold'
                                        }}>
                                            {remain}
                                        </Text>
                                    </div>
                                </Space>
                            </div>

                            <div className={styles.timeSection}>
                                <div className={styles.infoItem}>
                                    <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                    <Text strong>过期时间：</Text>
                                    <Text style={{ marginLeft: '8px' }}>{formatDate(expDate)}</Text>
                                </div>
                            </div>
                        </Space>
                    </div>
                </div>
            </Card>
        </div>
    )
}