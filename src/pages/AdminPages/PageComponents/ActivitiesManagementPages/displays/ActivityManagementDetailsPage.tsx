import { Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Form, Input, Button, DatePicker, Select, InputNumber } from "antd"
import dayjs from "dayjs"
import styles from "./ActivityManagementDetailsPage.module.less"
import { Activity } from "@/commons/types/activity"
import { exportActivityFlowData, getActivityById, updateActivity } from "@/services/activityApi"
import { message } from "antd"
import { ResponseCode } from "@/commons/defs/code"
const { TextArea } = Input
const { Option } = Select

export const ActivityManagementDetailsPage = () => {
    const [edit, setEdit] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [activityForm] = Form.useForm()

    const location = useLocation()
    const state = location.state as Activity

    console.log("actibitydetails page state", state)

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
                freeCredit: state.freeCredit
            })
        }
    }, [state])

    const handleSubmit = async (values: any) => {
        console.log('Activity form values:', values)
        setEdit(false)
        // Add your form submission logic here
        const commonResult = await updateActivity({ ...values, id: state.id })
        if (commonResult.code === ResponseCode.SUCCESS) {
            message.success("更新成功")
        } else {
            message.error("更新失败")
        }

    }

    const stateToChild = { ...state, status: state.status };

    console.log("stateToChild", stateToChild)

    return (
        <div className={styles.container}>
            {location.pathname === "/admin/activities-management/activity-detail" && <div className={styles.activityDetails}>
                <div className={styles.activityDetailsHeader}>
                    <div className={styles.export}>
                        <Button 
                            type="primary" 
                            loading={exporting}
                            onClick={async () => {
                                try {
                                    setExporting(true)
                                    const commonResult = await exportActivityFlowData(state.id)
                                    if (commonResult.code === 200) {
                                        message.success("导出成功")
                                    } else {
                                        message.error("导出失败")
                                    }
                                } catch (error: any) {
                                    console.error("Export error:", error)
                                    message.error("导出失败，请重试")
                                } finally {
                                    setExporting(false)
                                }
                            }}
                        >
                            导出明细
                        </Button>
                    </div>
                    <div className={styles.formControls}>
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (edit) {
                                    setEdit(!edit)
                                } else {
                                    if (state.status !== 0) {
                                        message.error("活动已开始，无法编辑活动")
                                        return
                                    }
                                    const commonResult = await getActivityById(state.id)
                                    if (commonResult.code === ResponseCode.SUCCESS) {
                                        const data = commonResult.data as Activity
                                        activityForm.setFieldsValue({
                                            name: data.name,
                                            status: data.status,
                                            startTime: data.startTime ? dayjs(data.startTime) : null,
                                            endTime: data.endTime ? dayjs(data.endTime) : null,
                                            description: data.description,
                                            cover: data.cover,
                                            accountId: data.accountId,
                                            freeCredit: data.freeCredit
                                        })
                                    }
                                    setEdit(!edit)
                                }
                            }}
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
                            rules={[{ required: false, message: "请输入活动描述" }]}
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
                            rules={[{ required: false, message: "请输入封面图片链接" }]}
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
                            label="免费额度"
                            name="freeCredit"
                            rules={[{ required: true, message: "请输入余额" }]}
                        >
                            <InputNumber placeholder="请输入余额" />
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
                <Outlet context={stateToChild} />
            </div>
        </div>
    )
}