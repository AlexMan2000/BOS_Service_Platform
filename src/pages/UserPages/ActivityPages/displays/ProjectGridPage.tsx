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
    DollarOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { getActivityStatusColor, getActivityStatusText, getActivityStatusIcon } from "@/commons/utils/formatters/statusFormatter"
import { getAllWorks } from "@/services/workApi"
import { ResponseCode } from "@/commons/defs/code"
import { useEffect, useState } from "react"

const { Title, Text, Paragraph } = Typography

export const ProjectGridPage = () => {

    const { state } = useLocation()
    const [projectCards, setProjectCards] = useState<ProjectCardType[]>([])
    console.log("avtivity State", state)
    
    // Get activity data from state or use mock data
    const activityData = state as Activity
    const id = activityData.id
    
    // Mock activity data for demonstration
    const mockActivity: Activity = {
        id: 1,
        name: "2024年度创新项目大赛",
        accountId: 1,
        freeCredit: 500000,
        cover: "https://via.placeholder.com/400x300",
        description: "本次创新项目大赛旨在鼓励员工发挥创新思维，推动技术进步与业务发展。参赛项目涵盖人工智能、区块链、物联网等前沿技术领域，为公司未来发展储备技术力量。",
        status: 1,
        createdTime: "2024-01-01T09:00:00Z",
        updatedTime: "2024-01-15T14:30:00Z",
        startTime: "2024-01-01T09:00:00Z",
        endTime: "2024-03-31T18:00:00Z"
    }
    
    const currentActivity = activityData || mockActivity

    const fetchData = async () => {
        try {
            const commonResult: any = await getAllWorks({ freeCredit: 1321321, accountId: 122, activityId: id })
            if (commonResult.code === ResponseCode.SUCCESS) {
                const data = commonResult.data.workList
                // 确保data是数组
                console.log('data', data)
                setProjectCards(data as ProjectCardType[])
            } else {
                console.warn('获取项目数据失败:', commonResult)
                setProjectCards([])
            }
        } catch (error) {
            console.error('获取项目数据失败:', error)
            setProjectCards([])
        }
    }

    useEffect(() => {
       
        
        if (id && id !== 0) {
            fetchData()
        } else {
            // 如果没有有效的活动ID，清空数据
            setProjectCards([])
        }
    }, [id])


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
                                {getActivityStatusIcon(currentActivity.status)}
                                <Tag color={getActivityStatusColor(currentActivity.status)}>
                                    {getActivityStatusText(currentActivity.status)}
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
                                    {formatCurrency(currentActivity.freeCredit.toString())}
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
                {projectCards.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>

        </div>
    )
}