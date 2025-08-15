import { Certificate } from "@/commons/types/messages";
import styles from "./CertificationCard.module.less";


interface CertificationCardProps {
    certificate: Certificate;
    onClick: () => void;
}



export const CertificationCard = (
    {
        certificate,
        onClick
    }
) => {
    return (
        <div className={styles.certificationCard} onClick={onClick}>
            <div className={styles.certificationCardHeader}>
                <h1>{certificate.name}</h1>
            </div>
        </div>
    )
}



