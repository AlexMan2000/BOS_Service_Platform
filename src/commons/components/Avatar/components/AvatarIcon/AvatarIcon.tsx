import { Avatar as MuiAvatar } from "@mui/material";
import styles from "./AvatarIcon.module.less";
import { CSSProperties, useState } from "react";

interface AvatarProps {
  avatar: string;
  name: string;
  style?: CSSProperties;
}

export default function AvatarIcon({ avatar, name, style }: AvatarProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const handleImageLoad = () => {
    setImgLoaded(true);
  };
  const stringToColor = (string: string) => {
    if (!string) return "lightgray";
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (name: string) => {
    let nameShort = "";
    if (name) nameShort = name[0];
    if (String(name).search(/\s+/) !== -1)
      nameShort = `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
    return {
      sx: {
        bgcolor: imgLoaded ? "white" : stringToColor(name),
      },
      children: nameShort,
    };
  };

  return (
    <div className={styles.container}>
      <MuiAvatar
        className={styles.avatar}
        {...stringAvatar(`${name}`)}
        src={avatar}
        imgProps={{
          onLoad: handleImageLoad,
        }}
        style={style}
      />
    </div>
  );
}
