import { Button, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import templateUrl from "@/assets/templates/user_import_template.csv?url";
import styles from "./GenericCSVFileImport.module.less"


interface GenericCSVFileImportProps {
    file_url: string
    download_name: string
    onUpload: (file: File) => void
}

export const GenericCSVFileImport = (props: GenericCSVFileImportProps) => {
    const { file_url, download_name, onUpload } = props

    return (
        <div className={styles.excelImport} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '10px' }}>
            <a href={file_url} download={download_name} style={{ color: '#1677ff', textDecoration: 'underline' }}>
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
}
