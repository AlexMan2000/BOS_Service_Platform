import { BenefitCreateVO, Right, RightTableType } from "@/commons/types/right"
import styles from "./RightListPage.module.less"
import { Button, Input, message, Modal, Space, Tag } from "antd"
import { useState, useEffect } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { useNavigate } from "react-router-dom"
import { deleteBenefit, getAllRights } from "@/services/benefitApi"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { createBenefit } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { formatDateTimeToISO } from "@/commons/utils/parser/dateFormatter"
import dayjs from "dayjs"


export const RightListPage = () => {

    const navigate = useNavigate()

    const { employeeNo } = useSelector(selectUser)
    const [tableDataSource, setTableDataSource] = useState<Right[]>([])
    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)

    const [batchImportSaved, setBatchImportSaved] = useState(false)

    const [batchImportDataSource, setBatchImportDataSource] = useState<BenefitCreateVO[]>([])
    // 配置
    const DEFAULT_NEW_ROW: BenefitCreateVO = {
        id: 0,
        name: '权益1',
        description: '权益1',
        price: 30,
        image: '',  
        total: 100,
        remain: 100,
        active: true,
        expDate: null,
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
            valueType: 'digit',
            width: 120,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: 120,
            valueType: 'text',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            valueType: 'digit',
            width: 100,
        },
        {
            title: 'Remaining',
            dataIndex: 'remain',
            key: 'remain',
            valueType: 'digit',
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
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项是必填项',
                    },
                ],
            },
        }
    ]

    const fetchData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResults = await getAllRights({pageNum: pageNum, pageSize: pageSize})
        console.log('data', commonResults)
        const data = commonResults.data as Right[]
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

                    
                    const benefitCreateVOs: BenefitCreateVO[] = batchImportDataSource.map((item) => {

                        return {
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            image: item.image,
                            total: item.total,
                            remain: item.remain,
                            active: item.active,
                            expDate: formatDateTimeToISO(item.expDate ?? ''),
                            createdBy: employeeNo,
                        }
                    })

                    const benefitCreateVO = benefitCreateVOs[0];
                    if (benefitCreateVO.total !== benefitCreateVO.remain) {
                        message.error('总数量和剩余数量不一致')
                        return
                    }
                    const commonResult = await createBenefit(benefitCreateVO)

                    if (commonResult.code === ResponseCode.SUCCESS) {
                        message.success('新增权益成功')
                        setIsBatchImportModalOpen(false)
                        setBatchImportSaved(false)
                        fetchData(0, 10)
                    } else {
                        message.error('新增权益失败')
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
                                        setBatchImportSaved(true)
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
                <Table<Right> dataSource={tableDataSource}
                    scroll={{ x: 1000 }}
                >
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="Description" dataIndex="description" key="description" />
                    <Column title="Price" dataIndex="price" key="price" />
                    <Column title="Image" dataIndex="image" key="image" />
                    <Column title="Total" dataIndex="total" key="total" />
                    <Column title="Remaining" dataIndex="remain" key="remain" />
                    <Column title="Status" dataIndex="active" key="active" render={(text: boolean) => {
                        return <Tag color={text ? "green" : "red"}>{text ? "Active" : "Inactive"}</Tag>
                    }} />
                    <Column title="Exp Date" dataIndex="expDate" key="expDate" 
                    render={(text: string) => {
                        return dayjs(text).format("YYYY-MM-DD HH:mm:ss") 
                    }}
                    />
                    <Column title="Created Time" dataIndex="createdTime" key="createdTime" 
                    render={(text: string) => {
                        return dayjs(text).format("YYYY-MM-DD HH:mm:ss") 
                    }}
                    />
                    <Column title="Created By" dataIndex="createdBy" key="createdBy" />
                    <Column title="Updated Time" dataIndex="updatedTime" key="updatedTime" 
                    render={(text: string) => {
                        return dayjs(text).format("YYYY-MM-DD HH:mm:ss") 
                    }}
                    />
                    <Column title="Deleted" dataIndex="deleted" key="deleted" render={(text: boolean) => {
                        return <Tag color={text ? "red" : "green"}>{text ? "是" : "否"}</Tag>
                    }} />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                        fixed="right"
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
