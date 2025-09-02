import { useNavigate, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Button, Input, message, Modal, Table, Tabs } from "antd"
import { Space } from "antd"
import { Popconfirm } from "antd"
import { Activity, ProjectSubmitType, ProjectTableType } from "@/commons/types/activity"
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { wait } from "@/commons/utils/sys_utils"
import styles from "./ProjectListPage.module.less"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/project_batch_import_template.csv?url";
import { createNewWork, deleteWork, getAllWorks } from "@/services/workApi"
import { ResponseCode } from "@/commons/defs/code"

export const ProjectListPage = () => {
    const navigate = useNavigate()
    const { id, status } = useOutletContext<Activity>();
    console.log("accountId", id)

    const [tableDataSource, setTableDataSource] = useState<ProjectTableType[]>([])
    const [isBatchImportSaved, setIsBatchImportSaved] = useState(false)
    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [batchImportDataSource, setBatchImportDataSource] = useState<ProjectSubmitType[]>([])
    // 配置
    const DEFAULT_NEW_ROW: ProjectSubmitType = {
        title: '',
        authors: '',
        activityId: 0,
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
            title: 'Authors',
            dataIndex: 'authors',
            key: 'authors',
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
            title: 'Cover',
            dataIndex: 'cover',
            key: 'cover',
            width: 100,
        }
    ]

    const fetchData = async () => {
        try {
            const commonResult: any = await getAllWorks({ freeCredit: 1321321, activityId: id })
            if (commonResult.code === ResponseCode.SUCCESS) {
                const data = commonResult.data.workList
                // 确保data是数组
                console.log('data', data)
                if (Array.isArray(data)) {
                    setTableDataSource(data as ProjectTableType[])
                } else {
                    console.warn('API返回的项目数据不是数组:', data)
                    setTableDataSource([])
                }
            } else {
                console.warn('获取项目数据失败:', commonResult)
                setTableDataSource([])
            }
        } catch (error) {
            console.error('获取项目数据失败:', error)
            setTableDataSource([])
        }
    }

    useEffect(() => {
       
        
        if (id && id !== 0) {
            fetchData()
        } else {
            // 如果没有有效的活动ID，清空数据
            setTableDataSource([])
        }
    }, [id])


    console.log(status)


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => setIsBatchImportModalOpen(false)}
                onOk={async () => {
                    console.log('onOk', batchImportDataSource)
                    if (!isBatchImportSaved) {
                        message.error('请先保存行，才能正常提交')
                        return
                    }

                    // 确保batchImportDataSource是数组
                    if (!Array.isArray(batchImportDataSource)) {
                        console.error('batchImportDataSource不是数组:', batchImportDataSource)
                        return
                    }
                    if (batchImportDataSource.length === 0) {
                        console.warn('没有数据需要提交')
                        return
                    }
                    
                    console.log('batchImportDataSource', batchImportDataSource[0])
                    const submitData = batchImportDataSource[0]
                    submitData.activityId = id
                    const commonResult = await createNewWork(submitData)
                    if (commonResult.code === ResponseCode.SUCCESS) {
                        message.success('新增作品成功')
                        setIsBatchImportModalOpen(false)
                        fetchData()
                    } else {
                        message.error('新增作品失败')
                    }
                  

                    // 处理提交逻辑
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
                                    dataSource={Array.isArray(batchImportDataSource) ? batchImportDataSource : []}
                                    setDataSource={(data) => {
                                        if (Array.isArray(data)) {
                                            setBatchImportDataSource(data)
                                        } else {
                                            console.warn('SetDataSource收到非数组数据:', data)
                                            setBatchImportDataSource([])
                                        }
                                    }}
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
                                        setIsBatchImportSaved(true)
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
                        <Button type="primary" 
                        disabled={id === 0 || status !==0}
                        onClick={() => {
                            // 确保清空数据源时设置为空数组
                            setBatchImportDataSource([])
                            setIsBatchImportModalOpen(true)
                        }}
                        >新增作品</Button>
                    </div>
                </div>
                <Table<ProjectTableType> dataSource={tableDataSource}>
                    <Column title="作品id" dataIndex="id" key="id" />
                    <Column title="作品名" dataIndex="title" key="title" /> 
                    <Column title="作者" dataIndex="authors" key="authors" />
                    <Column title="投注总金额" dataIndex="amount" key="amount" />
                    <Column title="描述" dataIndex="description" key="description"
                      render={(text: string) => {
                        return text ? text : "--"
                     }}
                    />
                    <Column title="封面" dataIndex="cover" key="cover" 
                     render={(text: string) => {
                        return text ? text : "--"
                     }}
                    />
                    <Column title="附件链接" dataIndex="link" key="link"
                      render={(text: string) => {
                        return text ? text : "--"
                     }}
                    />
                    <Column
                        title="操作"
                        key="action"
                        width={150}
                            render={(_: any, record: ProjectTableType) => (
                            <Space size="middle">
                                <Button 
                               
                                type="link" size="small"  onClick={() => {
                                    navigate("/admin/activities-management/activity-detail/project-detail", { state: {...record, activityStatus: status} })
                                }}>作品详情</Button>
                                <Popconfirm title="确定删除吗？" onConfirm={async () => {
                                    console.log("删除", record)
                                    // 后端请求
                                    await deleteWork(record.id)
                                    fetchData()
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