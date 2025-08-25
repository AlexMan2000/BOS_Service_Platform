
import { User } from "@/commons/types/user"
import styles from "./UserListPage.module.less"
import { Button, Input, Modal, Space } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/user_batch_import_template.csv?url";
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { wait } from "@/commons/utils/sys_utils"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { useNavigate } from "react-router-dom"

export const UserListPage = () => {

    const navigate = useNavigate()

    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false)

    const [importDataSource, setImportDataSource] = useState<User[]>([])
    const [transferDataSource, setTransferDataSource] = useState<User[]>([])
    // 配置
    const DEFAULT_NEW_ROW = {
        employeeNo: (Math.random() * 1000000).toFixed(0),
        password: '',
        phone: '',
        role: 'user',
        name: '',
        department: '',
        balance: '0',
        deleted: false,
        lastLogin: '',
        createdTime: new Date().toISOString(),
        createdBy: 'admin',
        updatedTime: new Date().toISOString()
    }



    const PROCOLUMNS_IMPORT_CONFIGS: ProColumns<User>[] = [
        {
            title: 'Employee No',
            dataIndex: 'employeeNo',
            key: 'employeeNo',
            width: 120,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            valueType: 'select',
            valueEnum: {
                admin: { text: 'Admin', status: 'Success' },
                user: { text: 'User', status: 'Default' },
            },
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            width: 100,
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            width: 100,
        },
    ]


    const PROCOLUMNS_TRANSGER_CONFIGS: ProColumns<User>[] = [
        {
            title: 'Employee No',
            dataIndex: 'employeeNo',
            key: 'employeeNo',
            width: 120,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
        },
        {
            title: 'money',
            dataIndex: 'money',
            key: 'money',
            width: 100,
        },
        {
            title: 'reason',
            dataIndex: 'reason',
            key: 'reason',
            width: 120,
        }
    ]



    // 默认数据
    const DEFAULT_DATA_DISPLAY: User[] = [
        {
            employeeNo: "1234567890",
            password: "123456",
            phone: "1234567890",
            role: "admin",
            name: "张三",
            department: "技术部",
            balance: "1000",
            deleted: false,
            lastLogin: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin",
            updatedTime: "2021-01-01"
        },
        {
            employeeNo: "1234567891",
            password: "123456",
            phone: "1234567891",
            role: "user",
            name: "李四",
            department: "技术部",
            balance: "1000",
            deleted: false,
            lastLogin: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin",
            updatedTime: "2021-01-01"
        },
    ]


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => setIsBatchImportModalOpen(false)}
                onOk={() => {
                    console.log('onOk', importDataSource)
                }}
                title="批量导入"
                width={1000}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <Tabs items={[
                            {
                                key: '1',
                                label: '表格导入',
                                children: <GenericEditableTable<User>
                                    dataSource={importDataSource}
                                    setDataSource={setImportDataSource}
                                    columns={PROCOLUMNS_IMPORT_CONFIGS}
                                    rowKey="employeeNo"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: User, row: User) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        await wait(1);
                                    }}
                                />
                            },
                            {
                                key: '2',
                                label: 'Excel导入',
                                children: <GenericCSVFileImport file_url={templateUrl} download_name="user_import_template.csv" onUpload={() => { }} />
                            }
                        ]} />
                    </div>

                </div>
            </Modal>


            

            <Modal
                open={isBatchTransferModalOpen}
                onCancel={() => setIsBatchTransferModalOpen(false)}
                title="批量发放"
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <Tabs items={[
                            {
                                key: '1',
                                label: '表格导入',
                                children: <GenericEditableTable<User>
                                    dataSource={transferDataSource}
                                    setDataSource={setTransferDataSource}
                                    columns={PROCOLUMNS_TRANSGER_CONFIGS}
                                    rowKey="employeeNo"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: User, row: User) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        await wait(1);
                                    }}
                                />
                            },
                            {
                                key: '2',
                                label: 'Excel导入',
                                children: <GenericCSVFileImport file_url={templateUrl} download_name="user_import_template.csv" onUpload={() => { }} />
                            }
                        ]} />
                    </div>

                </div>
            </Modal>


            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.search}>
                        <Input placeholder="搜索" />
                    </div>
                    <div className={styles.addUser}>
                        <Button type="primary" onClick={() => {
                            setImportDataSource([])
                            setIsBatchImportModalOpen(true)}}
                        >新增用户</Button>
                        <Button type="primary" onClick={() => {
                            setTransferDataSource([])
                            setIsBatchTransferModalOpen(true)
                        }}>新增发放</Button>
                    </div>
                </div>
                <Table<User> dataSource={DEFAULT_DATA_DISPLAY}
                    scroll={{ x: 1000 }}
                    >
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Employee No" dataIndex="employeeNo" key="employeeNo" />
                    <Column title="Department" dataIndex="department" key="department" />
                    <Column title="Balance" dataIndex="balance" key="balance" />
                    <Column title="Last Login" dataIndex="lastLogin" key="lastLogin"
                        render={(text: string) => {
                            return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                        }}
                    />
                    <Column title="Created Time" dataIndex="createdTime" key="createdTime" />
                    <Column title="Created By" dataIndex="createdBy" key="createdBy" />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                        render={(_: any, record: User) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} onClick={() => {
                                    navigate("/admin/user-management/user-detail", { state: record })
                                }}>查看</Button>
                                <Button type="link" size="small" style={{ color: "#ff4d4f" }} >删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    )
}
