import { User, UserSubmitType, UserTransferSubmitType } from "@/commons/types/user"
import styles from "./UserListPage.module.less"
import { Button, Input, message, Modal, Space } from "antd"
import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { ProColumns } from "@ant-design/pro-components"
import { Table, Tabs } from "antd"
import Column from "antd/es/table/Column"
import templateUrl from "@/assets/templates/user_batch_import_template.csv?url";
import { GenericEditableTable } from "@/commons/components/BatchImport/GenericEditableTable"
import { GenericCSVFileImport } from "@/commons/components/BatchImport/GenericCSVFileImport"
import { useNavigate } from "react-router-dom"
import { batchTransfer, createAccount, deleteAccount, getAllAccounts, getUserAccountInfo, uploadCSV } from "@/services/accountApi"
import { ResponseCode } from "@/commons/defs/code"
import { useSelector } from "react-redux"
import { selectUser } from "@/store/slice/userSlice/userSlice"

export const UserListPage = () => {

    const navigate = useNavigate()


    const { employeeNo } = useSelector(selectUser)
    const [tableDataSource, setTableDataSource] = useState<User[]>([])
    const { role } = useSelector(selectUser)

    const [batchImportActiveTab, setBatchImportActiveTab] = useState('1')
    const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false)
    const [_, setBatchImportLoading] = useState(false)
    const [batchImportFile, setBatchImportFile] = useState<File | null>(null)
    const [batchImportSaved, setBatchImportSaved] = useState(false)
    const [batchTransferSaved, setBatchTransferSaved] = useState(false)

    // const [batchTransferActiveTab, setBatchTransferActiveTab] = useState('1')
    const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false)


    // Used for batch import
    const [importDataSource, setImportDataSource] = useState<UserSubmitType[]>([])
    const [transferDataSource, setTransferDataSource] = useState<UserTransferSubmitType[]>([])
    // 配置
    const DEFAULT_NEW_ROW_IMPORT = {
        employeeNo: '307' + (Math.random() * 1000).toFixed(0),
        createdBy: '',
        name: '',
        department: '',
    }

    const DEFAULT_NEW_ROW_TRANSFER = {
        employeeNo: '307' + (Math.random() * 1000).toFixed(0),
        amount: 0,
        remark: '',
    }



    const PROCOLUMNS_IMPORT_CONFIGS: ProColumns<UserSubmitType>[] = [
        {
            title: '工号',
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
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            width: 100,
        },
    ]


    const PROCOLUMNS_TRANSGER_CONFIGS: ProColumns<UserTransferSubmitType>[] = [
        {
            title: '工号',
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
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            valueType: 'digit',
            width: 100,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 120,
        }
    ]

    const fetchData = async (pageNum: number = 0, pageSize: number = 10) => {
        const commonResult = await getAllAccounts({ pageNum: pageNum, pageSize: pageSize })

        if (commonResult.code === ResponseCode.SUCCESS) {
            const accountList = commonResult.data;

            const filteredAccountList = accountList.filter((item: any) => item.userId !== null)
            // 查询每个account对应的用户列表
            Promise.all(filteredAccountList.map(async (item: any) => {
                const userList = await getUserAccountInfo(item.userId)
                return userList.data
            })).then((res) => {
                console.log('res', res)
                const userList = res.filter((item: any) => item !=null && item.userId !== null).map((item: any) => {
                    return {
                        ...item,
                        accountId: item.accountId,
                        userId: item.userId,
                        employeeNo: item.employeeNo,
                        name: item.name,
                        department: item.department,
                        balance: item.balance,
                        lastLogin: item.lastLogin,
                        createdTime: item.createdTime,
                        createdBy: item.createdBy,
                        updatedTime: item.updatedTime,
                    }
                })

                console.log('userList', userList)
                setTableDataSource(userList as User[])
            })

        } else {
            message.error(commonResult.message + ", 获取用户列表失败!")
            return
        }

    }

    // Used for fetch data
    useEffect(() => {

        fetchData(0, 10)
    }, [])


    return (
        <div className={styles.container}>
            {/* Modals */}
            <Modal
                open={isBatchImportModalOpen}
                onCancel={() => {
                    setIsBatchImportModalOpen(false)
                    setBatchImportSaved(false)
                }}
                onOk={async () => {
                    if (batchImportActiveTab === '1') {
                        console.log('onOk', importDataSource)
                        if (!batchImportSaved) {
                            message.info("提交任何一行前请先保存！")
                            return
                        }
                        const accountCreateVO: UserSubmitType = {
                            employeeNo: importDataSource[0].employeeNo,
                            name: importDataSource[0].name,
                            department: importDataSource[0].department,
                            createdBy: employeeNo,
                        }

                        const result: any = await createAccount(accountCreateVO)
                        if (result.code === ResponseCode.SUCCESS) {
                            message.success("提交成功！")
                            setBatchImportSaved(false)
                            setIsBatchImportModalOpen(false)
                            fetchData(0, 10)
                        } else {
                            message.error(result.message + ", 提交失败!")
                        }

                        console.log('accountCreateVO', accountCreateVO)
                    } else {
                        console.log('ss')
                        setBatchImportLoading(true)
                        const result = await uploadCSV("account", batchImportFile as File)
                        console.log('result', result)
                        setBatchImportLoading(false)
                    }
                }}
                title="批量导入"
                width={1000}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <Tabs
                            onChange={(key) => {
                                setBatchImportActiveTab(key)
                                setBatchImportFile(null)
                                setImportDataSource([])
                            }}
                            items={[
                                {
                                    key: '1',
                                    label: '表格导入',
                                    children: <GenericEditableTable<UserSubmitType>
                                        dataSource={importDataSource}
                                        setDataSource={setImportDataSource}
                                        columns={PROCOLUMNS_IMPORT_CONFIGS}
                                        rowKey="employeeNo"
                                        recordCreatorProps={false}
                                        defaultNewRow={DEFAULT_NEW_ROW_IMPORT}
                                        editable={{
                                            type: 'multiple',
                                        }}
                                        scroll={{ x: 'max-content', y: 300 }}
                                        size="small"
                                        onSave={async (rowKey: React.Key, data: UserSubmitType, row: UserSubmitType) => {
                                            console.log('Saving row:', rowKey, data, row);
                                            // await wait(1);
                                            setBatchImportSaved(true)
                                        }}
                                        maxRowLength={1}
                                    />
                                },
                                {
                                    key: '2',
                                    label: 'Excel导入',
                                    children: <GenericCSVFileImport
                                        file_url={templateUrl}
                                        download_name="user_import_template.csv"
                                        previewTrigger={batchImportActiveTab}
                                        onUpload={async (file: File) => {
                                            setBatchImportFile(file)
                                            //后端接口
                                            // setIsBatchImportModalOpen(false)
                                            setBatchImportSaved(false)
                                        }} type="account" />
                                }
                            ]} />
                    </div>

                </div>
            </Modal>




            <Modal
                open={isBatchTransferModalOpen}
                onCancel={() => {
                    setIsBatchTransferModalOpen(false)
                    setBatchTransferSaved(false)
                }}
                title="批量发放"
                onOk={async () => {
                    if (!batchTransferSaved) {
                        message.info("提交任何一行前请先保存！")
                        return
                    }
                    console.log('onOk', transferDataSource)
                    const userTransferVO: UserTransferSubmitType[] = transferDataSource.map((item) => { return {
                        employeeNo: item.employeeNo,
                        amount: item.amount,
                        remark: item.remark,
                    }});
                    const result: any = await batchTransfer(userTransferVO);
                    if (result.code === ResponseCode.SUCCESS) {
                        message.success("提交成功！")
                        setBatchTransferSaved(false)
                        setIsBatchTransferModalOpen(false)
                        fetchData(0, 10)
                    } else {
                        message.error(result.message + ", 提交失败!")
                    }
                }}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <Tabs items={[
                            {
                                key: '1',
                                label: '表格导入',
                                children: <GenericEditableTable<UserTransferSubmitType>
                                    dataSource={transferDataSource}
                                    setDataSource={setTransferDataSource}
                                    columns={PROCOLUMNS_TRANSGER_CONFIGS}
                                    rowKey="employeeNo"
                                    recordCreatorProps={false}
                                    defaultNewRow={DEFAULT_NEW_ROW_TRANSFER}
                                    editable={{
                                        type: 'multiple',
                                    }}
                                    scroll={{ x: 'max-content', y: 300 }}
                                    size="small"
                                    onSave={async (rowKey: React.Key, data: UserTransferSubmitType, row: UserTransferSubmitType) => {
                                        console.log('Saving row:', rowKey, data, row);
                                        setBatchTransferSaved(true)
                                    }}
                                    maxRowLength={10}
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
                            setIsBatchImportModalOpen(true)
                        }}
                        >新增用户</Button>
                        {role === "SUPER" && <Button type="primary" onClick={() => {
                            setTransferDataSource([])
                            setIsBatchTransferModalOpen(true)
                        }}>新增发放</Button>}
                    </div>
                </div>
                <Table<User> dataSource={tableDataSource}
                    scroll={{ x: 1000 }}
                >
                    <Column title="姓名" dataIndex="name" key="name" />
                    <Column title="工号" dataIndex="employeeNo" key="employeeNo" />
                    <Column title="部门" dataIndex="department" key="department" />
                    <Column title="余额" dataIndex="balance" key="balance" />
                    <Column title="最后登录时间" dataIndex="lastLogin" key="lastLogin"
                        render={(text: string) => {
                            return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                        }}
                    />
                    <Column title="创建时间" dataIndex="createdTime" key="createdTime"
                        render={(text: string) => {
                            return <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--"}</span>
                        }}
                    />
                    <Column
                        title="操作"
                        key="action"
                        width={150}
                        render={(_: any, record: User) => (
                            <Space size="middle">
                                <Button type="link" size="small" style={{ color: "#1677ff" }} onClick={() => {
                                    navigate("/admin/user-management/user-detail", { state: record })
                                }}>查看</Button>
                                <Button type="link" size="small" style={{ color: "#ff4d4f" }}
                                    onClick={async () => {
                                        //删除用户
                                        await deleteAccount(record.employeeNo)
                                        // 重新获取数据
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
