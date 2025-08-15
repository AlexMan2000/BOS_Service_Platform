import React, { useEffect, useRef, useState } from "react";
import styles from "./Avatar.module.less";
import AvatarIcon from "./components/AvatarIcon/AvatarIcon";
import AvatarMenu from "./components/AvatarMenu/AvatarMenu";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slice/userSlice/userSlice";
import { classNamesArgs } from "@/commons/utils/formatters/classNameHandler";

interface AvatarProps {
  location?: string;
  width?: string;
  showIcon?: boolean;
  hideMenu?: boolean;
  size?: string;
  fontSize?: string;
  unclickable?: boolean;
  onClickEvent?: Function;
  className?:string;
}
export default function Avatar(props: AvatarProps) {
  const { hideMenu, size, fontSize, unclickable, location, width, showIcon = true, onClickEvent } = props;
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const userInfo = useSelector(selectUser)
  const { last_name, avatar } = userInfo;
  const dropDownOpenRef = useRef(dropDownOpen);
  const dropDownRef = useRef<any>(null);
  const avatarIconRef = useRef<any>();


  const { isAuthenticated } = useSelector(selectUser);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isAuthenticated) {
      setDropDownOpen(!dropDownOpen);
    }
    if (!onClickEvent && !unclickable) { 
      setDropDownOpen(!dropDownOpen);
    } else {
      onClickEvent && !isAuthenticated && onClickEvent();
    }
  };

  useEffect(() => {
    dropDownOpenRef.current = dropDownOpen;
  }, [dropDownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setDropDownOpen(false); // Close the dropdown if clicked outside
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={classNamesArgs(styles.wrapper, "settings-avatar")}
    style={{
      display: showIcon ? "flex" : "none",
    }}
    >
      {isAuthenticated ? (
        <div ref={avatarIconRef} onClick={handleClick}>
            <AvatarIcon
            avatar={avatar}
            name={last_name}
            style={{
              height: hideMenu ? size : "40px",
              width: hideMenu ? size : "40px",
              fontSize: hideMenu ? fontSize : "16px",
            }}
          ></AvatarIcon>
          <div ref={dropDownRef} className={styles.dropdownMenu + (location === "top" ? " " + styles.top : "")}>
            {dropDownOpen && !hideMenu && <AvatarMenu width={width} open={dropDownOpen}></AvatarMenu>}
          </div>
        </div>
      ): !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register') &&
      (
        <div ref={avatarIconRef} onClick={handleClick}>
            <AvatarIcon
            avatar={avatar}
            name={last_name}
            style={{
              height: hideMenu ? size : "40px",
              width: hideMenu ? size : "40px",
              fontSize: hideMenu ? fontSize : "16px",
            }}
          ></AvatarIcon>
          <div ref={dropDownRef} className={styles.dropdownMenu}>
            {dropDownOpen && !hideMenu && <AvatarMenu open={dropDownOpen}></AvatarMenu>}
          </div>
        </div>
      )
      
      }
    </div>
  );
}
