// This is project page
import { ProjectCard as ProjectCardType } from "@/commons/types/activity"
import styles from "./ProjectGridPage.module.less"
import { ProjectCard } from "../cards/ProjectCard"

export const ProjectGridPage = () => {

    const PROJECT_CARDS: ProjectCardType[] = [
        {
            title: "项目1",
            description: "项目1描述",
            cover: "https://picsum.photos/200/300",
            authors: "作者1",
            activityId: "1",
            link: "https://www.baidu.com",
            createdTime: "2021-01-01 11:00:00",
            updatedTime: "2021-01-01 12:00:00",
            amount: 100,
        },
        {
            title: "项目2",
            description: "项目2描述",
            cover: "https://picsum.photos/200/300",
            authors: "作者2",
            activityId: "2",
            link: "https://www.baidu.com",
            createdTime: "2021-01-01 11:00:00",
            updatedTime: "2021-01-01 12:00:00",
            amount: 200,
        },
    ]


    return (
        <div className={styles.container}>

            {PROJECT_CARDS.map((project) => (
                <ProjectCard key={project.title} {...project} />
            ))}

        </div>
    )
}