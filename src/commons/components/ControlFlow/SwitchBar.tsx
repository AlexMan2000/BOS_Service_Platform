import styles from "./SwitchBar.module.less"
import CheckedIcon from "@/assets/svgs/checked.svg"
import CompletedIcon from "@/assets/svgs/completed.svg"
import DashedLine from "@/assets/dashedLine.png"

interface SwitchBarProps {
    currTabIndex: number
    tabTexts: string[]
    onTabClickCallback?: (newTabIndex: number) => void;
}


const SwitchBar = (props: SwitchBarProps) => {
    const { currTabIndex, tabTexts, onTabClickCallback } = props;


    const tabTextsWithLines = tabTexts.join("#").replace(/\#/g, "#line#").split("#");


    const stateToIcon = (renderIndex: number, currentTabIndex: number): string => {
        if (renderIndex !== currentTabIndex) {
            return CheckedIcon
        } else {
            
            return CompletedIcon;
        }
    }

    return (
        <div className={styles.container}>
            {tabTextsWithLines.map((text, index) => {
                return (
                    <div key={index} className={styles.tabContainer} onClick={() => {
                            onTabClickCallback && onTabClickCallback(index / 2)
                    }}>
                        <div className={text === "line" ? styles.tabLine : styles.tabIcon}>
                            <img src={text === "line" ? DashedLine : stateToIcon(index / 2, currTabIndex)}></img>
                        </div>
                        {text !== "line" && <div className={index / 2 === currTabIndex ? styles.tabTextChecked : styles.tabText}>{text}</div>}
                    </div>
                )

            })}
        </div>
    );
};

export default SwitchBar;