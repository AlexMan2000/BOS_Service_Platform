
import { CSSProperties, ReactNode, useRef, useState } from "react";
import "./DragButton.css"
import { classNamesArgs } from "@/commons/utils/classNameHandler";
import { getStyles, pagePos } from "@/commons/utils/draggingHandler";

interface BounceButtonProps {
    children?: ReactNode;
    bgColor?: string; 
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
    width? :number;
    height?: number;
    draggable?: boolean;
    clickCallback?: () => any
    style?: CSSProperties;
    className?: string;
}


const DragButton = ({children, bgColor, top, right, left, bottom, width, height, draggable = false, clickCallback, style, className}: BounceButtonProps) => {

    const buttonRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const offsetTop = useRef<number>(0);
    const offsetLeft = useRef<number>(0);

    const handleOnMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.preventDefault();
        
        if (draggable) {
            // 获取鼠标相对于元素左上角的位置，用于拖拽跟随, pagePos(获取的是鼠标相对于document文档流的坐标)
            offsetLeft.current = pagePos(event).X - parseInt(getStyles(buttonRef.current, 'left'))
            offsetTop.current = pagePos(event).Y - parseInt(getStyles(buttonRef.current, 'top'))
            document.addEventListener("mousemove", handleOnMouseMove)
            document.addEventListener("mouseup", handleOnMouseUp);
        }
        setIsMouseDown(true);
    }


    const handleOnMouseUp = (event): void => {
        event.preventDefault();
        setIsMouseDown(false);
        if (draggable) {
            document.removeEventListener('mousemove', handleOnMouseMove)
            document.removeEventListener('mouseup', handleOnMouseUp)
        }
        
        // Handle logic
        if (clickCallback) {
            clickCallback();
        }
        
    }


    const handleOnMouseMove = (event): void => {
        event.preventDefault();
        buttonRef.current!.style.top = `${pagePos(event).Y - offsetTop.current}px`;
        buttonRef.current!.style.left =`${pagePos(event).X - offsetLeft.current}px`
    }


    const handleOnMouseClick = (event) => {
        event.preventDefault();
        // log goes here
        if (clickCallback) {
            clickCallback();
        }
    }

    return (
        <div className={classNamesArgs("bounce-button", className, isMouseDown ? "mousedown": "")}
            ref={buttonRef}
            onMouseDown={handleOnMouseDown}
            onMouseUp={handleOnMouseUp}
            onClick = {draggable ? handleOnMouseClick: () => {}}
            style= {
                {
                    top: `${top}px`,
                    right: `${right}px`,
                    left: `${left}px`,
                    bottom: `${bottom}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: bgColor,
                    ...style
                }
            }
        >
            {children}
        </div>
    )


}


export default DragButton;