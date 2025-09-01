import styles from "./RightManagementDetailsPage.module.less"
import { useLocation } from "react-router-dom"
import { Right } from "@/commons/types/right"
import { useEffect, useState } from "react"
import { Form, Input, message } from "antd"
import { updateBenefit } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"

export const RightManagementDetailsPage = () => {
    const {id,name, description, price, image, total, remain, active, expDate } = useLocation().state as Right

    useEffect(() => {
        userForm.setFieldsValue({
            "name": name,
            "description": description,
            "price": price,
            "image": image,
            "total": total,
            "remain": remain,
            "active": active,
            "expDate": expDate
        })
    }, [])

    const [userForm] = Form.useForm()
    const [edit, setEdit] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.content}>    
            <div className={styles.header}>
                <div className={styles.edit} onClick={() => {
                    if (edit) {
                        console.log(userForm.getFieldValue("name"))
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
                onFinish={async () => {
                    console.log(userForm.getFieldsValue())
                    const commonResult = await updateBenefit({...userForm.getFieldsValue(), id: id})
                    if (commonResult.code === ResponseCode.SUCCESS) {
                        message.success("更新成功")
                    } else {
                        message.error("更新失败")
                    }
                    setEdit(!edit)
                }}
            >
                <Form.Item
                    label="权益名称"
                    name="name"
                    rules={[{ required: true, message: "请输入权益名称" }]}
                    className={styles.formItem}
                >

                    <Input placeholder="请输入权益名称" />
                </Form.Item>
                <Form.Item
                    label="权益描述"
                    name="description"
                    rules={[{ required: true, message: "请输入权益描述" }]}>
                    <Input placeholder="请输入权益描述" />
                </Form.Item>
                <Form.Item
                    label="权益价格"
                    name="price"
                    rules={[{ required: true, message: "请输入权益价格" }]}>
                    <Input placeholder="请输入权益价格" />
                </Form.Item>
                <Form.Item
                    label="权益图片"
                    name="image"
                    rules={[{ required: false, message: "请输入权益图片" }]}
                >
                    <Input placeholder="请输入权益图片连接" />
                </Form.Item>
                <Form.Item
                    label="权益总量"
                    name="total"
                    rules={[{ required: true, message: "请输入权益总量" }]}
                >
                    <Input placeholder="请输入权益总量" />
                </Form.Item>
                <Form.Item
                    label="权益剩余"
                    name="remain"
                    rules={[{ required: true, message: "请输入权益剩余" }]}
                >
                    <Input placeholder="请输入权益剩余" />
                </Form.Item>
                <Form.Item
                    label="权益状态"
                    name="active"
                    rules={[{ required: true, message: "请输入权益状态" }]}
                >
                    <Input placeholder="请输入权益状态" />
                </Form.Item>
                <Form.Item
                    label="权益过期时间"
                    name="expDate"
                    rules={[{ required: true, message: "请输入权益过期时间" }]}
                >
                    <Input placeholder="请输入权益过期时间" />
                </Form.Item>
            </Form>
            </div>
        </div>
    )
}
