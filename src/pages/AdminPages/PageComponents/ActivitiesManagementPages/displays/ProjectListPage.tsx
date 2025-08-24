import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Button, Input, Modal, Table, Tabs } from "antd"
import { Space } from "antd"
import { Popconfirm } from "antd"
import { ProjectSubmitType, ProjectTableType } from "@/commons/types/activity"
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { wait } from "@/commons/utils/sys_utils"
import styles from "./ProjectListPage.module.less"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/project_batch_import_template.csv?url";


export const ProjectListPage = () => {
    const navigate = useNavigate()

    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [batchImportDataSource, setBatchImportDataSource] = useState<ProjectSubmitType[]>([])
    // 配置
    const DEFAULT_NEW_ROW: ProjectSubmitType = {
        title: '',
        authors: '',
        activityId: '',
        cover: '',
        description: '',
        link: '',
    }

    const PROCOLUMNS_IMPORT_CONFIGS: ProColumns<ProjectSubmitType>[] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
        },
        {
            title: 'Authors',
            dataIndex: 'authors',
            key: 'authors',
            width: 100,
        },
        {
            title: 'Activity ID',
            dataIndex: 'activityId',
            key: 'activityId',
            width: 100,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 120,
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

    


    // 默认数据
    const DEFAULT_DATA_DISPLAY: ProjectTableType[] = [
        {
            title: "作品1",
            amount: 100,
            authors: "作品1作者",
            activityId: "作品1活动ID",
            description: "作品1描述",
            cover: "作品1图片",
            link: "作品1链接",
            createdTime: "2021-01-01",
            updatedTime: "2021-01-01",
        },
        {
            title: "作品2",
            amount: 200,
            authors: "作品2作者",
            activityId: "作品2活动ID",
            description: "作品2描述",
            cover: "作品2图片",
            link: "作品2链接",
            createdTime: "2021-01-01",
            updatedTime: "2021-01-01",
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
                                children: <GenericEditableTable<ProjectSubmitType>
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
                                    onSave={async (rowKey: React.Key, data: ProjectSubmitType, row: ProjectSubmitType) => {
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
                        >新增作品</Button>
                    </div>
                </div>
                <Table<ProjectTableType> dataSource={DEFAULT_DATA_DISPLAY}>
                    <Column title="Title" dataIndex="title" key="title" /> 
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Amount" dataIndex="amount" key="amount" />
                    <Column title="Cover" dataIndex="cover" key="cover" />
                    <Column title="Link" dataIndex="link" key="link" />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                            render={(_: any, record: ProjectTableType) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} onClick={() => {
                                    navigate("/admin/activities-management/activity-detail/project-detail", { state: record })
                                }}>作品详情</Button>
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