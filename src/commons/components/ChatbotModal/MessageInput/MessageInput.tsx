import React, { useRef,useState } from 'react';
import styles from './MessageInput.module.less'
import sendMessage from '@/assets/sendbutton.png'
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slice/userSlice/userSlice';
import { useChatPageContext } from '@/pages/HalaAIPages/chat_components/ChatPageContext';
import stopIcon from '@/assets/pause-icon.png';
import { useIntl } from 'react-intl';
import { SourceMessageMetadata } from '@/commons/types/chat';

export interface MessageInputProps {
  handleSendMessage: (
    sendData: { displayText: string, modelInput: string, sourceMessageMetadata?: SourceMessageMetadata },
    session_type: string,
  ) => Promise<void>,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  promptText: string,
  disabled: boolean,
  handleStopStream?: (payload: {
    currentSessionId: string,
    currentUserMessageId: string,
  }) => Promise<void>,
  inputStyle?: React.CSSProperties
  containerStyle?: React.CSSProperties
  buttonStyle?: React.CSSProperties
  session_type: string,
  canStop?: boolean,
}


export default function MessageInput(
  {
    handleSendMessage,
    handleInputChange,
    promptText,
    disabled,
    handleStopStream,
    inputStyle,
    containerStyle,
    buttonStyle,
    session_type,
    // canStop = false,
  }:
    MessageInputProps) {

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isAuthenticated } = useSelector(selectUser);
  const { 
    setAuthModalVisible, 
    currentChatSessionId, 
    currentUserMessageId,
    currentFollowUpSessionId,
    currentFollowUpUserMessageId,
  } = useChatPageContext();
  const intl = useIntl();
  const [isComposing, setIsComposing] = useState(false); // Track IME composition state
  const [_, setInputMethod] = useState<string>(''); // Track specific input method

  // Auto-grow textarea height
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    const textarea = inputRef.current;
    if (textarea) {
      // textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  // Reset height when promptText is cleared
  React.useEffect(() => {
    const textarea = inputRef.current;
    if (textarea && promptText === '') {
      textarea.style.height = '48px';
    }
  }, [promptText]);

  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.inputContainer} style={inputStyle}>
        <textarea
          className={styles.input + (disabled ? " " + styles.disabled : "")}
          ref={inputRef}
          disabled={disabled}
          onChange={handleResize}
          value={promptText}
          style={{ resize: 'none', lineHeight: '24px', minHeight: '24px', maxHeight: '144px' }}
          onCompositionStart={(e) => {
            setIsComposing(true);
            // Detect input method type
            const data = e.data || '';
            console.log('Composition started:', { data, locale: navigator.language });
          }}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            const data = e.data || '';
            console.log('Composition ended:', { data });
            setInputMethod('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              // If user is composing (typing Chinese), allow Enter to work for IME
              // but prevent sending the message
              if (isComposing) {
                return; // Let IME handle the Enter key
              }
              
              // If not composing, prevent default and send message
              e.preventDefault();
              if (!isAuthenticated) {
                setAuthModalVisible(true);
                return;
              }
              // Check if message is empty or only whitespace
              const trimmedText = promptText.trim();
              if (!trimmedText) {
                return; // Don't send empty messages
              }
              handleSendMessage({
                displayText: promptText,
                modelInput: promptText,
                sourceMessageMetadata: undefined,
              }, session_type);
            }
            // Shift+Enter: allow default (new line)
          }}
          placeholder={intl.formatMessage({ id: "messageinput.placeholder" })}
        />
        <div className={styles.buttonContainer}
          onClick={async () => {
            if (!isAuthenticated) {
              setAuthModalVisible(true);
              return;
            }
            if (disabled) {
              // Stop the stream only if allowed (i.e., actually generating)
              // if (!canStop) {
              //   message.error("Cannot stop while waiting for server response.");
              //   return;
              // }
              if ( handleStopStream) {
                await handleStopStream({
                  currentSessionId: session_type === "follow_up" ? currentFollowUpSessionId : currentChatSessionId,
                  currentUserMessageId: session_type === "follow_up" ? currentFollowUpUserMessageId : currentUserMessageId,
                });
              }
              return;
            }
            // Check if message is empty or only whitespace
            const trimmedText = promptText.trim();
            if (!trimmedText) {
              return; // Don't send empty messages
            }
            await handleSendMessage({
              displayText: promptText,
              modelInput: promptText,
              sourceMessageMetadata: undefined,
            }, session_type);
          }}
          style={buttonStyle}
        >
          <img src={disabled ? stopIcon : sendMessage} draggable={false} alt="send message" />
        </div>
      </div>
    </div>
  )
}
