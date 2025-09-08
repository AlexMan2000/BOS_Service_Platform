import { useLocation } from "react-router-dom"
import { List, Card, Typography, Space, Divider, Modal, Button, InputNumber, Popconfirm, Tooltip } from "antd"
import { 
    UserOutlined, 
    CalendarOutlined, 
    DollarOutlined, 
    LinkOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./ProjectDetailPage.module.less"
import { Project, Activity, BetWorkVO } from "@/commons/types/activity"
import { useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { betWork } from "@/services/workApi"
import BackupImage1 from "@/assets/images/backup-image-1.jpg"
import BackupImage2 from "@/assets/images/backup-image-2.jpg"
import BackupImage3 from "@/assets/images/backup-image-3.jpg"
import BackupImage4 from "@/assets/images/backup-image-4.jpg"
import BackupImage5 from "@/assets/images/backup-image-5.jpg"

const { Title, Text, Paragraph } = Typography

export const ProjectDetailPage = () => {
    const { state } = useLocation()
    const projects = state?.projects || [] // Assuming projects array is passed in state
    const singleProject = state as Project // Or single project
    
    // 获取activity信息 - 假设从父页面传递过来
    const activity = state?.activity as Activity
    const { balance } = useSelector(selectUser)

    console.log("activity", activity)
    
    // 投注相关状态
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [money, setMoney] = useState<number>(0)
    const [currentProject, setCurrentProject] = useState<Project | null>(null)

    console.log(singleProject)

    const projectsToDisplay = projects.length > 0 ? projects : (singleProject ? [singleProject] : [])


    console.log("projectsToDisplay", projectsToDisplay)

const fallbackImages = [
    BackupImage1,
    BackupImage2,
    BackupImage3,
    BackupImage4,
    BackupImage5,
]

const [imgSrc, setImgSrc] = useState(projects.cover || "")

const [hasErrorOccurred, setHasErrorOccurred] = useState(false)

const handleImageError = () => {
    console.log("Image load error for:", imgSrc)
    if (!hasErrorOccurred) {
        setHasErrorOccurred(true)
        const randomIndex = Math.floor(Math.random() * fallbackImages.length)
        setImgSrc(fallbackImages[randomIndex])
    }
}

const handleImageLoad = () => {
    console.log("Image loaded successfully:", imgSrc)
}

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm')
    }


    return (
        <div className={styles.container}>
            {/* 投注Modal */}
            {activity && (
                <Modal
                    open={isModalOpen}
                    onCancel={() => {
                        setMoney(0)
                        setIsModalOpen(false)
                        setCurrentProject(null)
                    }}
                    footer={null}
                    title={"投注"}
                    width={500}
                >
                    <div style={{ padding: '20px 0' }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                                投注金额
                            </div>
                            <InputNumber
                                value={money}
                                min={1}
                                max={balance + activity.freeCredit}
                                onChange={(value) => {
                                    if (value) {
                                        setMoney(value)
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Tooltip title="假设你的余额是90，免费额度是100，那么你最多可以投注190元。如果你要对某个作品投注110元，优先消耗免费额度，您只需要消耗额外的10元账户余额">
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <QuestionCircleOutlined style={{ color: "#1677ff" }} />
                                    <div style={{ color: "#1677ff" }}>
                                        投注优先消耗免费额度，您的免费额度是{activity.freeCredit}
                                    </div>
                                </div>
                            </Tooltip>
                        </div>
                        <div>
                            <Popconfirm
                                title="确认投注"
                                description={`您确定要投注 ${money} 元吗？`}
                                onConfirm={async () => {
                                    if (currentProject && activity) {
                                        console.log(money)
                                        const betWorkData: BetWorkVO = {
                                            activityId: activity.id,
                                            workId: currentProject.id,
                                            amount: money,
                                            usedFreeAmount: activity.freeCredit
                                        }
                                        console.log(betWorkData);
                                        await betWork(betWorkData)
                                        
                                        setIsModalOpen(false)
                                        setMoney(0)
                                        setCurrentProject(null)
                                    }
                                }}
                                okText="确认投注"
                                cancelText="取消"
                            >
                                <Button 
                                disabled={activity.status !==1}
                                style={{ width: "100%" }} type="primary">
                                    投注
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                </Modal>
            )}
            <div className={styles.header}>
                <Title level={2}>作品详情</Title>
                
            </div>

            <List
                className={styles.projectList}
                itemLayout="vertical"
                size="large"
                pagination={false}
                dataSource={projectsToDisplay}
                renderItem={(project: Project) => (
                    <List.Item
                        className={styles.listItem}
                        key={project.title}
                        actions={activity ? [
                            <Button 
                                key="bet" 
                                type="primary" 
                                disabled={activity.status !==1}
                                onClick={() => {
                                    setCurrentProject(project)
                                    setIsModalOpen(true)
                                }}
                            >
                                投注
                            </Button>,
                        ] : []}
                        extra={
                            <img
                                className={styles.projectImage}
                                alt="project cover"
                                src={imgSrc}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                            />
                        }
                    >
                        <Card className={styles.projectCard} bordered={false}>
                            <List.Item.Meta
                                title={
                                    <div className={styles.projectTitle}>
                                        <Title level={4} style={{ margin: 0 }}>
                                            {project.title}
                                        </Title>
                                        {/* <Tag color="blue">ID: {project.activityId}</Tag> */}
                                    </div>
                                }
                                description={
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div className={styles.authorInfo}>
                                            <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                            <Text strong>作者：</Text>
                                            <Text>{project.authors}</Text>
                                        </div>
                                        <div className={styles.amountInfo}>
                                            <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                                            <Text strong>投注总金额：</Text>
                                            <Text style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                                                {formatCurrency(project.amount)}
                                            </Text>
                                        </div>
                                        <div className={styles.linkInfo}>
                                            <LinkOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                                            <Text strong>项目链接：</Text>
                                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                {project.link || '--'}
                                            </a>
                                        </div>
                                    </Space>
                                }
                            />
                            
                            <Divider style={{ margin: '16px 0' }} />
                            
                            <div className={styles.projectDescription}>
                                <Text strong>项目描述：</Text>
                                <Paragraph 
                                    ellipsis={{ 
                                        rows: 3, 
                                        expandable: true, 
                                        symbol: '展开' 
                                    }}
                                    style={{ marginTop: 8 }}
                                >
                                    {project.description}
                                </Paragraph>
                            </div>

                            <div className={styles.timeInfo}>
                                <Space split={<Divider type="vertical" />}>
                                    <span>
                                        <CalendarOutlined style={{ marginRight: 4, color: '#faad14' }} />
                                        <Text type="secondary">创建时间：{formatDate(project.createdTime)}</Text>
                                    </span>
                                    <span>
                                        <CalendarOutlined style={{ marginRight: 4, color: '#faad14' }} />
                                        <Text type="secondary">更新时间：{formatDate(project.updatedTime)}</Text>
                                    </span>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}