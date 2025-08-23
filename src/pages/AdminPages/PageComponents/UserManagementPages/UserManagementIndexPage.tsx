import { User } from "@/commons/types/user"
import styles from "./UserManagementIndexPage.module.less"
import { BreadCrumb } from "@/commons/components/Routers/BreadCrumb"
import { Button, Input, Modal, Space, Upload } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import { UploadOutlined } from "@ant-design/icons"
import templateUrl from "@/assets/templates/user_import_template.csv?url";
import { GenericEditableTable } from "@/commons/components/Table/GenericEditableTable"
import {wait} from "@/commons/utils/sys_utils"


export const UserManagementIndexPage = () => {

    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false)

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
    const [dataSource, setDataSource] = useState<User[]>([])

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

    const BREADCRUMBS_CONFIGS = [
        {
            pathname: "/admin",
            crumb: "管理员"
        },

        {
            pathname: "/admin/user-management",
            crumb: "用户管理"
        },
        {
            pathname: "/admin/user-management/user-detail",
            crumb: "用户列表"
        },
    ]

    const PROCOLUMNS_CONFIGS: ProColumns<User>[] = [
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
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (_, record, __, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.employeeNo);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.employeeNo !== record.employeeNo));
                    }}
                >
                    删除
                </a>,
            ],
        },
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

    // 表格导入
    const TableImport = () => (
        <GenericEditableTable<User>
            columns={PROCOLUMNS_CONFIGS}
            dataSource={dataSource}
            setDataSource={setDataSource}
            editableKeys={editableKeys}
            setEditableRowKeys={setEditableRowKeys}
            rowKey="employeeNo"
            recordCreatorProps={false}
            defaultNewRow={DEFAULT_NEW_ROW}
            editable={{
                type: 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
            }}
            onSave={async (rowKey: React.Key, data: User, row: User) => {
                console.log('Saving row:', rowKey, data, row);
                await wait(1);
            }}
            onChange={(value) => setDataSource([...value])}
        />
    )

    // Excel导入
    const ExcelImport = () => (
        <div className={styles.excelImport} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '10px' }}>
            <a href={templateUrl} download="user_import_template.csv" style={{ color: '#1677ff', textDecoration: 'underline' }}>
                下载模板
            </a>
            <Upload
                accept=".csv"
                showUploadList={false}
                beforeUpload={() => {
                    return false
                }}
            >
                <Button icon={<UploadOutlined />}>上传CSV文件</Button>
            </Upload>
        </div>
    )


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => setIsBatchImportModalOpen(false)}
                title="批量导入"
                width={1000}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <Tabs items={[
                            {
                                key: '1',
                                label: '表格导入',
                                children: TableImport()
                            },
                            {
                                key: '2',
                                label: 'Excel导入',
                                children: ExcelImport()
                            }
                        ]} />
                    </div>

                </div>
            </Modal>

            <Modal
                open={isBatchTransferModalOpen}
                onCancel={() => setIsBatchTransferModalOpen(false)}
                title="批量转账"
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h2>新增发放</h2>
                    </div>
                </div>
            </Modal>


            <div className={styles.breadcrumbs}>
                <BreadCrumb items={BREADCRUMBS_CONFIGS} />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.search}>
                        <Input placeholder="搜索" />
                    </div>
                    <div className={styles.addUser}>
                        <Button type="primary" onClick={() => setIsBatchImportModalOpen(true)}>新增用户</Button>
                        <Button type="primary" onClick={() => setIsBatchTransferModalOpen(true)}>新增发放</Button>
                    </div>
                </div>
                <Table<User> dataSource={DEFAULT_DATA_DISPLAY}>
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
                        render={(_: any, __: User) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} >查看</Button>
                                <Button type="link" size="small" style={{ color: "#ff4d4f" }} >删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    )
}
