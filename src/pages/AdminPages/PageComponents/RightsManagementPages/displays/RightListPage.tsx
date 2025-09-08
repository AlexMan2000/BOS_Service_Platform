import { BenefitCreateVO, BenefitCodeListVO, Right } from "@/commons/types/right"
import styles from "./RightListPage.module.less"
import { Button, Input, message, Modal, Space, Tag, Popconfirm } from "antd"
import { useState, useEffect } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { useNavigate } from "react-router-dom"
import { deleteBenefit, getAllRights, listAllBenefitCodesAdmin, checkAllBenefitCodes } from "@/services/benefitApi"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"
import { createBenefit } from "@/services/benefitApi"
import { ResponseCode } from "@/commons/defs/code"
import { formatDateTimeToISO } from "@/commons/utils/parser/dateFormatter"
import dayjs from "dayjs"

export const RightListPage = () => {

    const navigate = useNavigate()

    const { employeeNo, userId } = useSelector(selectUser)
    const [tableDataSource, setTableDataSource] = useState<Right[]>([])
    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)

    const [batchImportSaved, setBatchImportSaved] = useState(false)
    const [activeTab, setActiveTab] = useState(0); // 0 is management, 1 is check benefit

    const [batchImportDataSource, setBatchImportDataSource] = useState<BenefitCreateVO[]>([])


    const [benefitCodeDataSource, setBenefitCodeDataSource] = useState<BenefitCodeListVO[]>([])


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
            title: '权益名称',
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
            title: '权益描述',
            dataIndex: 'description',
            key: 'description',
            width: 100,
        },
        {
            title: '权益价格',
            dataIndex: 'price',
            key: 'price',
            valueType: 'digit',
            width: 120,
        },
        {
            title: '权益图片',
            dataIndex: 'image',
            key: 'image',
            width: 120,
            valueType: 'text',
        },
        {
            title: '总量',
            dataIndex: 'total',
            key: 'total',
            valueType: 'digit',
            width: 100,
        },
        {
            title: '剩余数量',
            dataIndex: 'remain',
            key: 'remain',
            valueType: 'digit',
            width: 100,
        },
        {
            title: '状态',
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
            title: '过期时间',
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

    const fetchBenefitData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResults = await getAllRights({ pageNum: pageNum, pageSize: pageSize })
        console.log('data', commonResults)
        const data = commonResults.data as Right[]
        setTableDataSource(data as Right[])
    }

    const fetchBenefitCodeData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResults = await listAllBenefitCodesAdmin({ pageNum: pageNum, pageSize: pageSize })
        console.log('data', commonResults)
        if (commonResults.code === ResponseCode.SUCCESS) {
            const data = commonResults.data as BenefitCodeListVO[]
            setBenefitCodeDataSource(data as BenefitCodeListVO[])
        } else {
            message.error("操作失败");
        }
    }

    const handleCheckAllBenefits = async () => {
        try {
            // 获取所有未核销的兑换码 (status为true表示未核销)
            const unredeemedCodes = benefitCodeDataSource
                .filter(item => item.status === 1)
                .map(item => item.code)

            if (unredeemedCodes.length === 0) {
                message.info('没有未核销的兑换码')
                return
            }

            // 调用全部核销API
            const checkBenefitCodeVO = {
                codes: unredeemedCodes,
                redeemedBy: userId
            }

            const result = await checkAllBenefitCodes(checkBenefitCodeVO)
            
            if (result.code === ResponseCode.SUCCESS) {
                message.success(`成功核销 ${unredeemedCodes.length} 个兑换码`)
                // 重新加载数据
                fetchBenefitCodeData(0, 10)
            } else {
                message.error(result.message || '核销失败')
            }
        } catch (error) {
            console.error('核销失败:', error)
            message.error('核销失败，请重试')
        }
    }

    const handleCheckSingleBenefit = async (code: string) => {
        try {
            // 调用单个核销API，注意codes是一个数组
            const checkBenefitCodeVO = {
                codes: [code], // 即使只有一个元素也要传递数组
                redeemedBy: userId
            }

            const result = await checkAllBenefitCodes(checkBenefitCodeVO)
            
            if (result.code === ResponseCode.SUCCESS) {
                message.success('核销成功')
                // 重新加载数据
                fetchBenefitCodeData(0, 10)
            } else {
                message.error(result.message || '核销失败')
            }
        } catch (error) {
            console.error('核销失败:', error)
            message.error('核销失败，请重试')
        }
    }

    useEffect(() => {
        if (activeTab === 0) { // management
            fetchBenefitData(0, 10)
        } else {
            fetchBenefitCodeData(0, 10) // check benefit
        }
    }, [activeTab])


    console.log('benefitCodeDataSource', benefitCodeDataSource)

    return (
        <div className={styles.container}>

            <Tabs activeKey={activeTab.toString()} onChange={(key) => {
                setActiveTab(Number(key))
            }}>
                <Tabs.TabPane tab="管理" key="0"></Tabs.TabPane>
                <Tabs.TabPane tab="核销" key="1"></Tabs.TabPane>
            </Tabs>

                         {activeTab === 1 && <div className={styles.checkBenenfitContent}>
                                 <div className={styles.checkBenenfitContentHeader}>
                    <div className={styles.checkBenenfitContentHeaderTitle}>兑换码核销管理</div>
                    <Popconfirm
                        title="确认全部核销"
                        description={`确定要核销所有 ${benefitCodeDataSource.filter(item => item.status === 1).length} 个未核销的兑换码吗？`}
                        onConfirm={handleCheckAllBenefits}
                        okText="确认"
                        cancelText="取消"
                        disabled={benefitCodeDataSource.filter(item => item.status === 1).length === 0}
                    >
                        <Button 
                            type="primary" 
                            danger
                            disabled={benefitCodeDataSource.filter(item => item.status === 1).length === 0}
                        >
                            全部核销 ({benefitCodeDataSource.filter(item => item.status === 1).length})
                        </Button>
                    </Popconfirm>
                </div>
                 <div className={styles.divider}></div>
                <Table<BenefitCodeListVO> 
                    dataSource={benefitCodeDataSource} 
                    className={styles.table}
                    scroll={{ x: 1000 }}
                >
                    <Column title="权益名称" dataIndex="benefitName" key="benefitName" />
                    <Column title="兑换码" dataIndex="code" key="code" />
                    <Column title="权益账户id" dataIndex="accountId" key="accountId" />
                    <Column title="权益id" dataIndex="benefitId" key="benefitId" />
                    <Column title="过期时间" dataIndex="expDate" key="expDate"
                        render={(text: string) => {
                            return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                        }}
                    />
                    <Column title="状态" dataIndex="status" key="status" render={(text: boolean) => {
                        return <Tag color={text ? "red" : "green"}>{text ? "未核销" : "已核销"}</Tag>
                    }} />
                    <Column
                        title="操作"
                        key="action"
                        width={120}
                        fixed="right"
                        render={(_: any, record: BenefitCodeListVO) => (
                            <Space size="middle">
                                {record.status === 1 ? (
                                    <Popconfirm
                                        title="确认核销"
                                        description="确定要核销这个兑换码吗？"
                                        onConfirm={() => handleCheckSingleBenefit(record.code)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link" size="small" style={{ color: "#ff4d4f" }}>
                                            核销
                                        </Button>
                                    </Popconfirm>
                                ) : (
                                    <Button type="link" size="small" disabled style={{ color: "#d9d9d9" }}>
                                        已核销
                                    </Button>
                                )}
                            </Space>
                        )}
                    />

                </Table>
            </div>}


            {activeTab === 0 && <div className={styles.managementContent}>
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
                            fetchBenefitData(0, 10)
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


                <div className={styles.header}>
                    <div className={styles.search}>
                        <Input placeholder="搜索" />
                    </div>
                    <div className={styles.addUser}>
                        <Button type="primary" onClick={() => {
                            setBatchImportDataSource([])
                            setIsBatchImportModalOpen(true)
                        }}
                        >新增权益</Button>
                    </div>
                </div>
                <Table<Right> dataSource={tableDataSource}
                    scroll={{ x: 1000 }}
                >
                    <Column title="权益名称" dataIndex="name" key="name" />
                    <Column title="权益描述" dataIndex="description" key="description" />
                    <Column title="权益价格" dataIndex="price" key="price" />
                    <Column title="权益图片" dataIndex="image" key="image" />
                    <Column title="总量" dataIndex="total" key="total" />
                    <Column title="剩余数量" dataIndex="remain" key="remain" />
                    <Column title="状态" dataIndex="active" key="active" render={(text: boolean) => {
                        return <Tag color={text ? "green" : "red"}>{text ? "Active" : "Inactive"}</Tag>
                    }} />
                    <Column title="过期时间" dataIndex="expDate" key="expDate"
                        render={(text: string) => {
                            return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
                        }}
                    />
                    <Column title="创建时间" dataIndex="createdTime" key="createdTime"
                        render={(text: string) => {
                            return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
                        }}
                    />
                    <Column title="创建者" dataIndex="createdBy" key="createdBy" />
                    <Column title="Updated Time" dataIndex="updatedTime" key="updatedTime"
                        render={(text: string) => {
                            return dayjs(text).format("YYYY-MM-DD HH:mm:ss")
                        }}
                    />
                    <Column title="是否删除" dataIndex="deleted" key="deleted" render={(text: boolean) => {
                        return <Tag color={text ? "red" : "green"}>{text ? "是" : "否"}</Tag>
                    }} />
                    <Column
                        title="操作"
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
                                        await fetchBenefitData(0, 10)
                                    }}
                                >删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>}
        </div>
    )
}
