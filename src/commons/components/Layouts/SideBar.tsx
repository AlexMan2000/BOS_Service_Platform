import {  useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import styles from "./SideBar.module.less"
import { Avatar } from "antd"
import { MenuFoldOutlined, TransactionOutlined, UserOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { selectGlobalState, setIsSideBarCollapsed } from "@/store/slice/globalSlice/globalSlice";
import { TransferModal } from "../Modal/TransferModal"
import logo from "@/assets/icons/platformLogo.png"

interface SideBarProps {
    menuItems: {
        label: string
        path: string
        icon: string
    }[],
    defaultSelectedKey: string
}

export const SideBar = ({ menuItems, defaultSelectedKey }: SideBarProps) => {

    const navigate = useNavigate()

    // 当前选中的菜单项
    const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey)
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
    const menuClickRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch()

    const { isSideBarCollapsed } = useSelector(selectGlobalState)
    const [transferOpen, setTransferOpen] = useState(false)


    const pathname = useLocation().pathname

    useEffect(() => {
        setSelectedKey(pathname)
    }, [pathname])



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuClickRef.current && !menuClickRef.current.contains(event.target as Node)) {
                setAvatarMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.container + " " + (isSideBarCollapsed ? styles.collapsed : "")} >
            <TransferModal transferOpen={transferOpen} setTransferOpen={setTransferOpen} title="转账" />
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src={logo} alt="logo" />
                        稳定比交易平台
                    </div>
                    <div className={styles.collapse} onClick={() => {
                        dispatch(setIsSideBarCollapsed(!isSideBarCollapsed))
                    }}>
                        <MenuFoldOutlined style={{ fontSize: '28px' }} />
                    </div>
                </div>
                <div className={styles.menuItems}>
                    {menuItems.map((item) => (
                        <div className={`${styles.menuItem} ${selectedKey === item.path ? styles.selected : ""}`} key={item.path} onClick={() => {
                            setSelectedKey(item.path)
                            navigate(item.path)
                        }}>
                            <img src={item.icon} alt={item.label} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div></div>
            <div className={styles.footer}>
                <div className={styles.footerAvatar} ref={menuClickRef} onClick={() => {
                    setAvatarMenuOpen(!avatarMenuOpen)
                }}>
                    <Avatar size={60} icon={<UserOutlined />} />

                </div>

                <div className={styles.footerText}>
                    <span>用户名: 1234567890</span>
                    <span>余额: 10000</span>
                </div>

                {avatarMenuOpen && <div className={styles.avatarMenu}>
                    <div className={styles.avatarMenuItem} onClick={(e) => {
                        e.stopPropagation()
                        navigate("/home/profile")
                        console.log("个人中心")
                    }}>
                        <UserOutlined /><span>个人中心</span>
                    </div>
                    <div className={styles.avatarMenuItem} onClick={(e) => {
                        e.stopPropagation()
                        setTransferOpen(true)
                    }}>
                        <TransactionOutlined /><span>极速转账</span>
                    </div>
                </div>}
            </div>
        </div>
    )
}