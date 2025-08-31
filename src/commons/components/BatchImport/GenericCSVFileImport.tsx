import { Button, Upload, Table, Card, Space, Typography, Divider } from "antd"
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import styles from "./GenericCSVFileImport.module.less"
import { downloadTemplate } from "@/services/accountApi"

const { Text } = Typography

interface GenericCSVFileImportProps {
    file_url: string
    download_name: string
    type?: string
    onUpload: (file: File) => void
    previewTrigger?: any
}

interface CSVPreviewData {
    fileName: string
    fileSize: string
    data: any[]
    columns: any[]
}

export const GenericCSVFileImport = (props: GenericCSVFileImportProps) => {
    const { type, onUpload, previewTrigger } = props
    const [csvPreview, setCsvPreview] = useState<CSVPreviewData | null>(null)

    useEffect(() => {
        setCsvPreview(null)
    }, [previewTrigger])

    const parseCSVFile = (file: File): Promise<CSVPreviewData> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string
                    const lines = text.split('\n').filter(line => line.trim())
                    
                    if (lines.length === 0) {
                        reject(new Error('文件为空'))
                        return
                    }

                    // 解析CSV头部（第一行）
                    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
                    
                    // 生成表格列配置
                    const columns = headers.map((header, index) => ({
                        title: header,
                        dataIndex: `col${index}`,
                        key: `col${index}`,
                        width: 150,
                        ellipsis: true,
                    }))

                    // 解析数据行（最多显示前50行）
                    const dataRows = lines.slice(1, 51).map((line, rowIndex) => {
                        const values = line.split(',').map(value => value.trim().replace(/"/g, ''))
                        const rowData: any = { key: rowIndex }
                        
                        headers.forEach((_, colIndex) => {
                            rowData[`col${colIndex}`] = values[colIndex] || ''
                        })
                        
                        return rowData
                    })

                    const fileSize = (file.size / 1024).toFixed(2) + ' KB'
                    
                    resolve({
                        fileName: file.name,
                        fileSize,
                        data: dataRows,
                        columns
                    })
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = () => reject(new Error('文件读取失败'))
            reader.readAsText(file, 'UTF-8')
        })
    }

    const handleFileUpload = async (file: File) => {
        try {
            const previewData = await parseCSVFile(file)
            setCsvPreview(previewData)
            onUpload(file)
        } catch (error) {
            console.error('文件解析失败:', error)
            setCsvPreview(null)
            onUpload(file)
        }
    }

    const clearPreview = () => {
        setCsvPreview(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.uploadSection}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div 
                        onClick={async () => {
                            await downloadTemplate(type || "account")
                        }} 
                        className={styles.downloadLink}
                    >
                        下载模板
                    </div>
                    
                    <Space>
                        <Upload
                            accept=".csv"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                handleFileUpload(file as File)
                                return false
                            }}
                        >
                            <Button icon={<UploadOutlined />}>上传CSV文件</Button>
                        </Upload>
                        
                        {csvPreview && (
                            <Button 
                                icon={<DeleteOutlined />} 
                                onClick={clearPreview}
                                type="text"
                                danger
                            >
                                清除预览
                            </Button>
                        )}
                    </Space>
                </Space>
            </div>

            {csvPreview && (
                <div className={styles.previewSection}>
                    <Divider />
                    <Card 
                        title={
                            <Space>
                                <EyeOutlined />
                                <span>文件预览</span>
                            </Space>
                        }
                        size="small"
                        className={styles.previewCard}
                    >
                        <div className={styles.fileInfo}>
                            <Space split={<Divider type="vertical" />}>
                                <Text><strong>文件名:</strong> {csvPreview.fileName}</Text>
                                <Text><strong>文件大小:</strong> {csvPreview.fileSize}</Text>
                                <Text><strong>数据行数:</strong> {csvPreview.data.length}</Text>
                                <Text type="secondary">
                                    {csvPreview.data.length >= 50 ? '(仅显示前50行)' : ''}
                                </Text>
                            </Space>
                        </div>
                        
                        <div className={styles.tableContainer}>
                            <Table
                                columns={csvPreview.columns}
                                dataSource={csvPreview.data}
                                pagination={false}
                                scroll={{ x: true, y: 300 }}
                                size="small"
                                bordered
                                className={styles.previewTable}
                            />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
