import styles from "./ActivityListPage.module.less"
import { Button, Input, message, Modal, Popconfirm, Space, Tag } from "antd"
import { useEffect, useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/user_batch_transfer_template.csv?url";
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { wait } from "@/commons/utils/sys_utils"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { useNavigate } from "react-router-dom"
import { ActivitySubmitType, ActivityTableType, ActivityTransferSubmitType } from "@/commons/types/activity"
import { createActivity, deleteActivity, getAllActivities, updateActivity } from "@/services/activityApi"
import dayjs from "dayjs"
import { ResponseCode } from "@/commons/defs/code"
import { formatDateTime } from "@/commons/utils/parser/dateFormatter"
export const ActivityListPage = () => {
    const navigate = useNavigate()

    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false)
    const [tableDataSource, setTableDataSource] = useState<ActivityTableType[]>([])
    const [batchImportSaved, setBatchImportSaved] = useState(false)
    const [batchImportDataSource, setBatchImportDataSource] = useState<ActivitySubmitType[]>([])
    const [batchTransferDataSource, setBatchTransferDataSource] = useState<ActivityTransferSubmitType[]>([])
    // 配置 
    const DEFAULT_NEW_ROW: ActivitySubmitType = {
        id: 0,
        accountId: 0,
        balance: '',
        status: 0,
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString(),
        name: '活动1',
        freeCredit: '',
        cover: '',
        description: '',
        link: '',
        startTime: new Date().toISOString(),  
        endTime: new Date().toISOString(),
    }

    const DEFAULT_NEW_ROW_TRANSFER: ActivityTransferSubmitType = {
        accountId: 0,
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
            valueType: 'text',
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
            valueType: 'date',
            width: 100,
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
            valueType: 'date',
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


    const fetchData = async () => {
        try {
            const data = await getAllActivities()
            console.log('data', data)
            // 确保data是数组
            if (Array.isArray(data)) {
                setTableDataSource(data as ActivityTableType[])
            } else {
                console.warn('API返回的数据不是数组:', data)
                setTableDataSource([])
            }
        } catch (error) {
            console.error('获取活动数据失败:', error)
            setTableDataSource([])
        }
    }
    useEffect(() => {
        
        fetchData()
        console.log("reload table data", tableDataSource)
    }, [])


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => {
                    setBatchImportSaved(false)
                    setIsBatchImportModalOpen(false)
                }}
                onOk={async () => {
                    if (!batchImportSaved) {
                        message.error('请先保存行，才能正常提交')
                        return
                    }
                    if (batchImportDataSource.length === 0) {
                        message.error('请先导入数据')
                        return
                    }
                    const sumitActivityVOs: ActivitySubmitType[] = (Array.isArray(batchImportDataSource) ? batchImportDataSource : []).map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            freeCredit: item.freeCredit,
                            cover: item.cover,
                            description: item.description,
                            link: item.link,
                            startTime: formatDateTime(item.startTime),
                            endTime: formatDateTime(item.endTime),
                            accountId: item.accountId,
                            balance: item.balance,
                            status: item.status,
                            createdTime: formatDateTime(item.createdTime),
                            updatedTime: formatDateTime(item.updatedTime),
                        }
                    })

                    const sumitActivityVO = sumitActivityVOs[0];
                    const commonResult = await createActivity(sumitActivityVO)
                    if (commonResult.code === ResponseCode.SUCCESS) {
                        message.success('新增活动成功')
                    } else {
                        message.error('新增活动失败')
                    }
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
                                        setBatchImportSaved(true)
                                    }}
                                />
                            },
                            // {
                            //     key: '2',
                            //     label: 'Excel导入',
                            //     children: <GenericCSVFileImport file_url={templateUrl} download_name="activity_import_template.csv" onUpload={() => { }} type="activity" />
                            // }
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
                                children: <GenericCSVFileImport file_url={templateUrl} download_name="activity_transfer_template.csv" onUpload={() => { }} type="activity" />
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
                <Table<ActivityTableType> dataSource={tableDataSource}
                    scroll={{ x: 1000 }}
                >
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Free Credit" dataIndex="freeCredit" key="freeCredit" />
                    <Column title="Cover" dataIndex="cover" key="cover" />
                    <Column title="Link" dataIndex="link" key="link" />
                    <Column title="Start Time" dataIndex="startTime" key="startTime" 
                    render={(text: Date) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                    />
                    <Column title="End Time" dataIndex="endTime" key="endTime" 
                    render={(text: Date) => {
                        return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                    }}
                    />
                    <Column title="Status" dataIndex="status" key="status" render={(text: number) => {
                        return <Tag color={text === 1 ? "green" : text === 2 ? "red" : "blue"}>{text === 1 ? "进行中" : text === 2 ? "已结束" : "未开始"}</Tag>
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
                                    onClick={async () => {
                                        console.log("上线", record)
                                        // 后端请求
                                        try {
                                            await updateActivity({...record, status: record.status === 1 ? 2 : 1})
                                            await fetchData()
                                        } catch (error) {
                                            console.log("更新失败", error)
                                            message.error("更新失败")
                                        }
                                    }}
                                >{record.status === 1 ? "结束" : "开始"}</Button>
                                <Popconfirm title="确定删除吗？" onConfirm={async () => {
                                    console.log("删除", record)
                                    await deleteActivity(record.id)
                                    await fetchData()
                                }}>
                                    <Button type="link" size="small" style={{ color: "#ff4d4f" }} 
                                    onClick={async () => {
                                 
                                    }}
                                    >删除</Button>
                                </Popconfirm>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    )
}
