import { AutoCompleteProps, Form, Input, Modal, Popconfirm, Button } from "antd"
import { AutoComplete } from "antd"
import { useState } from "react"


interface TransferModalProps {
    transferOpen: boolean,
    setTransferOpen: (open: boolean) => void
    title: string
}
export const TransferModal = ({ transferOpen, setTransferOpen, title }: TransferModalProps) => {
    
    const [transferForm] = Form.useForm()
    const [searchOptions, setSearchOptions] = useState<AutoCompleteProps['options']>([]);

    const handleConfirm = () => {
        transferForm.submit()
    }

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
    )
}