import { Right } from "@/commons/types/right"
import styles from "./RightDetailsPage.module.less"
import { useLocation } from "react-router-dom"
import { Button, InputNumber, message, Modal, Popconfirm, Tag } from "antd"
import { useState } from "react"

export const RightDetailsPage = () => {

    const { name, description, price, image, total, remain, active, expDate } = useLocation().state as Right

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [amount, setAmount] = useState(1)
    return (
        <div className={styles.container}>
            <Modal
                open={isModalOpen}
                onCancel={(e) => {
                    e.stopPropagation()
                    setAmount(1)
                    setIsModalOpen(false)
                }}
                footer={null}
                title={"兑换权益"}
                width={500}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalContentContainer}>
                            <div className={styles.inputContainer}>
                                <div className={styles.title}>兑换数量</div>
                                <div className={styles.input}>
                                    <InputNumber
                                        value={amount}
                                        min={1}
                                        max={remain}
                                        onChange={(value: number | null) => {
                                            if (value) {
                                                setAmount(value)
                                            } else {
                                                setAmount(1)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <Popconfirm
                                title="确认兑换"
                                description={`确认兑换 ${amount} 个权益吗？`}
                                onConfirm={() => {
                                    setIsModalOpen(false)
                                    message.success(`兑换 ${amount} 个权益成功, 兑换码为: ${Math.random().toString(36).substring(2, 15)}，已发送至您的邮箱`)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <div className={styles.buttonContainer}>
                                    兑换
                                </div>
                            </Popconfirm>
                    </div>
                </div>
            </Modal>
            <div className={styles.cover}>
                <img src={"https://picsum.photos/400/200"} alt={name} />
            </div>
            <div className={styles.content}>
                <div className={styles.name}>
                    <span className={styles.label}>权益名称:</span> {name}
                </div>
                <div className={styles.description}>
                    <span className={styles.label}>权益描述:</span> {description}
                </div>
                <div className={styles.price}>
                    <span className={styles.label}>单价:</span> {price}
                </div>
                <div className={styles.total}>
                    <span className={styles.label}>总量:</span> {total}
                </div>
                <div className={styles.remain}>
                    <span className={styles.label}>剩余:</span> {remain}
                </div>
                <div className={styles.active}>
                    <span className={styles.label}>是否有效:</span> {active ? <Tag color="green">有效</Tag> : <Tag color="red">无效</Tag>}
                </div>
                <div className={styles.expDate}>
                    <span className={styles.label}>过期时间:</span> {expDate}
                </div>
            </div>
            <div className={styles.button} onClick={(e) => {
                e.stopPropagation()
                setAmount(1)
                setIsModalOpen(true)
            }}>
                兑换
            </div>
        </div>
    )
}