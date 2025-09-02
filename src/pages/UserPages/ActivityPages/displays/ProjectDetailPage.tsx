import { useLocation } from "react-router-dom"
import { List, Card, Typography, Space, Divider } from "antd"
import { 
    UserOutlined, 
    CalendarOutlined, 
    DollarOutlined, 
    LinkOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./ProjectDetailPage.module.less"
import { Project } from "@/commons/types/activity"
import { useState } from "react"

const { Title, Text, Paragraph } = Typography

export const ProjectDetailPage = () => {
    const { state } = useLocation()
    const projects = state?.projects || [] // Assuming projects array is passed in state
    const singleProject = state as Project // Or single project




    const projectsToDisplay = projects.length > 0 ? projects : (singleProject ? [singleProject] : [])


    console.log("projectsToDisplay", projectsToDisplay)

const fallbackImages = [
    "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片",
    "https://picsum.photos/400/300?random=1",
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4="
]

const [fallbackIndex, setFallbackIndex] = useState(0)

const [imgSrc, setImgSrc] = useState(projects.cover || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")

const handleImageError = () => {
    console.log("Image load error for:", imgSrc)
    if (fallbackIndex < fallbackImages.length - 1) {
        const nextIndex = fallbackIndex + 1
        setFallbackIndex(nextIndex)
        setImgSrc(fallbackImages[nextIndex])
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
            <div className={styles.header}>
                <Title level={2}>作品详情</Title>
                <Text type="secondary">共 {projectsToDisplay.length} 个项目</Text>
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
                        actions={[
                            // <Button 
                            //     key="view" 
                            //     type="primary" 
                            //     disabled={!project.link}
                            //     icon={<EyeOutlined />}
                            //     onClick={() => handleViewProject(project)}
                            // >
                            //     查看作品连接
                            // </Button>,
                        ]}
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