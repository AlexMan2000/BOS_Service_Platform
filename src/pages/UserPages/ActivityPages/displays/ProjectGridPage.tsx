// This is project page
import { ProjectCardType, Activity } from "@/commons/types/activity"
import styles from "./ProjectGridPage.module.less"
import { ProjectCard } from "../cards/ProjectCard"
import { Pie } from "@ant-design/charts"
import { useLocation } from "react-router-dom"
import { Card, Typography, Tag, Space, Divider, Avatar } from "antd"
import { 
    CalendarOutlined, 
    UserOutlined, 
    DollarOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography

export const ProjectGridPage = () => {

    const { state } = useLocation()
    console.log(state)
    
    // Get activity data from state or use mock data
    const activityData = state as Activity
    
    // Mock activity data for demonstration
    const mockActivity: Activity = {
        name: "2024年度创新项目大赛",
        accountId: "ACT2024001",
        balance: "500000",
        cover: "https://via.placeholder.com/400x300",
        description: "本次创新项目大赛旨在鼓励员工发挥创新思维，推动技术进步与业务发展。参赛项目涵盖人工智能、区块链、物联网等前沿技术领域，为公司未来发展储备技术力量。",
        status: "active",
        createdTime: "2024-01-01T09:00:00Z",
        updatedTime: "2024-01-15T14:30:00Z",
        startTime: "2024-01-01T09:00:00Z",
        endTime: "2024-03-31T18:00:00Z"
    }
    
    const currentActivity = activityData || mockActivity

    const PROJECT_CARDS: ProjectCardType[] = [
        {
            title: "作品1",
            description: "作品1描述，这个作品旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/400/500",
            authors: "作者1",
            activityId: "1",
            link: "https://www.baidu.com",
            createdTime: "2021-01-01 11:00:00",
            updatedTime: "2021-01-01 12:00:00",
            amount: 100,
        },
        {
            title: "作品2",
            description: "作品2描述，这个作品旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/400/400",
            authors: "作者2",
            activityId: "2",
            link: "https://www.baidu.com",
            createdTime: "2021-01-01 11:00:00",
            updatedTime: "2021-01-01 12:00:00",
            amount: 200,
        },
    ]


    const PIE_CONFIG = {
        data: [
          { type: '分类一', value: 27 },
          { type: '分类二', value: 25 },
          { type: '分类三', value: 18 },
          { type: '分类四', value: 15 },
          { type: '分类五', value: 10 },
          { type: '其他', value: 5 },
        ],
        angleField: 'value',
        colorField: 'type',
        label: {
          text: 'value',
          style: {
            fontWeight: 'bold',
          },
        },
        legend: {
          color: {
            title: false,
            position: '',
            rowPadding: 5,
          },
        },
        size: 100,
      };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm')
    }

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(parseInt(amount))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green'
            case 'inactive': return 'red'
            case 'pending': return 'orange'
            case 'cancelled': return 'default'
            default: return 'blue'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return '进行中'
            case 'inactive': return '已结束'
            case 'pending': return '待开始'
            case 'cancelled': return '已取消'
            default: return status
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircleOutlined />
            case 'inactive': return <ClockCircleOutlined />
            case 'pending': return <ClockCircleOutlined />
            case 'cancelled': return <ClockCircleOutlined />
            default: return <InfoCircleOutlined />
        }
    }

    return (
        <div className={styles.container}>
            
            <div className={styles.dashboard}>
                {/* Activity Detail Card */}
                <Card 
                    className={styles.activityDetail}
                    cover={
                        <img
                            alt="activity cover"
                            src={currentActivity.cover}
                            className={styles.activityCover}
                            onError={(e) => {
                                e.currentTarget.src = "https://picsum.photos/400/300"
                            }}
                        />
                    }
                >
                    <div className={styles.activityHeader}>
                        <Avatar 
                            size={48} 
                            icon={<UserOutlined />} 
                            className={styles.activityAvatar}
                        />
                        <div className={styles.activityTitleSection}>
                            <Title level={4} className={styles.activityTitle}>
                                {currentActivity.name}
                            </Title>
                            <Space size="small">
                                {getStatusIcon(currentActivity.status)}
                                <Tag color={getStatusColor(currentActivity.status)}>
                                    {getStatusText(currentActivity.status)}
                                </Tag>
                            </Space>
                        </div>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div className={styles.activityInfo}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div className={styles.infoItem}>
                                <UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                <Text strong>活动ID：</Text>
                                <Text copyable>{currentActivity.accountId}</Text>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <DollarOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                <Text strong>预算余额：</Text>
                                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                                    {formatCurrency(currentActivity.balance)}
                                </Text>
                            </div>

                            <div className={styles.infoItem}>
                                <CalendarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                <Text strong>开始时间：</Text>
                                <Text>{formatDate(currentActivity.startTime)}</Text>
                            </div>

                            <div className={styles.infoItem}>
                                <CalendarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                                <Text strong>结束时间：</Text>
                                <Text>{formatDate(currentActivity.endTime)}</Text>
                            </div>
                        </Space>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div className={styles.activityDescription}>
                        <Text strong>活动描述：</Text>
                        <Paragraph 
                            ellipsis={{ 
                                rows: 3, 
                                expandable: true, 
                                symbol: '展开' 
                            }}
                            style={{ marginTop: 8, marginBottom: 0 }}
                        >
                            {currentActivity.description}
                        </Paragraph>
                    </div>
                </Card>

                {/* Free Amount Card */}
                <Card className={styles.freeAmountCard}>
                    <div className={styles.freeAmount}>
                        <div className={styles.freeAmountTitle}>
                            <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                            免费额度
                        </div>
                        <div className={styles.freeAmountValue}>
                            ¥1,000
                        </div>
                    </div>
                </Card>

                {/* Pie Chart Card */}
                <Card className={styles.pieChartCard} title="项目分类统计">
                    <div className={styles.pieChartGroup}>
                        <Pie {...PIE_CONFIG}/>
                    </div>
                </Card>

                {/* <div className={styles.barChartGroup}>
                    <Line {...LINE_CONFIG}/>
                </div> */}
            </div>
            <div className={styles.grid}>
                {PROJECT_CARDS.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>

        </div>
    )
}