import { AutoComplete, AutoCompleteProps, Form, Input, Modal } from "antd"
import styles from "./UserDetailsPage.module.less"
import { useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { TransactionOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

export const UserDetailsPage = () => {
    const navigate = useNavigate()

    const [userForm] = Form.useForm()
    const [transferForm] = Form.useForm()
    const [edit, setEdit] = useState(false)
    const [transferOpen, setTransferOpen] = useState(false)


    const [searchOptions, setSearchOptions] = useState<AutoCompleteProps['options']>([]);

    const { employeeNo, name, department, createdTime, createdBy, lastLogin, balance, role, isAuthenticated } = useSelector(selectUser)




    return (
        <div className={styles.container}>
            <Modal
                title="转账"
                open={transferOpen}
                onCancel={() => {
                    setTransferOpen(false)
                }}
                onOk={() => {
                    transferForm.submit()
                }}>
                <Form form={transferForm} onFinish={() => {
                    console.log(transferForm.getFieldsValue())
                    setTransferOpen(false)
                }}>
                    <Form.Item label="目标账号类型" name="targetType" rules={[{ required: true, message: "请输入目标账号类型" }]}>
                        <Input placeholder="请输入目标账号类型" />
                    </Form.Item>
                    <Form.Item label="目标账号" name="targetAccount" rules={[{ required: true, message: "请输入目标账号" }]}>
                        <AutoComplete
                            options={searchOptions}
                            placeholder="请输入目标账号"
                            onSearch={(value) => {
                                // 网络请求
                                setSearchOptions([{ label: value, value: value }])
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="转账金额" name="amount" rules={[{ required: true, message: "请输入转账金额" }]}>
                        <Input placeholder="请输入转账金额" />
                    </Form.Item>
                    <Form.Item label="转账事由" name="remark" rules={[{ required: true, message: "请输入转账备注" }]}>
                        <Input.TextArea placeholder="请输入转账备注" />
                    </Form.Item>
                </Form>
            </Modal>
            <div className={styles.header}>
                <div className={styles.edit} onClick={() => {
                    if (edit) {
                        console.log(userForm.getFieldValue("用户名"))
                        userForm.submit()
                    } else {
                        setEdit(!edit)
                    }
                }
                }>
                    {edit ? "保存" : "编辑"}
                </div>
            </div>
            <Form
                disabled={!edit}
                form={userForm}
                className={styles.form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
                onFinish={() => {
                    console.log(userForm.getFieldsValue())
                    setEdit(!edit)
                }}
            >
                <Form.Item
                    label="工号"
                    name="工号"
                    rules={[{ required: true, message: "请输入用户名" }]}
                    className={styles.formItem}
                >

                    <Input placeholder="请输入用户名" value={name} />
                </Form.Item>
                <Form.Item
                    label="用户名"
                    name="用户名"
                    rules={[{ required: true, message: "请输入用户名" }]}>
                    <Input placeholder="请输入用户名" value={name} />
                </Form.Item>
                <Form.Item
                    label="部门"
                    name="部门"
                    rules={[{ required: true, message: "请输入部门" }]}>
                    <Input placeholder="请输入部门" value={department} />
                </Form.Item>
                <Form.Item
                    label="稳定币余额"
                    name="稳定币余额"
                    rules={[{ required: true, message: "请输入稳定币余额" }]}
                >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px" }}>
                        <Input placeholder="请输入稳定币余额" value={balance} disabled />
                        <TransactionOutlined style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => {
                            setTransferOpen(true)
                        }} />
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}