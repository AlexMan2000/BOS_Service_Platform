import styles from "./TimelineBar.module.less"
import CheckedIcon from "@/assets/svgs/checked.svg"
import CompletedIcon from "@/assets/svgs/completed.svg"
import DashedLine from "@/assets/dashedLine.png"
// import { useIntl } from "react-intl"

interface TimelineBarProps {
    currTabIndex: number
    currTabState: boolean // false is unsaved, true is saved
    tabTexts: string[]
    onTabClickCallback?: (newTabIndex: number) => void;
}

const TimelineBar = (props: TimelineBarProps) => {

    const { currTabIndex, currTabState, tabTexts, onTabClickCallback } = props;

    const tabTextsWithLines = tabTexts.join("#").replace(/\#/g, "#line#").split("#");
    // const intl = useIntl();

    const stateToIcon = (renderIndex: number, currentTabIndex: number, currentTabState: boolean): string => {
        if (renderIndex > currentTabIndex) {
            return ""
        } else if (renderIndex === currentTabIndex) {
            if (currentTabState === false) {
                return CheckedIcon;
            } else {
                return CompletedIcon;
            }
        } else {
            return CompletedIcon;
        }
    }

    return (
        <div className={styles.container}>
            {tabTextsWithLines.map((text, index) => {
                return (
                    <div key={index} className={styles.tabContainer} onClick={() => {
                        const targetIndex = index / 2;
                        if (onTabClickCallback && targetIndex <= currTabIndex)
                            onTabClickCallback(index / 2)
                    }}>
                        <div className={text === "line" ? styles.tabLine : styles.tabIcon}>
                            <img src={text === "line" ? DashedLine : stateToIcon(index / 2, currTabIndex, currTabState)}></img>
                        </div>
                        {text !== "line" && <div className={index / 2 === currTabIndex ? styles.tabTextChecked : styles.tabText}>{text}</div>}
                    </div>
                )

            })}
        </div>
    );
};

export default TimelineBar;