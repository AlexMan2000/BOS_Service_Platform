// This is project page
import { ProjectCardType, Activity } from "@/commons/types/activity"
import styles from "./ProjectGridPage.module.less"
import { ProjectCard } from "../cards/ProjectCard"
import { useLocation } from "react-router-dom"
import { Card, Typography, Tag, Space, Divider, Empty } from "antd"
import {
    CalendarOutlined,
    DollarOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { getActivityStatusColor, getActivityStatusText, getActivityStatusIcon } from "@/commons/utils/formatters/statusFormatter"
import { getAllWorks } from "@/services/workApi"
import { ResponseCode } from "@/commons/defs/code"
import { useEffect, useState } from "react"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { useSelector } from "react-redux"

const { Title, Text, Paragraph } = Typography

export const ProjectGridPage = () => {

    const { state } = useLocation()
    const [projectCards, setProjectCards] = useState<ProjectCardType[]>([])
    const { accountId } = useSelector(selectUser)
    console.log("avtivity State", state)

    // Get activity data from state or use mock data
    const activityData = state as Activity
    const id = activityData.id

    // Mock activity data for demonstration

    const currentActivity = activityData

    const [imgSrc, setImgSrc] = useState(currentActivity.cover || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")

    const activityFreeCredit = currentActivity.freeCredit // should remains the same in the whole activity
    const activityStatus = currentActivity.status;


    const [activityAccountFreeCredit, setActivityAccountFreeCredit] = useState(activityFreeCredit)

    console.log(activityStatus)
    const fetchData = async () => {
        try {
            const commonResult: any = await getAllWorks({ freeCredit: activityAccountFreeCredit, accountId: accountId, activityId: id })
            if (commonResult.code === ResponseCode.SUCCESS) {
                const data = commonResult.data.workList
                // 确保data是数组
                console.log('data', data)
                setActivityAccountFreeCredit(commonResult.data.freeCredit)
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
            { type: '未开始', value: 27 },
            { type: '已结束', value: 25 },
            { type: '进行中', value: 18 },
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

    const fallbackImages = [
        "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片",
        "https://picsum.photos/400/300?random=1",
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4="
    ]

    const [fallbackIndex, setFallbackIndex] = useState(0)

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


    // Activity Detail Card Component
    const ActivityDetailCard = () => (
        <Card
            className={styles.activityDetail}
            cover={
                <img
                    alt="activity cover"
                    src={imgSrc}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    className={styles.activityCover}
                />
            }
        >
            <div className={styles.activityHeader}>
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
                        <DollarOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text strong>活动免费额度：</Text>
                        <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                            {activityAccountFreeCredit.toString()}
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
    );

    // Pie Chart Card Component
    const PieChartCard = () => (
        <Card className={styles.pieChartCard} title="项目分类统计">
            {/* <div className={styles.pieChartGroup}>
                <Pie {...PIE_CONFIG}/>
            </div> */}
        </Card>
    );

    // Render based on whether there are projects
    if (projectCards.length === 0) {
        // No projects - horizontal layout with full width dashboard
        return (
            <div className={styles.containerNoProjects}>
                <div className={styles.dashboardFullWidth}>
                    <ActivityDetailCard />
                    {/* <PieChartCard /> */}

                    {/* Empty State */}
                    <Card className={styles.emptyStateCard}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className={styles.emptyDescription}>
                                    <Title level={4} style={{ color: '#8c8c8c', marginBottom: 8 }}>
                                        此活动还没有作品
                                    </Title>
                                    <Text type="secondary">
                                        目前还没有用户提交作品，等待更多精彩内容
                                    </Text>
                                </div>
                            }
                        />
                    </Card>
                </div>
            </div>
        );
    }

    // Has projects - vertical layout
    return (
        <div className={styles.containerWithProjects}>
            {/* Activity Detail Section */}
            <div className={styles.activitySection}>
                <div className={styles.activityRow}>
                    <div className={styles.activityDetailColumn}>
                        <ActivityDetailCard />
                    </div>
                    <div className={styles.pieChartColumn}>
                        <PieChartCard />
                    </div>
                </div>
            </div>

            {/* Projects Grid Section */}
            <div className={styles.projectsSection}>
                <div className={styles.projectsSectionHeader}>
                    <Title level={3} style={{ margin: 0 }}>
                        项目作品 ({projectCards.length})
                    </Title>
                </div>
                <div className={styles.grid}>
                    {projectCards.map((project) => (
                        <ProjectCard key={project.title} {...project} onSubmit={
                            async () => {
                                await fetchData()
                            }
                            
                        } 
                        canBet={activityStatus === 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}