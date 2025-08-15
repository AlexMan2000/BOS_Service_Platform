import { useEffect, useRef, useState } from "react";
import styles from "./OutlineMenu.module.less";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

interface OutlineMenuProps {
    options: {
        label: string;
        value: string;
        onClick?: () => void;
    }[];
    defaultOption?: string;
}

export const OutlineMenu = ({ options, defaultOption }: OutlineMenuProps) => {
    const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(defaultOption || null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleMenuItemClick = (option: typeof options[0], e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setSelectedOptionValue(option.value);
        setIsOpen(false);
        option.onClick?.();
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    return (
        <div className={styles.container} onClick={toggleMenu} ref={menuRef}>
            {isOpen ? (
                <div className={styles.openedContainer}>
                    {options.map((option, index) => (
                        <div 
                            key={option.value}
                            className={styles.menuItem + " " + (option.value === selectedOptionValue ? styles.menuItemLabelActive : "")} 
                            onClick={(e) => handleMenuItemClick(option, e)}
                        >
                            <span className={styles.menuItemLabel}>{option.label}</span>
                            {index === 0 && <UpOutlined style={{color: "#0072C7"}}/> }
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.closedContainer}>
                    <span className={styles.closedContainerLabel}>
                        {options.find(option => option.value === selectedOptionValue)?.label || options[0]?.label}
                    </span>
                    <DownOutlined style={{color: "#0072C7"}}/>
                </div>
            )}
        </div>
    );
};
