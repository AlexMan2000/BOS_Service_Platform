import styles from "./ProjectCard.module.less"
import { Activity, ProjectCardType } from "@/commons/types/activity"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Modal, Button, InputNumber, Popconfirm, Tooltip } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"
// import { getActivityStatusInfo } from "@/commons/utils/formatters/statusFormatter"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { betWork } from "@/services/workApi"
import { BetWorkVO } from "@/commons/types/activity"
import { getUserBalance } from "@/services/accountApi"
import { ResponseCode } from "@/commons/defs/code"
import { setUserInfo } from "@/store/slice/userSlice/userSlice"
export const ProjectCard = (props: ProjectCardType & { onSubmit: () => void, canBet: boolean }) => {
    const { title, amount, authors, description, cover, createdTime, updatedTime, id ,onSubmit, canBet} = props
    const navigate = useNavigate()

    const { state } = useLocation()
    const activity = state as Activity
    const { freeCredit } = activity

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [money, setMoney] = useState<number>(0)
    const { balance, userId } = useSelector(selectUser)

    console.log(balance, freeCredit, id)

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
    // const statusInfo = activity ? getActivityStatusInfo(activity.status) : null

    const dispatch = useDispatch()

    const acticityStatus = activity.status
    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activities/projects/detail`, {
                state: {
                    title,
                    amount,
                    authors,
                    description,
                    cover,
                    createdTime,
                    updatedTime,
                    id,
                    activityStatus: acticityStatus,
                    activity: activity
                }
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
                            min={1}
                            max={balance + freeCredit}
                            onChange={(value) => {
                                if (value) {
                                    setMoney(value)
                                }
                            }}
                        />
                    </div>
                    <div className={styles.infoContainer}>
                        <Tooltip title="假设你的余额是90，免费额度是100，那么你最多可以投注190元。如果你要对某个作品投注110元，优先消耗免费额度，您只需要消耗额外的10元账户余额">

                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <QuestionCircleOutlined style={{ color: "#1677ff" }} />
                                <div className={styles.infoText} style={{ color: "#1677ff" }}>
                                    投注优先消耗免费额度，您的免费额度是{freeCredit}
                                </div>
                            </div>

                        </Tooltip>

                    </div>
                    <div className={styles.buttonContainer}>
                        <Popconfirm
                            title="确认投注"
                            description={`您确定要投注 ${money} 元吗？`}
                            onConfirm={async (e) => {
                                if (e) e.stopPropagation()

                                const betWorkData: BetWorkVO = {
                                    activityId: activity.id,
                                    workId: id,
                                    amount: money,
                                    usedFreeAmount: Math.min(freeCredit, money)
                                }
                                console.log(betWorkData);
                                await betWork(betWorkData)


                               const balanceResult: any = await getUserBalance(userId)
                               if (balanceResult.code === ResponseCode.SUCCESS) {
                                const balance = balanceResult.data
                                dispatch(setUserInfo({
                                    balance: balance
                                }))
                               }

                                // 刷一下allworks
                                await onSubmit()

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
                <Button type="primary" 
                disabled={!canBet}
                onClick={(e) => {
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
