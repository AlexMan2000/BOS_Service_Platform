import React, { useState } from "react";
import styles from "./CopiableCode.module.less";
import copyIconSvg from "@/assets/copy-icon-white.png";
import copiedIconSvg from "@/assets/copied-icon-white.png";

interface CopyButtonProps {
  code: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ code }) => {
  const [buttonText, setButtonText] = useState("Copy Code");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setButtonText("Code Copied");
        setCopied(true);
        setTimeout(() => {
          setButtonText("Copy Code");
          setCopied(false);
        }, 3000);
      },
      (err) => {
        alert("Failed to copy" + err);
      }
    );
  };

  return (
    <div className={styles.toolTipWrapper}>
      <button onClick={copyToClipboard} className={styles.copyButton}>
        <img
          src={!copied ? copyIconSvg : copiedIconSvg}
          alt="Copy icon"
          className={!copied ? styles.copyIcon: styles.copiedIcon}
        />
        {buttonText}
      </button>
      <span className={styles.toolTipText}>Copy</span>
    </div>
  );
};

export default CopyButton;
