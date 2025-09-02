import { PersonalTransferVO } from "@/commons/types/txn"
import { Form, Input, Modal, Popconfirm, Button, InputNumber, message } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { personalTransfer } from "@/services/txnApi"
import { ResponseCode } from "@/commons/defs/code"
import { getUserBalance } from "@/services/accountApi"
import { setUserInfo } from "@/store/slice/userSlice/userSlice"


interface TransferModalProps {
    transferOpen: boolean,
    setTransferOpen: (open: boolean) => void
    title: string
}
export const TransferModal = ({ transferOpen, setTransferOpen, title }: TransferModalProps) => {

    const [transferForm] = Form.useForm()

    const handleConfirm = () => {
        transferForm.submit()
    }

    const { userId } = useSelector(selectUser)
    const dispatch = useDispatch()  
    const customFooter = [
        <Button key="cancel" onClick={() => setTransferOpen(false)}>
            取消
        </Button>,
        <Popconfirm
            key="submit"
            title="确认转账"
            description="您确定要提交这笔转账吗？"
            onConfirm={handleConfirm}
            okText="确认提交"
            cancelText="取消"
        >
            <Button type="primary">
                确定
            </Button>
        </Popconfirm>
    ]

    return (
        <Modal
            title={title}
            open={transferOpen}
            onCancel={() => {
                setTransferOpen(false)
            }}
            footer={customFooter}>
            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 600 }}
                form={transferForm}

                onFinish={async () => {
                    console.log(transferForm.getFieldsValue())

                    const personalTransferVO: PersonalTransferVO = {
                        targetEmployeeNo: transferForm.getFieldValue("targetEmployeeNo"),
                        amount: transferForm.getFieldValue("amount"),
                        reason: transferForm.getFieldValue("reason"),
                        createdBy: Number(userId)
                    }
                    const result: any = await personalTransfer(personalTransferVO)
                    if (result.code === ResponseCode.SUCCESS) {
                        const balanceResult: any = await getUserBalance(userId)
                        if (balanceResult.code === ResponseCode.SUCCESS) {
                            const balance = balanceResult.data
                            dispatch(setUserInfo({
                                balance: balance
                            }))
                        }
                        message.success("转账成功！")
                        setTransferOpen(false)
                    } else {
                        message.error(result.message + ", 转账失败!")
                    }
                    setTransferOpen(false)

                }}>
                <Form.Item label="他/她的工号" name="targetEmployeeNo" rules={[{ required: true, message: "请输入目标账号" }]}>
                    <Input
                        placeholder="请输入工号"
                        onChange={(e) => {
                            const value = e.target.value
                            // 网络请求
                            console.log(value)
                        }}
                    />
                </Form.Item>
                <Form.Item label="转账金额" name="amount" rules={[{ required: true, message: "请输入转账金额" }]}>
                    <InputNumber placeholder="请输入转账金额" />
                </Form.Item>
                <Form.Item label="转账事由" name="reason" rules={[{ required: true, message: "请输入转账备注" }]}>
                    <Input.TextArea placeholder="请输入转账备注" />
                </Form.Item>
            </Form>
        </Modal>
    )
}