import { BenefitCreateVO, Right, RightTableType } from "@/commons/types/right"
import styles from "./RightListPage.module.less"
import { Button, Input, Modal, Space, Tag } from "antd"
import { useState, useEffect } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { wait } from "@/commons/utils/sys_utils"
import { useNavigate } from "react-router-dom"
import { deleteBenefit, getAllRights } from "@/services/benefitApi"


export const RightListPage = () => {

    const navigate = useNavigate()

    const [tableDataSource, setTableDataSource] = useState<Right[]>([])
    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)

    const [batchImportDataSource, setBatchImportDataSource] = useState<BenefitCreateVO[]>([])
    // 配置
    const DEFAULT_NEW_ROW: BenefitCreateVO = {
        id: 0,
        name: '',
        description: '',
        price: '0',
        image: '',  
        total: '0',
        remain: 0,
        active: true,
        expDate: new Date(),
        createdBy: 'admin',
    }



    const PROCOLUMNS_CONFIGS: ProColumns<BenefitCreateVO>[] = [
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 120,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 100,
        },
        {
            title: 'Remaining',
            dataIndex: 'remain',
            key: 'remain',
            width: 100,
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            width: 100,
            valueType: 'select',
            valueEnum: {
                true: { text: 'Active', status: 'Success' },
                false: { text: 'Inactive', status: 'Default' },
            },
        },
        {
            title: 'Exp Date',
            dataIndex: 'expDate',
            key: 'expDate',
            width: 120,
            valueType: 'date',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 100,
        },
    ]



    // 默认数据, 到时候可以删掉
    const DEFAULT_DATA_DISPLAY: RightTableType[] = [
        {
            id: 1,
            name: "权益1",
            description: "权益1描述",
            price: 100,
            image: "权益1图片",
            total: 100,
            remain: 100,
            active: true,
            expDate: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin",
            updatedTime: "2021-01-01",
            deleted: false,
            status: 'active',
        },
        {
            id: 2,
            name: "权益2",
            description: "权益2描述",
            price: 200,
            image: "权益2图片",
            total: 200,
            remain: 200,
            active: true,
            expDate: "2021-01-01",
            createdTime: "2021-01-01",
            createdBy: "admin",
            updatedTime: "2021-01-01",
            deleted: false,
            status: 'active',
        },
    ]

    const fetchData = async (pageNum: number = 0, pageSize: number = 10) => {
        const data = await getAllRights({pageNum: pageNum, pageSize: pageSize})
        console.log('data', data)
        setTableDataSource(data as Right[])
    }
    useEffect(() => {
       
        fetchData(0, 10)
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
                                children: <GenericEditableTable<BenefitCreateVO>
                                    dataSource={batchImportDataSource}
                                    setDataSource={setBatchImportDataSource}
                                    columns={PROCOLUMNS_CONFIGS}
                                    rowKey="name"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: BenefitCreateVO, row: BenefitCreateVO) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        await wait(1);
                                    }}
                                    maxRowLength={1}
                                />
                            },
                            // {
                            //     key: '2',
                            //     label: 'Excel导入',
                            //     children: <GenericCSVFileImport file_url={templateUrl} download_name="right_import_template.csv" onUpload={() => { }} />
                            // }
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
                            setIsBatchImportModalOpen(true)}}
                        >新增权益</Button>
                    </div>
                </div>
                <Table<Right> dataSource={DEFAULT_DATA_DISPLAY}
                    scroll={{ x: 1000 }}
                >
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Price" dataIndex="price" key="price" />
                    <Column title="Image" dataIndex="image" key="image" />
                    <Column title="Total" dataIndex="total" key="total" />
                    <Column title="Remaining" dataIndex="remain" key="remain" />
                    <Column title="Status" dataIndex="status" key="status" />
                    <Column title="Exp Date" dataIndex="expDate" key="expDate" />
                    <Column title="Created Time" dataIndex="createdTime" key="createdTime" />
                    <Column title="Created By" dataIndex="createdBy" key="createdBy" />
                    <Column title="Updated Time" dataIndex="updatedTime" key="updatedTime" />
                    <Column title="Deleted" dataIndex="deleted" key="deleted" render={(text: boolean) => {
                        return <Tag color={text ? "red" : "green"}>{text ? "是" : "否"}</Tag>
                    }} />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                        render={(_: any, record: Right) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} onClick={() => {
                                    navigate("/admin/rights-management/right-detail", { state: record })
                                }}>查看</Button>
                                <Button type="link" size="small" style={{ color: "#ff4d4f" }} 
                                onClick={async () => {
                                    await deleteBenefit(record.id)
                                    await fetchData(0, 10)
                                }}
                                >删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </div>
    )
}
