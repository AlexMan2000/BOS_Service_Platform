import styles from "./ActivityCard.module.less"
import { ActivityCardType } from "@/commons/types/activity"
import { useNavigate } from "react-router-dom"



export const ActivityCard = (props: ActivityCardType) => {
    const { name, description, cover, status, startTime, endTime } = props
    const navigate = useNavigate()


    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activities/projects`, {
                state: props
            })
        }}>

            
            <div className={styles.cover}>
                <img src={cover} alt={name} />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {name}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.status}>
                    {status}
                </div>
                <div className={styles.startTime}>
                    开始时间: {startTime}
                </div>
                <div className={styles.endTime}>
                    结束时间: {endTime}
                </div>
            </div>
            
        </div>
    )
}
