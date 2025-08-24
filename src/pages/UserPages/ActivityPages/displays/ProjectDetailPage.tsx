import { useLocation } from "react-router-dom"
import { List, Card, Tag, Avatar, Button, Typography, Space, Divider } from "antd"
import { 
    UserOutlined, 
    CalendarOutlined, 
    DollarOutlined, 
    LinkOutlined,
    EditOutlined,
    EyeOutlined 
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./ProjectDetailPage.module.less"
import { Project } from "@/commons/types/activity"

const { Title, Text, Paragraph } = Typography

export const ProjectDetailPage = () => {
    const { state } = useLocation()
    const projects = state?.projects || [] // Assuming projects array is passed in state
    const singleProject = state as Project // Or single project

    // Mock data for demonstration - replace with actual data
    const mockProjects: Project[] = [
        {
            title: "AI智能客服系统",
            amount: 50000,
            authors: "张三, 李四, 王五",
            activityId: "ACT001",
            description: "基于深度学习的智能客服系统，能够自动识别用户意图并提供精准回复。系统采用最新的NLP技术，支持多轮对话和情感分析。",
            cover: "https://via.placeholder.com/300x200",
            link: "https://github.com/example/ai-customer-service",
            createdTime: "2024-01-15T10:00:00Z",
            updatedTime: "2024-01-20T15:30:00Z",
            deleted: false
        },
        {
            title: "区块链溯源平台",
            amount: 80000,
            authors: "赵六, 孙七",
            activityId: "ACT001",
            description: "利用区块链技术构建的产品溯源平台，确保产品信息的真实性和不可篡改性。平台支持二维码扫描和批次追踪功能。",
            cover: "https://via.placeholder.com/300x200",
            link: "https://github.com/example/blockchain-tracing",
            createdTime: "2024-01-10T14:20:00Z",
            updatedTime: "2024-01-18T11:45:00Z",
            deleted: false
        },
        {
            title: "智慧城市数据可视化",
            amount: 120000,
            authors: "周八, 吴九, 郑十",
            activityId: "ACT001",
            description: "面向智慧城市建设的大数据可视化平台，集成交通、环境、人口等多维度数据，提供实时监控和决策支持。",
            cover: "https://via.placeholder.com/300x200",
            link: "https://github.com/example/smart-city-viz",
            createdTime: "2024-01-05T09:15:00Z",
            updatedTime: "2024-01-22T16:20:00Z",
            deleted: false
        }
    ]

    const projectsToDisplay = projects.length > 0 ? projects : (singleProject ? [singleProject] : mockProjects)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm')
    }

    const handleViewProject = (project: Project) => {
        window.open(project.link, '_blank')
    }

    const handleEditProject = (project: Project) => {
        console.log('Edit project:', project)
        // Add navigation to edit page
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
                pagination={{
                    onChange: (page) => {
                        console.log(page)
                    },
                    pageSize: 5,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} 共 ${total} 项`,
                }}
                dataSource={projectsToDisplay}
                renderItem={(project: Project) => (
                    <List.Item
                        className={styles.listItem}
                        key={project.title}
                        actions={[
                            <Button 
                                key="view" 
                                type="primary" 
                                icon={<EyeOutlined />}
                                onClick={() => handleViewProject(project)}
                            >
                                查看作品
                            </Button>,
                            <Button 
                                key="edit" 
                                icon={<EditOutlined />}
                                onClick={() => handleEditProject(project)}
                            >
                                编辑
                            </Button>
                        ]}
                        extra={
                            <img
                                className={styles.projectImage}
                                alt="project cover"
                                src={project.cover}
                                onError={(e) => {
                                    e.currentTarget.src = '/default-img.png'
                                }}
                            />
                        }
                    >
                        <Card className={styles.projectCard} bordered={false}>
                            <List.Item.Meta
                                avatar={<Avatar size={64} icon={<UserOutlined />} />}
                                title={
                                    <div className={styles.projectTitle}>
                                        <Title level={4} style={{ margin: 0 }}>
                                            {project.title}
                                        </Title>
                                        <Tag color="blue">ID: {project.activityId}</Tag>
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
                                            <Text strong>项目金额：</Text>
                                            <Text style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                                                {formatCurrency(project.amount)}
                                            </Text>
                                        </div>
                                        <div className={styles.linkInfo}>
                                            <LinkOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                                            <Text strong>项目链接：</Text>
                                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                {project.link}
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