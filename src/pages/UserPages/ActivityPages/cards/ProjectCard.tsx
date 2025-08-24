import styles from "./ProjectCard.module.less"
import { ProjectCard as ProjectCardType } from "@/commons/types/activity"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Button, InputNumber, Popconfirm } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"

export const ProjectCard = (props: ProjectCardType) => {
    const { title, amount, authors, activityId, description, cover, link, createdTime, updatedTime } = props
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false)


    const [money, setMoney] = useState<number>(0)
    return (
        <div className={styles.container} onClick={() => {
            navigate(`/home/activities/projects/detail`)
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
