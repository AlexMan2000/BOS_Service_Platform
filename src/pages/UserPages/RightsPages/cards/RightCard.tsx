import { BenefitRedeemVO, RightCardType } from "@/commons/types/right"
import { useNavigate } from "react-router-dom"
import styles from "./RightCard.module.less"
import { Popconfirm, Modal, Button, InputNumber, message, Tag } from "antd"
import { useState } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { benefitRedeem } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
interface RightCardProps extends RightCardType {
    onSubmit: () => void;
}

export const RightCard = (props: RightCardProps) => {
    const {id, name, description, price, image, total, remain, active, expDate, onSubmit } = props
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [amount, setAmount] = useState<number>(1)

    const { accountId, balance } = useSelector(selectUser)

    const [imgSrc, setImgSrc] = useState(image || "https://via.placeholder.com/400x300/f0f0f0/666?text=暂无图片")
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
            // Create a clean object without functions for navigation state
            const rightData = {
                id,
                name,
                description,
                price,
                image,
                total,
                remain,
                active,
                expDate
            }
            navigate(`/home/rights/details`, { state: rightData })
        }}>
            <Modal
                open={isModalOpen}
                onCancel={(e) => {
                    e.stopPropagation()
                    setAmount(1)
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
                title={"兑换权益"}
                width={500}
            >
                <div className={styles.modalContentContainer}>
                    <div className={styles.inputContainer}>
                        <div className={styles.title}>
                            兑换数量
                        </div>
                        <InputNumber
                            value={amount}
                            min={1}
                            max={Math.min(remain, balance)}
                            onChange={(value) => {
                                if (value) {
                                    setAmount(value)
                                }
                            }}
                        />
                    </div>
                    <div className={styles.infoContainer}>
                        <InfoCircleOutlined style={{ color: "#1677ff" }} />
                        <div className={styles.infoText} style={{ color: "#1677ff" }}>
                            兑换消耗余额: {price * amount}，当前余额: {balance}
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Popconfirm
                            title="确认兑换"
                            description={`您确定要兑换 ${amount} 份该权益吗？兑换后将消耗 ${price * amount} 余额`}
                            onConfirm={async (e) => {
                                if (e) e.stopPropagation()

                                if (price * amount > balance) {
                                    message.error("余额不足")
                                    return
                                }
                                const benefitRedeemVO: BenefitRedeemVO = {
                                    count: amount,
                                    accountId: accountId.toString(),
                                    benefitId: id,
                                }
                                const commonResult = await benefitRedeem(benefitRedeemVO);
                                if (commonResult.code === ResponseCode.SUCCESS) {
                                    message.success({
                                        content: `兑换 ${amount} 个权益成功！请在个人中心查看`,
                                        duration: 3,
                                    })
                                    onSubmit()
                                } else {
                                    message.error(commonResult.message)
                                }
            
                                setIsModalOpen(false) // Close modal after successful bet
                                setAmount(1)
                            }}
                            onCancel={(e) => {
                                if (e) e.stopPropagation()
                            }}
                            okText="确认兑换"
                            cancelText="取消"
                        >
                            <Button style={{ width: "100%" }} type="primary" onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault();
                            }}>
                                兑换
                            </Button>
                        </Popconfirm>
                    </div>

                </div>
            </Modal>

            <div className={styles.cover}>
                <img src={imgSrc} alt={name} onError={handleImageError} onLoad={handleImageLoad} />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {name}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.status}>
                    <Tag color={active ? "green" : "red"}>{active ? "有效" : "无效"}</Tag>
                </div>
                <div className={styles.startTime}>
                    过期时间: {formatDateTime(expDate)}
                </div>
                <div className={styles.price}>
                    价格: {price}
                </div>
                <div className={styles.total}>
                    总量: {total}
                </div>
                <div className={styles.remain}>
                    剩余: {remain}
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
                    兑换
                </Button>
            </div>
        </div>
    )
}