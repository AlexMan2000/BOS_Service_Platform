import styles from "./ActivityCard.module.less"
import { ActivityCardType } from "@/commons/types/activity"
import { useNavigate } from "react-router-dom"
import { Tag } from "antd"
import { getActivityStatusInfo } from "@/commons/utils/formatters/statusFormatter"
import { useState } from "react"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"



export const ActivityCard = (props: ActivityCardType) => {
    const { name, description, cover, status, startTime, endTime } = props
    const navigate = useNavigate()
    const [imgSrc, setImgSrc] = useState(cover || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")

    const statusInfo = getActivityStatusInfo(status)

    // 备用图片列表
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
