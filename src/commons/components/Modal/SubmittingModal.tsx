import { Modal, Spin } from "antd";
import { CheckCircleFilled } from '@ant-design/icons';
// import styles from "./SubmittingModal.module.less";
const SubmittingModal = (props: {
    isSubmitting: boolean;
    showSuccess: boolean;
    submittingMessage: string;
    successMessage: string;
}) => {

    const { isSubmitting, showSuccess, submittingMessage, successMessage } = props;
    return (
        <Modal
            open={isSubmitting || showSuccess}
            closable={false}
            footer={null}
            centered
            maskClosable={false}
            width={300}
        >
            {isSubmitting ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: '20px' }}>{submittingMessage}</p>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CheckCircleFilled style={{ fontSize: '48px', color: '#52c41a' }} />
                    <p style={{ marginTop: '20px' }}>{successMessage}</p>
                </div>
            )}
        </Modal>
    )
}

export default SubmittingModal;