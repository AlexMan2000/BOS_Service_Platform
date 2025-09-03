import styles from "./ActivityCard.module.less"
import { ActivityCardType } from "@/commons/types/activity"
import { useNavigate } from "react-router-dom"
import { Tag } from "antd"
import { getActivityStatusInfo } from "@/commons/utils/formatters/statusFormatter"
import { useState } from "react"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"

import BackupImage1 from "@/assets/images/backup-image-1.jpg"
import BackupImage2 from "@/assets/images/backup-image-2.jpg"
import BackupImage3 from "@/assets/images/backup-image-3.jpg"
import BackupImage4 from "@/assets/images/backup-image-4.jpg"
import BackupImage5 from "@/assets/images/backup-image-5.jpg"



export const ActivityCard = (props: ActivityCardType) => {
    const { name, description, cover, status, startTime, endTime } = props
    const navigate = useNavigate()
    const [imgSrc, setImgSrc] = useState(cover || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")

    const statusInfo = getActivityStatusInfo(status)

    // 备用图片列表
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


    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activities/projects`, {
                state: props
            })
        }}>

            
            <div className={styles.cover}>
                <img 
                    src={imgSrc}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {name}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.status}>
                    <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                </div>
                <div className={styles.startTime}>
                    开始时间: {formatDateTime(startTime)}
                </div>
                <div className={styles.endTime}>
                    结束时间: {formatDateTime(endTime)}
                </div>
            </div>
            
        </div>
    )
}
