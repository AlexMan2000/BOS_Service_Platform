
import { CSSProperties, useState } from "react";
import DefaultImage from "@/assets/svgs/image-placeholder.svg"
import "./ImageBox.css"
import { classNamesArgs } from "@/commons/utils/formatters/classNameHandler";


interface ImageBoxProps {
    src: string;
    padding?: number;
    masked?: boolean;
    maskAttr?: {[key: string] :string}
    width?: number;
    height?: number;
    backgrounded?: boolean;
    keepAspectRatio?: boolean;
    style?: CSSProperties;
    onClick?: Function;
    className?: string;
}


const ImageBox = ({src, masked, maskAttr, width, height, padding, backgrounded,  keepAspectRatio,onClick, style, className}: ImageBoxProps) => {
    const [loadError, setLoadError] = useState<boolean>(false);
    const objectFit = keepAspectRatio? "cover":"fill";  
    const background = backgrounded? "rgba(244, 244, 244, 0.73)":"none";

    return (
        <div className={classNamesArgs("image-container", className)}
        onClick={()=>{onClick && onClick()}}
            style={
                {width: `${width}px`, height: `${height}px`, padding:padding+"px", background, ...style}
            }
        >
            {
                !loadError ? 
                <img
                    className={classNamesArgs("image", className)}
                    src = {src}
                    style={
                        {
                            objectFit,
                            
                        }
                    }
                    onError = {()=>{
                        setLoadError(true)
                    }}
                ></img>
                :
                <img 
                    className={classNamesArgs("image", className)}
                    src={DefaultImage}
                    style={
                        {
                            objectFit
                        }
                    }
                    >
                </img> 
            }
            {
                masked && <div className={classNamesArgs("image-container-mask", className)}
                    style={
                        {...maskAttr}
                    }
                ></div>
            }
        </div>
    )
}


export default ImageBox;