import styles from "./PopupModal.module.less";
import { useEffect, useRef, useState } from "react";
import { Portal } from "@/commons/components/StackContext/Portal";

interface PopupModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    extraCloseTrigger?:boolean
    noBackground?: boolean;
    inputStyle?: React.CSSProperties;
    modalStyle?: React.CSSProperties;
    usePortal?: boolean;
}

export const PopupModal = ({ 
    open, 
    onClose, 
    children, 
    inputStyle, 
    noBackground, 
    modalStyle, 
    extraCloseTrigger,
    usePortal 
}: PopupModalProps) => {
    const [isRendered, setIsRendered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!extraCloseTrigger) {
            return;
        }
        if (!isRendered) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
                setIsRendered(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isRendered, onClose]);

    useEffect(() => {
        if (open) {
            // console.log("haha")
            setIsRendered(true);
            // Timeout to allow the component to mount before adding the 'open' class
            const timeoutId = setTimeout(() => setIsActive(true), 10);
            return () => clearTimeout(timeoutId);
        } else {
            setIsActive(false);
            // Wait for fade-out transition to finish before un-rendering
            const timeoutId = setTimeout(() => setIsRendered(false), 300); // Match CSS transition duration
            return () => clearTimeout(timeoutId);
        }
    }, [open]);


    const modalContent = (
        <div
            className={`${styles.overlay} ${noBackground ? styles.noBackground : ''} ${isActive ? styles.open : ''}`}
            style={inputStyle}
            onClick={onClose}>
            <div className={styles.modal}
                ref={modalRef}
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );


    // Use Portal by default (usePortal !== false), but allow disabling it
    if (usePortal !== false) {
        return <Portal>{modalContent}</Portal>;
    }

    // Render directly without Portal for relative positioning
    return modalContent;

    // if (!isRendered) return null;

    // return (
    //     <Portal>
    //         <div
    //             className={`${styles.overlay} ${noBackground ? styles.noBackground : ''} ${isActive ? styles.open : ''}`}
    //             style={inputStyle}
    //             onClick={onClose}>
    //             <div className={styles.modal}
    //                 ref={modalRef}

    //                 style={modalStyle}
    //                 onClick={(e) => e.stopPropagation()}>
    //                 {children}
    //             </div>
    //         </div>
    //     </Portal>
    // );
};