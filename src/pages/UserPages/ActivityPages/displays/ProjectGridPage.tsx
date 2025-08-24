// This is project page
import { ProjectCard as ProjectCardType } from "@/commons/types/activity"
import styles from "./ProjectGridPage.module.less"
import { ProjectCard } from "../cards/ProjectCard"
import { Pie, Line } from "@ant-design/charts"

export const ProjectGridPage = () => {

    const PROJECT_CARDS: ProjectCardType[] = [
        {
            title: "项目1",
            description: "项目1描述，这个项目旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
            cover: "https://picsum.photos/400/500",
            authors: "作者1",
            activityId: "1",
            link: "https://www.baidu.com",
            createdTime: "2021-01-01 11:00:00",
            updatedTime: "2021-01-01 12:00:00",
            amount: 100,
        },
        {
            title: "项目2",
            description: "项目2描述，这个项目旨在帮助员工熟悉投票流程, 所有员工都可以参与, 投票时间截止到2021-01-01 12:00:00",
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


    //   const LINE_CONFIG = {
    //     data: {
    //       type: 'fetch',
    //       value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/line-series.json',
    //     },
    //     xField: (d) => new Date(d.date),
    //     yField: 'unemployment',
    //     colorField: 'steelblue',
    //     seriesField: 'division',
    //   };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {PROJECT_CARDS.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
            <div className={styles.dashboard}>
                <div className={styles.freeAmount}>
                    <div className={styles.freeAmountTitle}>
                        免费额度
                    </div>
                    <div className={styles.freeAmountValue}>
                        1000
                    </div>
                </div>
                <div className={styles.pieChartGroup}>
                    <Pie {...PIE_CONFIG}/>
                </div>
                {/* <div className={styles.barChartGroup}>
                    <Line {...LINE_CONFIG}/>
                </div> */}
            </div>


        </div>
    )
}