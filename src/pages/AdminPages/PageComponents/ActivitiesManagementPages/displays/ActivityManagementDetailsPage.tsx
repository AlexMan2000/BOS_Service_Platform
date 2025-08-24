import { Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Form, Input, Button, DatePicker, Select } from "antd"
import dayjs from "dayjs"
import styles from "./ActivityManagementDetailsPage.module.less"
import { Activity } from "@/commons/types/activity"

const { TextArea } = Input
const { Option } = Select

export const ActivityManagementDetailsPage = () => {
    const [edit, setEdit] = useState(false)
    const [activityForm] = Form.useForm()

    const location = useLocation()
    const state = location.state as Activity

    useEffect(() => {
        if (state) {
            activityForm.setFieldsValue({
                name: state.name,
                status: state.status,
                startTime: state.startTime ? dayjs(state.startTime) : null,
                endTime: state.endTime ? dayjs(state.endTime) : null,
                description: state.description,
                cover: state.cover,
                accountId: state.accountId,
                balance: state.balance
            })
        }
    }, [state, activityForm])

    const handleSubmit = (values: any) => {
        console.log('Activity form values:', values)
        setEdit(false)
        // Add your form submission logic here
    }

    return (
        <div className={styles.container}>
            {location.pathname === "/admin/activities-management/activity-detail" && <div className={styles.activityDetails}>
                <div className={styles.activityDetailsHeader}>
                    <div className={styles.formControls}>
                        <Button 
                            type="primary" 
                            onClick={() => setEdit(!edit)}
                            style={{ marginBottom: 16 }}
                        >
                            {edit ? "取消" : "编辑"}
                        </Button>
                    </div>
                    
                    <Form
                        disabled={!edit}
                        form={activityForm}
                        className={styles.form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        style={{ maxWidth: 800 }}
                        onFinish={handleSubmit}
                        layout="horizontal"
                    >
                        <Form.Item
                            label="活动名称"
                            name="name"
                            rules={[{ required: true, message: "请输入活动名称" }]}
                            className={styles.formItem}
                        >
                            <Input placeholder="请输入活动名称" />
                        </Form.Item>

                        <Form.Item
                            label="活动状态"
                            name="status"
                            rules={[{ required: true, message: "请选择活动状态" }]}
                        >
                            <Select placeholder="请选择活动状态">
                                <Option value="active">进行中</Option>
                                <Option value="inactive">已结束</Option>
                                <Option value="pending">待开始</Option>
                                <Option value="cancelled">已取消</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="开始时间"
                            name="startTime"
                            rules={[{ required: true, message: "请选择开始时间" }]}
                        >
                            <DatePicker 
                                showTime 
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择开始时间"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="结束时间"
                            name="endTime"
                            rules={[{ required: true, message: "请选择结束时间" }]}
                        >
                            <DatePicker 
                                showTime 
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder="请选择结束时间"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="活动描述"
                            name="description"
                            rules={[{ required: true, message: "请输入活动描述" }]}
                        >
                            <TextArea 
                                placeholder="请输入活动描述" 
                                rows={4}
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            label="封面图片"
                            name="cover"
                            rules={[{ required: true, message: "请输入封面图片链接" }]}
                        >
                            <Input placeholder="请输入封面图片链接" />
                        </Form.Item>

                        <Form.Item
                            label="账户ID"
                            name="accountId"
                            rules={[{ required: true, message: "请输入账户ID" }]}
                        >
                            <Input placeholder="请输入账户ID" />
                        </Form.Item>

                        <Form.Item
                            label="余额"
                            name="balance"
                            rules={[{ required: true, message: "请输入余额" }]}
                        >
                            <Input placeholder="请输入余额" />
                        </Form.Item>

                        {edit && (
                            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                                <Button 
                                    style={{ marginLeft: 8 }} 
                                    onClick={() => setEdit(false)}
                                >
                                    取消
                                </Button>
                            </Form.Item>
                        )}
                    </Form>

                   
                </div>
            </div>}
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}