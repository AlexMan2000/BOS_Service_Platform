
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/prism";


import styles from './markdownParser.module.less';
import CopiableCode from '@/commons/components/CopiableCode/CopiableCode';


const customStyle = {
  // Custom styles here
};



export const Code = (props: any) => {
    const { inline, className = "", children, node } = props;
    const match = /language-(\w+)/.exec(className || "");
  
    const extractCode = (children: any): string => {
      if (!children) return "";
      return Array.isArray(children)
        ? children
            .map((child) =>
              typeof child === "object" && child?.props?.children
                ? extractCode(child.props.children)
                : child
            )
            .join("")
        : children;
    };
  
    const code = extractCode(children);
    const language = (match: RegExpExecArray | null): string => {
      if (!match || match.length < 2) {
        return "plaintext";
      }
      return match[1];
    };
  
    return !inline && match ? (
      <div className={styles.codeContainer}>
        <div className={styles.headerContainer}>
          <span className={styles.languageText}>
            {match[1]
              ? match[1].charAt(0).toUpperCase() + match[1].slice(1)
              : "Unknown"}
          </span>
          <CopiableCode code={code}></CopiableCode>
        </div>
        <SyntaxHighlighter
          {...props}
          style={{ ...syntaxStyle, ...customStyle }}
          language={language(match)}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className} node={node} {...props}>
        {children}
      </code>
    );
  };
  