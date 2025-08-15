import { Certificate } from "@/commons/types/messages";
import styles from "./MiniCertificationCard.module.less";

interface MiniCertificationCardProps {
    certificate: Certificate;
    onClick: () => void;
}

export const MiniCertificationCard = (props: MiniCertificationCardProps) => {

    const { certificate, onClick } = props;

    return (
        <div className={styles.container} onClick={() => {
            onClick();
        }}>
            <h1>Mini Certification Card</h1>
        </div>
    )
}

