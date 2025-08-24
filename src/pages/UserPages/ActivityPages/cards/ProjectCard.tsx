import styles from "./ProjectCard.module.less"
import { ProjectCard as ProjectCardType } from "@/commons/types/activity"
import { useNavigate } from "react-router-dom"

export const ProjectCard = (props: ProjectCardType) => {
    const { title, amount, authors, activityId, description, cover, link, createdTime, updatedTime } = props
    const navigate = useNavigate()
    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activity/project/detail`)
        }}>
            <div className={styles.cover}>
                <img src={cover} alt={title} />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {title}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.status}>
                    {authors}
                </div>
                <div className={styles.startTime}>
                    创建时间: {createdTime}
                </div>
                <div className={styles.endTime}>
                    更新时间: {updatedTime}
                </div>
            </div>
        </div>
    )
}
