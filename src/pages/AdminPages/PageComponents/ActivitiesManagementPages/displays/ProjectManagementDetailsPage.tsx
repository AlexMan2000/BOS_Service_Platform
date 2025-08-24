
import { Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Form, Input, Button, InputNumber } from "antd"
import styles from "./ProjectManagementDetailsPage.module.less"
import { Project } from "@/commons/types/activity"

const { TextArea } = Input

export const ProjectManagementDetailsPage = () => {
    const [edit, setEdit] = useState(false)
    const [projectForm] = Form.useForm()

    const location = useLocation()
    const state = location.state as Project

    useEffect(() => {
        if (state) {
            projectForm.setFieldsValue({
                title: state.title,
                amount: state.amount,
                authors: state.authors,
                activityId: state.activityId,
                description: state.description,
                cover: state.cover,
                link: state.link
            })
        }
    }, [state, projectForm])

    const handleSubmit = (values: any) => {
        console.log('Project form values:', values)
        setEdit(false)
        // Add your form submission logic here
    }

    return (
        <div className={styles.container}>
            <div className={styles.projectDetails}>
                <div className={styles.projectDetailsHeader}>
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
                        form={projectForm}
                        className={styles.form}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        style={{ maxWidth: 800 }}
                        onFinish={handleSubmit}
                        layout="horizontal"
                    >
                        <Form.Item
                            label="项目标题"
                            name="title"
                            rules={[{ required: true, message: "请输入项目标题" }]}
                            className={styles.formItem}
                        >
                            <Input placeholder="请输入项目标题" />
                        </Form.Item>

                        <Form.Item
                            label="项目金额"
                            name="amount"
                            rules={[{ required: true, message: "请输入项目金额" }]}
                        >
                            <InputNumber
                                placeholder="请输入项目金额"
                                style={{ width: '100%' }}
                                min={0}
                                precision={2}
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/¥\s?|(,*)/g, '') as any}
                            />
                        </Form.Item>

                        <Form.Item
                            label="项目作者"
                            name="authors"
                            rules={[{ required: true, message: "请输入项目作者" }]}
                        >
                            <Input placeholder="请输入项目作者" />
                        </Form.Item>

                        <Form.Item
                            label="活动ID"
                            name="activityId"
                            rules={[{ required: true, message: "请输入活动ID" }]}
                        >
                            <Input placeholder="请输入活动ID" />
                        </Form.Item>

                        <Form.Item
                            label="项目描述"
                            name="description"
                            rules={[{ required: true, message: "请输入项目描述" }]}
                        >
                            <TextArea 
                                placeholder="请输入项目描述" 
                                rows={4}
                                maxLength={1000}
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
                            label="项目链接"
                            name="link"
                            rules={[
                                { required: true, message: "请输入项目链接" },
                                { type: 'url', message: "请输入有效的URL" }
                            ]}
                        >
                            <Input placeholder="请输入项目链接" />
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
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}
