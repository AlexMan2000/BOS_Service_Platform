import styles from "./ActivityListPage.module.less"
import { Button, Input, Modal, Popconfirm, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/user_batch_transfer_template.csv?url";
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { wait } from "@/commons/utils/sys_utils"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { useNavigate } from "react-router-dom"
import { ActivitySubmitType, Activity, ActivityTableType, ActivityTransferSubmitType } from "@/commons/types/activity"


export const ActivityListPage = () => {
    const navigate = useNavigate()

    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false)

    const [batchImportDataSource, setBatchImportDataSource] = useState<ActivitySubmitType[]>([])
    const [batchTransferDataSource, setBatchTransferDataSource] = useState<ActivityTransferSubmitType[]>([])
    // 配置
    const DEFAULT_NEW_ROW: ActivitySubmitType = {
        name: '',
        freeCredit: '',
        cover: '',
        description: '',
        link: '',
        startTime: '',
        endTime: '',
    }

    const DEFAULT_NEW_ROW_TRANSFER: ActivityTransferSubmitType = {
        accountId: '',
        balance: '',
    }


    const PROCOLUMNS_IMPORT_CONFIGS: ProColumns<ActivitySubmitType>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            title: 'Free Credit',
            dataIndex: 'freeCredit',
            key: 'freeCredit',
            width: 100,
        },
        {
            title: 'Cover',
            dataIndex: 'cover',
            key: 'cover',
            width: 120,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 120,
            valueType: 'select',
            valueEnum: {
                admin: { text: 'Admin', status: 'Success' },
                user: { text: 'User', status: 'Default' },
            },
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            width: 100,
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 100,
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 100,
        }
    ]


    const PROCOLUMNS_TRANSGER_CONFIGS: ProColumns<ActivityTransferSubmitType>[] = [
        {
            title: 'Account ID',
            dataIndex: 'accountId',
            key: 'accountId',
        },
    ]


    // 默认数据
    const DEFAULT_DATA_DISPLAY: ActivityTableType[] = [
        {
            name: "活动1",
            description: "活动1描述",
            freeCredit: "100",
            cover: "活动1图片",
            link: "活动1链接",
            startTime: "2021-01-01",
            endTime: "2021-01-01",
            status: "offline",
        },
        {
            name: "活动2",
            description: "活动2描述",
            freeCredit: "200",
            cover: "活动2图片",
            link: "活动2链接",
            startTime: "2021-01-01",
            endTime: "2021-01-01",
            status: "online",
        },
    ]

    useEffect(() => {
        console.log("reload table data", DEFAULT_DATA_DISPLAY)
    }, [])


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => setIsBatchImportModalOpen(false)}
                onOk={() => {
                    console.log('onOk', batchImportDataSource)
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
                                children: <GenericEditableTable<ActivitySubmitType>
                                    dataSource={batchImportDataSource}
                                    setDataSource={setBatchImportDataSource}
                                    columns={PROCOLUMNS_IMPORT_CONFIGS}
                                    rowKey="name"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: ActivitySubmitType, row: ActivitySubmitType) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        await wait(1);
                                    }}
                                />
                            },
                            {
                                key: '2',
                                label: 'Excel导入',
                                children: <GenericCSVFileImport file_url={templateUrl} download_name="activity_import_template.csv" onUpload={() => { }} />
                            }
                        ]}

                        />
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
                                children: <GenericEditableTable<ActivityTransferSubmitType>
                                    dataSource={batchTransferDataSource}
                                    setDataSource={setBatchTransferDataSource}
                                    columns={PROCOLUMNS_TRANSGER_CONFIGS}
                                    rowKey="employeeNo"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW_TRANSFER}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: ActivityTransferSubmitType, row: ActivityTransferSubmitType) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        await wait(1);
                                    }}
                                />
                            },
                            {
                                key: '2',
                                label: 'Excel导入',
                                children: <GenericCSVFileImport file_url={templateUrl} download_name="activity_transfer_template.csv" onUpload={() => { }} />
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
                            setBatchImportDataSource([])
                            setIsBatchImportModalOpen(true)
                        }}
                        >新增活动</Button>
                        <Button type="primary" onClick={() => {
                            setBatchTransferDataSource([])
                            setIsBatchTransferModalOpen(true)
                        }}
                        >批量发放</Button>
                    </div>
                </div>
                <Table<ActivityTableType> dataSource={DEFAULT_DATA_DISPLAY}
                    scroll={{ x: 1000 }}
                >
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Free Credit" dataIndex="freeCredit" key="freeCredit" />
                    <Column title="Cover" dataIndex="cover" key="cover" />
                    <Column title="Link" dataIndex="link" key="link" />
                    <Column title="Start Time" dataIndex="startTime" key="startTime" />
                    <Column title="End Time" dataIndex="endTime" key="endTime" />
                    <Column title="Status" dataIndex="status" key="status" render={(text: string) => {
                        return <Tag color={text === "online" ? "green" : "red"}>{text}</Tag>
                    }} />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                        render={(_: any, record: ActivityTableType) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} onClick={() => {
                                    navigate("/admin/activities-management/activity-detail", { state: record })
                                }}>详情</Button>
                                <Button type="link" size="small" style={{ color: "green" }}
                                    onClick={() => {
                                        console.log("上线", record)
                                        // 后端请求
                                    }}
                                >{record.status === "online" ? "下线" : "上线"}</Button>
                                <Popconfirm title="确定删除吗？" onConfirm={() => {
                                    console.log("删除", record)
                                    // 后端请求
                                }}>
                                    <Button type="link" size="small" style={{ color: "#ff4d4f" }} >删除</Button>
                                </Popconfirm>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    )
}
