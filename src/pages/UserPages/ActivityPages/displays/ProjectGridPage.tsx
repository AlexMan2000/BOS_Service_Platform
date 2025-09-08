// This is project page
import { ProjectCardType, Activity } from "@/commons/types/activity"
import styles from "./ProjectGridPage.module.less"
import { ProjectCard } from "../cards/ProjectCard"
import { useLocation } from "react-router-dom"
import { Card, Typography, Tag, Space, Divider, Empty, Tabs } from "antd"
import {
    CalendarOutlined,
    DollarOutlined,
    PieChartOutlined,
    BarChartOutlined
} from "@ant-design/icons"
import dayjs from "dayjs"
import { getActivityStatusColor, getActivityStatusText, getActivityStatusIcon } from "@/commons/utils/formatters/statusFormatter"
import { getAllWorks } from "@/services/workApi"
import { ResponseCode } from "@/commons/defs/code"
import { useEffect, useState, useMemo } from "react"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { useSelector } from "react-redux"
import BackupImage1 from "@/assets/images/backup-image-1.jpg"
import BackupImage2 from "@/assets/images/backup-image-2.jpg"
import BackupImage3 from "@/assets/images/backup-image-3.jpg"
import BackupImage4 from "@/assets/images/backup-image-4.jpg"
import BackupImage5 from "@/assets/images/backup-image-5.jpg"
import { Pie, Column } from "@ant-design/plots"
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

    const [imgSrc, setImgSrc] = useState(currentActivity.cover || "")

    const activityFreeCredit = currentActivity.freeCredit // should remains the same in the whole activity
    const activityStatus = currentActivity.status;


    const [activityAccountFreeCredit, setActivityAccountFreeCredit] = useState(activityFreeCredit)

    console.log(activityStatus)
    const fetchData = async () => {
        try {
            const commonResult: any = await getAllWorks({ freeCredit: activityFreeCredit, accountId: accountId, activityId: id })
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

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('YYYY-MM-DD HH:mm')
    }


    const fallbackImages = [
        BackupImage1,
        BackupImage2,
        BackupImage3,
        BackupImage4,
        BackupImage5,
    ]

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

    const chartData = useMemo(() => {
        return projectCards && projectCards.length > 0 
            ? projectCards.map((project) => ({
                type: project.title || '未命名项目',
                value: project.amount || 0
            })).filter(item => item.value > 0)
            : [];
    }, [projectCards]);

    const PIE_CONFIG = useMemo(() => {
        return {
            data: chartData,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            label: {
                type: 'outer',
                content: '{name}: {percentage}',
            },
            legend: {
                position: "bottom" as const,
            },
            color: ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
            interactions: [
                {
                    type: 'element-active',
                },
            ],
        };
    }, [chartData]);

    const BAR_CONFIG = useMemo(() => {
        return {
            data: chartData,
            xField: 'type',
            yField: 'value',
            label: {
                position: 'middle' as const,
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
            xAxis: {
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            meta: {
                type: {
                    alias: '项目类型',
                },
                value: {
                    alias: '金额',
                },
            },
            color: ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
            interactions: [
                {
                    type: 'element-active',
                },
            ],
        };
    }, [chartData])


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
                            {activityFreeCredit.toString()}
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

    // Chart Card Component with Tab Switching
    const ChartCard = () => {
        const hasData = projectCards && projectCards.length > 0 && 
                       projectCards.some(project => project.amount && project.amount > 0);
        
        const tabItems = [
            {
                key: 'pie',
                label: (
                    <span>
                        <PieChartOutlined />
                        饼图
                    </span>
                ),
                children: hasData ? (
                    <div className={styles.pieChartGroup}>
                        <Pie {...PIE_CONFIG} />
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无数据可统计"
                        style={{ padding: '40px 0' }}
                    />
                ),
            },
            {
                key: 'bar',
                label: (
                    <span>
                        <BarChartOutlined />
                        柱状图
                    </span>
                ),
                children: hasData ? (
                    <div className={styles.barChartGroup}>
                        <Column {...BAR_CONFIG} />
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无数据可统计"
                        style={{ padding: '40px 0' }}
                    />
                ),
            },
        ];
        
        return (
            <Card className={styles.chartCard} title="项目分类统计">
                <Tabs 
                    defaultActiveKey="pie"
                    items={tabItems}
                    centered
                    size="small"
                />
            </Card>
        );
    };

    // Render based on whether there are projects
    if (projectCards.length === 0) {
        // No projects - horizontal layout with full width dashboard
        return (
            <div className={styles.containerNoProjects}>
                <div className={styles.dashboardFullWidth}>
                    <ActivityDetailCard />
                    {/* <ChartCard /> */}

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
                    <div className={styles.chartColumn}>
                        <ChartCard />
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
                            activityAccountFreeCredit={activityAccountFreeCredit}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}