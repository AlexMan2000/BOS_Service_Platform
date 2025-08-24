import styles from "./RightManagementDetailsPage.module.less"
import { useLocation } from "react-router-dom"
import { Right } from "@/commons/types/right"
import { useEffect, useState } from "react"
import { Form, Input } from "antd"
import { TransactionOutlined } from "@ant-design/icons"
import { TransferModal } from "@/commons/components/Modal/TransferModal"

export const RightManagementDetailsPage = () => {
    const { name, description, price, image, total, remain, active, expDate } = useLocation().state as Right


    useEffect(() => {
        userForm.setFieldsValue({
            "权益名称": name,
            "权益描述": description,
            "权益价格": price,
            "权益图片": image,
            "权益总量": total,
            "权益剩余": remain,
            "权益状态": active,
            "权益过期时间": expDate
        })
    }, [])

    const [userForm] = Form.useForm()
    const [edit, setEdit] = useState(false)
    const [transferOpen, setTransferOpen] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.content}>    
            <div className={styles.header}>
                <div className={styles.edit} onClick={() => {
                    if (edit) {
                        console.log(userForm.getFieldValue("权益名称"))
                        userForm.submit()
                    } else {
                        setEdit(!edit)
                    }
                }
                }>
                    {edit ? "保存" : "编辑"}
                </div>
            </div>
            <div className={styles.cover}>
                <img src={"https://picsum.photos/200/300"} alt={name} />
            </div>
            <Form
                disabled={!edit}
                form={userForm}
                className={styles.form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 800 }}
                onFinish={() => {
                    console.log(userForm.getFieldsValue())
                    setEdit(!edit)
                }}
            >
                <Form.Item
                    label="权益名称"
                    name="权益名称"
                    rules={[{ required: true, message: "请输入权益名称" }]}
                    className={styles.formItem}
                >

                    <Input placeholder="请输入权益名称" />
                </Form.Item>
                <Form.Item
                    label="权益描述"
                    name="权益描述"
                    rules={[{ required: true, message: "请输入权益描述" }]}>
                    <Input placeholder="请输入权益描述" />
                </Form.Item>
                <Form.Item
                    label="权益价格"
                    name="权益价格"
                    rules={[{ required: true, message: "请输入权益价格" }]}>
                    <Input placeholder="请输入权益价格" />
                </Form.Item>
                <Form.Item
                    label="权益图片"
                    name="权益图片"
                    rules={[{ required: true, message: "请输入权益图片" }]}
                >
                    <Input placeholder="请输入权益图片连接" />
                </Form.Item>
                <Form.Item
                    label="权益总量"
                    name="权益总量"
                    rules={[{ required: true, message: "请输入权益总量" }]}
                >
                    <Input placeholder="请输入权益总量" />
                </Form.Item>
                <Form.Item
                    label="权益剩余"
                    name="权益剩余"
                    rules={[{ required: true, message: "请输入权益剩余" }]}
                >
                    <Input placeholder="请输入权益剩余" />
                </Form.Item>
                <Form.Item
                    label="权益状态"
                    name="权益状态"
                    rules={[{ required: true, message: "请输入权益状态" }]}
                >
                    <Input placeholder="请输入权益状态" />
                </Form.Item>
                <Form.Item
                    label="权益过期时间"
                    name="权益过期时间"
                    rules={[{ required: true, message: "请输入权益过期时间" }]}
                >
                    <Input placeholder="请输入权益过期时间" />
                </Form.Item>
            </Form>
            </div>
        </div>
    )
}
