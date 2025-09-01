import styles from "./ProjectCard.module.less"
import { Activity, ProjectCardType } from "@/commons/types/activity"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Modal, Button, InputNumber, Popconfirm, Tag } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"
import { getActivityStatusInfo } from "@/commons/utils/formatters/statusFormatter"

export const ProjectCard = (props: ProjectCardType) => {
    const { title, amount, authors, description, cover, createdTime, updatedTime } = props
    const navigate = useNavigate()

    const { state } = useLocation()
    const activity = state as Activity

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [money, setMoney] = useState<number>(0)
    
    // 图片错误处理
    const [imgSrc, setImgSrc] = useState(cover || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")
    
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

    // 获取活动状态信息（如果活动有状态的话）
    const statusInfo = activity ? getActivityStatusInfo(activity.status) : null
    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activities/projects/detail`, {
                state: props
            })
        }}>
            <Modal
                open={isModalOpen}
                onCancel={(e) => {
                    e.stopPropagation()
                    setMoney(0)
                    setIsModalOpen(false)
                }}
                footer={null}
                modalRender={(node) => {
                    return (
                        <div className={styles.modalContent} onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                        }}>
                            {node}
                        </div>
                    )
                }}
                title={"投注"}
                width={500}
            >
                <div className={styles.modalContentContainer}>
                    <div className={styles.inputContainer}>
                        <div className={styles.title}>
                            投注金额
                        </div>
                        <InputNumber
                            value={money}
                            onChange={(value) => {
                                if (value) {
                                    setMoney(value)
                                }
                            }}
                        />
                    </div>
                    <div className={styles.infoContainer}>
                        <InfoCircleOutlined style={{ color: "#1677ff" }} />
                        <div className={styles.infoText} style={{ color: "#1677ff" }}>
                            投注优先消耗免费额度
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Popconfirm
                            title="确认投注"
                            description={`您确定要投注 ${money} 元吗？`}
                            onConfirm={(e) => {
                                if (e) e.stopPropagation()
                                console.log(money)
                                // Add your betting logic here
                                setIsModalOpen(false) // Close modal after successful bet
                                setMoney(0)
                            }}
                            onCancel={(e) => {
                                if (e) e.stopPropagation()
                            }}
                            okText="确认投注"
                            cancelText="取消"
                        >
                            <Button style={{ width: "100%" }} type="primary" onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault();
                            }}>
                                投注
                            </Button>
                        </Popconfirm>
                    </div>

                </div>
            </Modal>
            <div className={styles.cover}>
                <img 
                    src={imgSrc}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {title}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.authors}>
                    作者: {authors}
                </div>
                {amount && (
                    <div className={styles.amount}>
                        金额: ¥{amount.toLocaleString()}
                    </div>
                )}
                {statusInfo && (
                    <div className={styles.status}>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                    </div>
                )}
                <div className={styles.startTime}>
                    创建时间: {formatDateTime(createdTime)}
                </div>
                <div className={styles.endTime}>
                    更新时间: {formatDateTime(updatedTime)}
                </div>
            </div>

            <div className={styles.button}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Button type="primary" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setIsModalOpen(true)
                }}>
                    投注
                </Button>
            </div>
        </div>
    )
}
