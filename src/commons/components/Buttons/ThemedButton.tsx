import { CSSProperties } from "react";
import ImageBox from "../Image/ImageBox";
import styles from "./ThemedButton.module.less"
import UploadIcon from "@/assets/svgs/upload.svg"

interface ThemedButtonProps {
    inverted?: boolean;
    icon?: boolean;
    iconSrc?: string;
    style?: CSSProperties;
    onClick?: ()=>void;
    text: string;
}

const ThemedButton = (props: ThemedButtonProps) => {
  
  const {inverted, icon, iconSrc, text, onClick, style} = props;

    return (
    <div 
        className={inverted ? styles.invertedContainer: styles.container}
        style={{...style}}
        onClick={()=>{if (onClick) onClick();}}
        >
        {icon && 
        <ImageBox width={30} height={30} padding={3} src={iconSrc || UploadIcon} 
        style={{background:"none", gap:"10px"}}></ImageBox>}
        {text}
    </div>
  );
};

export default ThemedButton;