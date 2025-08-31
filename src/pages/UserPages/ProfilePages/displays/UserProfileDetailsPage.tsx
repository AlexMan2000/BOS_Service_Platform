import { AutoComplete, AutoCompleteProps, Form, Input, Modal } from "antd"
import styles from "./UserProfileDetailsPage.module.less"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { TransactionOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { TransferModal } from "@/commons/components/Modal/TransferModal"

export const UserProfileDetailsPage = () => {
    const navigate = useNavigate()

    const [userForm] = Form.useForm()
    const [edit, setEdit] = useState(false)
    const [transferOpen, setTransferOpen] = useState(false)

    const { employeeNo, name, department, phone, balance} = useSelector(selectUser)
    

    useEffect(() => {
        userForm.setFieldsValue({
            "employeeNo": employeeNo,
            "name": name,
            "department": department,
            "phone": phone,
            "balance": balance
        })
    }, [])
    console.log("employeeNo", employeeNo, "name", name, "department", department, "phone", phone, "balance", balance)

    return (
        <div className={styles.container}>
            <TransferModal
                title="转账"
                transferOpen={transferOpen}
                setTransferOpen={setTransferOpen}
            />
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
                    name="employeeNo"
                    rules={[{ required: true, message: "请输入用户名" }]}
                    className={styles.formItem}
                >

                    <Input placeholder="请输入用户名"  />
                </Form.Item>
                <Form.Item
                    label="用户名"
                    name="name"
                    rules={[{ required: true, message: "请输入用户名" }]}>
                    <Input placeholder="请输入用户名"  />
                </Form.Item>
                <Form.Item
                    label="部门"
                    name="department"
                    rules={[{ required: true, message: "请输入部门" }]}>
                    <Input placeholder="请输入部门"  />
                </Form.Item>
                <Form.Item
                    label="稳定币余额"
                    name="balance"
                    rules={[{ required: true, message: "请输入稳定币余额" }]}
                >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px" }}>
                        <Input placeholder="请输入稳定币余额" disabled />
                        <TransactionOutlined style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => {
                            setTransferOpen(true)
                        }} />
                    </div>
                </Form.Item>
                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[{ required: true, message: "请输入手机号" }]}
                >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px" }}>
                        <Input placeholder="请输入手机号" disabled />
                        <TransactionOutlined style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => {
                            setTransferOpen(true)
                        }} />
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}