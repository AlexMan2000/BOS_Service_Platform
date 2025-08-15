import {
   useEffect,
   useRef, useState } from "react";
import styles from "./MessageList.module.less";
import scrollDownButton from "@/assets/scroll-down-arrow.png";
import MessageContainer from "../Message/MessageContainer";
import { Message } from "@/commons/types/messages";

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;  
  isWaitingForServer: boolean;
  currentThinkingStatus?: string;
  containerStyle?: React.CSSProperties;
  session_type: string;
}

export default function MessageList(props: MessageListProps) {
  const { messages, isGenerating, isWaitingForServer, currentThinkingStatus, containerStyle, session_type } = props;
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    if (!isUserScrolling || isWaitingForServer) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 60) {
        setIsUserScrolling(false);
      } else {
        setIsUserScrolling(true);
      }
    }
  };


  const messagesToRender = [...messages, ...(isWaitingForServer ? [{ role: "assistant", text: "", type: "generating", statusText: currentThinkingStatus }] : [])]

  return (
    <div className={styles.container} id={`Container`}>
      <div
        className={styles.messageContainer}
        ref={messageContainerRef}
        onScroll={handleScroll}
        style={containerStyle}
      >
        {messagesToRender.map((msg, index) => (
          <MessageContainer
            key={index}
            role={msg.role}
            text={msg.text}
            type={msg.type}
            reply_to={msg.reply_to}
            message_id={msg.message_id}
            feedback={msg.feedback}
            is_last_message={index === messagesToRender.length - 1}
            isGenerating={isGenerating}
            statusText={msg.statusText}
            associated_session_ids={msg.associated_session_ids}
            certificates={msg.certificates}
            session_type={session_type}
          />
        ))}
      </div>
      {isUserScrolling ? (
        <button
          className={styles.scrollDownButton}
          onClick={() => {
            if (messageContainerRef.current) {
              messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
        >
          <img src={scrollDownButton} className={styles.scrollDownImage}></img>
        </button>
      ) : null}
    </div>
  );
}
