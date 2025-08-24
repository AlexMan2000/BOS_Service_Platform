import { RightCardType } from "@/commons/types/right"
import { useNavigate } from "react-router-dom"
import styles from "./RightCard.module.less"
import { Popconfirm, Modal, Button, InputNumber, message } from "antd"
import { useState } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"

export const RightCard = (props: RightCardType) => {
    const { name, description, price, image, total, remain, active, exp_date } = props
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [amount, setAmount] = useState<number>(0)

    
    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/rights/detail`)
        }}>
            <Modal
                open={isModalOpen}
                onCancel={(e) => {
                    e.stopPropagation()
                    setAmount(0)
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
                            兑换消耗余额: {price * amount}
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Popconfirm
                            title="确认兑换"
                            description={`您确定要兑换 ${amount} 份该权益吗？兑换后将消耗 ${price * amount} 余额`}
                            onConfirm={(e) => {
                                if (e) e.stopPropagation()
                                console.log(amount)
                                // Add your betting logic here
                                setIsModalOpen(false) // Close modal after successful bet
                                setAmount(0)
                                message.success(`兑换成功，兑换码为: ${Math.random().toString(36).substring(2, 15)}, 请在权益页面查看`)
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
                <img src={image} alt={name} />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    {name}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.status}>
                    {active ? "有效" : "无效"}
                </div>
                <div className={styles.startTime}>
                    过期时间: {exp_date}
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