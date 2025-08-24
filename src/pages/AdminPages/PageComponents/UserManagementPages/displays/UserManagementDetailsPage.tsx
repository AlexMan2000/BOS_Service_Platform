import styles from "./UserManagementDetailsPage.module.less"
import { AutoComplete, AutoCompleteProps, Form, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { TransactionOutlined } from "@ant-design/icons"
import { useLocation } from "react-router-dom"
import { TransferModal } from "@/commons/components/Modal/TransferModal"
import { User } from "@/commons/types/user"


export const UserManagementDetailsPage = () => {

    const { employeeNo, name, department, balance } = useLocation().state as User


    useEffect(() => {
        userForm.setFieldsValue({
            "工号": employeeNo,
            "用户名": name,
            "部门": department,
            "稳定币余额": balance
        })
    }, [])

    const [userForm] = Form.useForm()
    const [edit, setEdit] = useState(false)
    const [transferOpen, setTransferOpen] = useState(false)

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
                    name="工号"
                    rules={[{ required: true, message: "请输入用户名" }]}
                    className={styles.formItem}
                >

                    <Input placeholder="请输入用户名"  />
                </Form.Item>
                <Form.Item
                    label="用户名"
                    name="用户名"
                    rules={[{ required: true, message: "请输入用户名" }]}>
                    <Input placeholder="请输入用户名"  />
                </Form.Item>
                <Form.Item
                    label="部门"
                    name="部门"
                    rules={[{ required: true, message: "请输入部门" }]}>
                    <Input placeholder="请输入部门"  />
                </Form.Item>
                <Form.Item
                    label="稳定币余额"
                    name="稳定币余额"
                    rules={[{ required: true, message: "请输入稳定币余额" }]}
                >
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "10px" }}>
                        <Input placeholder="请输入稳定币余额" disabled />
                        <TransactionOutlined style={{ fontSize: "20px", cursor: "pointer" }} onClick={() => {
                            setTransferOpen(true)
                        }} />
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}