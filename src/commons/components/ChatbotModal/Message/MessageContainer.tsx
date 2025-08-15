import styles from "./MessageContainer.module.less";
import { HighlightedMarkdown } from "./utility_components/HighlightedMarkdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopiableCode from "@/commons/components/CopiableCode/CopiableCode";
import "katex/dist/katex.min.css";
import { Input, Modal, message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import thinking from "@/assets/gifs/alan-loading.gif";
import copyIcon from "@/assets/svgs/copy_icon.svg";
import dislikeIcon from "@/assets/svgs/dislike_icon.svg";
import likeIcon from "@/assets/svgs/like_icon.svg";
import { useChatPageContext, SessionState } from "@/pages/HalaAIPages/chat_components/ChatPageContext";
import {
  // get_user_chat_session_by_id, 
  submit_message_feedback
} from "@/services/api/halaApi";
import { ChatFeedback, SourceMessageMetadata } from "@/commons/types/chat";
import { useDispatch } from "react-redux";
import { setIsChatSideBarCollapsed } from "@/store/slice/globalSlice/globalSlice";
import { PopupModal } from "../../Modal/PopupModal";
import sendMessage from '@/assets/sendbutton.png'
import deleteIcon from "@/assets/delete.png";
import { useIntl } from "react-intl";
import { LoadingOutlined } from "@ant-design/icons";
import { Certificate } from "@/commons/types/messages";
import { CertificationCard } from "./certificate_components/CertificationCard";
import { MiniCertificationCard } from "./certificate_components/MiniCertificationCard";

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

export interface MessageProps {
  role: string;
  text: any;
  type: string;
  reply_to?: string;
  message_id?: string;
  feedback?: ChatFeedback;
  status?: string;
  isGenerating?: boolean;
  statusText?: string;
  associated_session_ids?: string[];
  certificates?: Certificate[];
  session_type: string;
  is_last_message: boolean;
}

export default function MessageContainer(props: MessageProps) {
  const {
    role,
    text,
    type,
    message_id,
    reply_to,
    feedback,
    isGenerating,
    statusText,
    associated_session_ids,
    certificates,
    session_type,
    is_last_message
  } = props;
  const { setDislikeModalVisible,
    copyToClipboard,
    setUserMessageId,
    setBotMessageId,
    currentChatSessionId,
    // formatChatMessageToMessages,
    setUiMessages,
    setShowSidePanel,
    setFollowUpPromptText,
    setWantToCreateNewFollowUpChat,
    setFollowUpSourceText,
    showSidePanel,
    getSessionState,
    setCurrentFollowUpSessionId,
    handleSendMessage,
    currentFollowUpSessionId,
    setCurrentLikeSessionType,
    delete_chat_session_by_id,
    isNegativeSubmittingFeedback,
    deleteModalVisible,
    setDeleteModalVisible,
    isFollowUpGenerating,
    isFollowUpWaitingForServer
  } = useChatPageContext();
  const intl = useIntl();

  const [tabIndex, setTabIndex] = useState<number>(0);

  const [selectedPopupVisible, setSelectedPopupVisible] = useState<boolean>(false);
  const [selectedUserPromptPopUpVisible, setSelectedUserPromptPopUpVisible] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const selectedTextPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const selectedTextViewportPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 }); // For PopupModal fixed positioning
  const [askButtonPosition, setAskButtonPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 }); // State for Ask button position
  const dispatch = useDispatch();
  const selectedPopupRef = useRef<HTMLDivElement>(null);
  const [followUpPromptTextLocal, setFollowUpPromptTextLocal] = useState<string>("");
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState<number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string>(""); // Track which session to delete
  const [sidenotesExpanded, setSidenotesExpanded] = useState<boolean>(false);
  const [shouldCollapseSidenotes, setShouldCollapseSidenotes] = useState<boolean>(false);
  const [isPositiveSubmittingFeedback, setIsPositiveSubmittingFeedback] = useState<boolean>(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const selectedTextContextRef = useRef<{ selectedText: string; contextBefore: string; contextAfter: string; relativePosition: number; domOffset: number } | null>(null);

  // Color palette for status tags
  const statusColors = [
    "#007aff", // blue
    "#ff9800", // orange
    "#4caf50", // green
    "#e91e63", // pink
    "#9c27b0", // purple
    "#00bcd4", // cyan
    "#ff5722", // deep orange
    "#607d8b", // blue grey
    "#8bc34a", // light green
    "#f44336", // red
  ];

  // Function to get a random color from the palette
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * statusColors.length);
    return statusColors[randomIndex];
  };

  // Calculate if sidenotes should be collapsed
  useEffect(() => {
    if (role === "assistant" && associated_session_ids && associated_session_ids.length > 0) {
      const container = messageContainerRef.current;
      if (container) {
        const calculateCollapse = () => {
          const containerHeight = container.offsetHeight;
          const sidenoteHeight = 35; // Height of each sidenote
          const sidenoteGap = 25; // Gap between sidenotes
          const totalSidenotesHeight = associated_session_ids.length * sidenoteHeight + (associated_session_ids.length - 1) * sidenoteGap;

          // Collapse if total sidenotes height exceeds container height OR if there are more than 2 sidenotes
          const shouldCollapse = totalSidenotesHeight > containerHeight || associated_session_ids.length > 2;
          setShouldCollapseSidenotes(shouldCollapse);

          // Reset expanded state if no longer collapsed
          if (!shouldCollapse && sidenotesExpanded) {
            setSidenotesExpanded(false);
          }

        };

        // Calculate immediately
        calculateCollapse();

        // Set up ResizeObserver to recalculate when container size changes
        const resizeObserver = new ResizeObserver(() => {
          calculateCollapse();
        });
        resizeObserver.observe(container);

        return () => {
          resizeObserver.disconnect();
        };
      }
    } else {
      // Reset collapse state when no sidenotes
      setShouldCollapseSidenotes(false);
      setSidenotesExpanded(false);
    }
  }, [role, associated_session_ids, sidenotesExpanded, showSidePanel]);

  // Function to get metadata for highlighting based on current state
  const highlightData = useMemo(() => {
    if (!associated_session_ids || associated_session_ids.length === 0) {
      return { metadata: undefined, noteIndex: -1 };
    }

    // If side panel is open and we have a current follow-up session, use that
    if (showSidePanel && currentFollowUpSessionId) {
      const sessionIndex = associated_session_ids.indexOf(currentFollowUpSessionId);
      if (sessionIndex !== -1) {
        const sessionState = getSessionState(currentFollowUpSessionId);
        // Only highlight if this message is the SOURCE message for the current session
        if (sessionState?.source_message_metadata?.source_message_id === message_id) {
          return {
            metadata: sessionState!.source_message_metadata!,
            noteIndex: sessionIndex
          };
        }
      }
    }

    // If a note is being hovered, use that
    if (hoveredNoteIndex !== null && hoveredNoteIndex < associated_session_ids.length) {
      return {
        metadata: getSessionState(associated_session_ids[hoveredNoteIndex])?.source_message_metadata,
        noteIndex: hoveredNoteIndex
      };
    }

    // Default: no highlighting
    return { metadata: undefined, noteIndex: -1 };
  }, [associated_session_ids, showSidePanel, currentFollowUpSessionId, hoveredNoteIndex, getSessionState, message_id]);

  // Function to highlight selected text in message content
  const highlightSelectedText = (content: string, metadata: SourceMessageMetadata | undefined, noteIndex: number) => {
    // Check if we should highlight based on either hovered note or current selected session
    const shouldHighlight = hoveredNoteIndex === noteIndex ||
      (showSidePanel && associated_session_ids && currentFollowUpSessionId &&
        associated_session_ids[noteIndex] === currentFollowUpSessionId);

    if (!metadata || !metadata.source_message_selected_text || !shouldHighlight) {
      return content;
    }

    const selectedText = metadata.source_message_selected_text;
    const highlightColor = metadata.source_message_hightcolor;

    // Escape special regex characters in the selected text
    const escapedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedText})`, 'gi');

    // Split the content by the selected text and wrap matches with highlight span
    const parts = content.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === selectedText.toLowerCase()) {
        return (
          <span
            key={index}
            style={{
              backgroundColor: highlightColor,
              color: 'white',
              borderRadius: '3px',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };



  const renderNotes = (index: number, session_state: SessionState | undefined, session_id: string) => {

    const metadata = session_state?.source_message_metadata;

    if (showSidePanel) {
      return null;
    }
    // If sidenotes should be collapsed and not expanded, show collapsed view
    if (shouldCollapseSidenotes && !sidenotesExpanded) {
      if (index === 0) {
        return (
          <div
            key={`collapsed-${session_id}`}
            className={styles.collapsedSidenotes}
            style={{
              // right: showSidePanel ? "-30px" : "-120px",
              // width: showSidePanel ? "30px" : "120px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSidenotesExpanded(true);
            }}
          >
            <span className={styles.sidenoteCount}>
              {associated_session_ids?.length || 0} notes
            </span>
            <span style={{
              marginLeft: '4px',
              fontSize: '10px',
              opacity: 0.8,
              animation: 'pulse 2s infinite'
            }}>
              ▶
            </span>
          </div>
        );
      }
      return null; // Don't render other sidenotes when collapsed
    }

    // If expanded, show all sidenotes in expanded view
    if (sidenotesExpanded) {
      if (index === 0) {
        return (
          <div
            key={`expanded-${session_id}`}
            className={styles.expandedSidenotes}
            style={{
              // right: showSidePanel ? "-30px" : "-120px",
              // width: showSidePanel ? "30px" : "120px",
              maxHeight: messageContainerRef.current?.offsetHeight!,
            }}
          >

            <div
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                setSidenotesExpanded(false);
              }}
            >
              ×
            </div>
            {associated_session_ids?.map((sid, idx) => {
              const session_state = getSessionState(sid);
              if (session_state?.uiMessages.length === 0) {
                // 正在加载数据
                return <div
                  key={`loading-${session_id}`}
                  className={styles.expandedSidenoteItem}
                  style={{
                    backgroundColor: session_state?.source_message_metadata?.source_message_hightcolor || "#007aff",
                  }}
                >
                  <LoadingOutlined style={{ fontSize: 16, color: "white" }} />
                </div>;
              }
              return (
                <div
                  key={`expanded-item-${sid}`}
                  className={styles.expandedSidenoteItem}
                  onMouseEnter={() => {
                    setHoveredNoteIndex(idx)
                  }}
                  onMouseLeave={() => {
                    setHoveredNoteIndex(null)
                  }}
                  style={{
                    backgroundColor: session_state?.source_message_metadata?.source_message_hightcolor || "#007aff",
                  }}
                  onClick={() => {
                    setShowSidePanel(true);
                    setWantToCreateNewFollowUpChat(false);
                    setCurrentFollowUpSessionId(sid);
                    setFollowUpPromptText("");
                    setSidenotesExpanded(false);
                  }}
                >
                  <div className={styles.sidenoteText}>
                    {session_state?.source_message_metadata?.source_message_selected_text || "Note"}
                  </div>
                  <div
                    className={styles.sidenoteDeleteIcon}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setSessionToDelete(sid);
                      setDeleteModalVisible(true);
                      console.log("Delete session:", sid);
                    }}
                  >
                    <img src={deleteIcon} draggable={false} alt="delete" />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      return null; // Only render the expanded container once
    }

    if (session_state?.uiMessages.length === 0 || session_state?.source_message_metadata === undefined) {
      // 正在加载数据

      return <div key={`loading-${session_id}`}
        className={styles.renderNote}
        style={{
          top: 20 + index * 60,
          right: showSidePanel ? "-30px" : "-100px",
          width: showSidePanel ? "30px" : "100px",
          backgroundColor: metadata?.source_message_hightcolor || "#007aff",
        }}
      >
        <LoadingOutlined style={{ fontSize: 16, color: "white" }} />
      </div>;
    }

    // Default individual sidenote rendering
    return (
      <div
        key={`note-${session_id}`}
        className={styles.renderNote}
        style={{
          top: 20 + index * 60,
          right: showSidePanel ? "-30px" : "-100px",
          width: showSidePanel ? "30px" : "100px",
          backgroundColor: metadata?.source_message_hightcolor || "#007aff",
          display: showSidePanel ? "none" : "block", // Hide visually when side panel is open
        }}
        onMouseEnter={() => setHoveredNoteIndex(index)}
        onMouseLeave={() => setHoveredNoteIndex(null)}
        onClick={() => {
          console.log(session_id)
          setShowSidePanel(true);
          setWantToCreateNewFollowUpChat(false);
          setCurrentFollowUpSessionId(session_id);
          setFollowUpPromptText("");
        }}
      >
        <div className={styles.renderNoteText}>{metadata?.source_message_selected_text}</div>
        {!showSidePanel && <div className={styles.renderDeleteIcon}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setSessionToDelete(session_id);
            setDeleteModalVisible(true);
          }}
        >
          <img src={deleteIcon} draggable={false} alt="ellipsis" />
        </div>}
      </div>
    )
  }

  // Render delete modal outside of renderNotes to ensure it's always available
  const renderDeleteModal = () => (
    <Modal
      open={deleteModalVisible && sessionToDelete !== ""}
      onCancel={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setDeleteModalVisible(false);
        setSessionToDelete("");
      }}
      centered
      title="Delete Chat Session?"
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: "#c83030",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
        }
      }}
      cancelButtonProps={{
        style: {
          fontSize: 14,
          fontWeight: 500,
        }
      }}
      onOk={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!sessionToDelete) {
          console.log("调用了 1")
          return;
        }
        // setIsDeleting(true);
        console.log("调用了 ")
        const response = await delete_chat_session_by_id(sessionToDelete, {
          main_session_id: currentChatSessionId,
          message_id: message_id
        });
        if (response.status === 200) {
          setSessionToDelete("");
          // setIsDeleting(false);
        }
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#222" }}>Are you sure you want to delete this chat session?</p>
      </div>
    </Modal>
  );

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.contains(selectedPopupRef.current)) {
        setSelectedPopupVisible(false);
      }
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target instanceof HTMLElement && e.target.contains(selectedPopupRef.current)) {
          setSelectedPopupVisible(false);
        }
      });
    }
  }, []
  )

  // Handle scroll events to update Ask button position
  useEffect(() => {
    const handleScroll = () => {
      // If Ask button or popup modal is visible and we have a text selection, update position
      if ((selectedPopupVisible || selectedUserPromptPopUpVisible) && selectedText) {
        const selection = window.getSelection();
        if (selection && selection.toString().trim() === selectedText) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const containerRect = messageContainerRef.current?.getBoundingClientRect();

          if (containerRect) {
            // Update relative position for both Ask button and popup modal
            const relativeX = rect.right - containerRect.left + 10;
            const relativeY = (rect.top + rect.bottom) / 2 - containerRect.top;

            const newPosition = {
              x: relativeX,
              y: relativeY,
            };

            selectedTextPositionRef.current = newPosition;
            setAskButtonPosition(newPosition);
          }
        }
      }
    };

    // Add scroll event listener to window and parent containers
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [selectedPopupVisible, selectedUserPromptPopUpVisible, selectedText]);

  const handleMouseUp = (e: React.MouseEvent) => {

    if (session_type === "follow_up" || role === "user") {
      return;
    }

    // Check if the target is a link - if so, don't interfere with link clicking
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      return; // Let the link handle the click normally
    }

    const selection = window.getSelection();
    // Get the position of the selection， middle of the selection
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();

    // Get the message container's position for relative positioning
    const containerRect = messageContainerRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    // Calculate position relative to the message container
    // Position at the right edge of the selected text, vertically centered
    const relativeX = (rect?.right || 0) - containerRect.left + 10; // 10px offset from right edge
    const relativeY = ((rect?.top || 0) + (rect?.bottom || 0)) / 2 - containerRect.top; // Vertical center

    // Store relative position for Ask button (absolute positioning)
    const position = {
      x: relativeX,
      y: relativeY,
    };
    selectedTextPositionRef.current = position;
    setAskButtonPosition(position); // Update state for re-rendering

    // Store viewport position for PopupModal (fixed positioning)
    const viewportPosition = {
      x: rect?.right || 0,
      y: ((rect?.top || 0) + (rect?.bottom || 0)) / 2,
    };
    selectedTextViewportPositionRef.current = viewportPosition;

    if (selection && selection.toString().trim() && range) {
      const selectedTextCurr = selection.toString();

      // Collect context information for precise matching
      const contextData = getSelectionContext(range);

      setSelectedText(selectedTextCurr);

      // Store context data in a ref for later use
      selectedTextContextRef.current = contextData;

      setSelectedPopupVisible(true);
    } else {
      setSelectedPopupVisible(false);
    }
  };

  // Function to collect context information around the selection
  const getSelectionContext = (range: Range) => {
    const container = messageContainerRef.current;
    if (!container) return null;

    const fullText = container.textContent || '';
    const selectedText = range.toString();

    // Calculate DOM offset of the selection start
    const domOffset = calculateDOMOffset(range.startContainer, range.startOffset, container);

    // Define context length (characters before and after)
    const contextLength = 15;

    // Extract context before and after the selection
    const contextBefore = fullText.substring(
      Math.max(0, domOffset - contextLength),
      domOffset
    );

    const contextAfter = fullText.substring(
      domOffset + selectedText.length,
      Math.min(fullText.length, domOffset + selectedText.length + contextLength)
    );

    // Calculate relative position in the document
    const relativePosition = domOffset / fullText.length;

    // console.log('Selection context:', {
    //   selectedText,
    //   contextBefore,
    //   contextAfter,
    //   relativePosition,
    //   domOffset,
    //   fullTextLength: fullText.length
    // });

    return {
      selectedText,
      contextBefore,
      contextAfter,
      relativePosition,
      domOffset
    };
  };

  // Calculate DOM text offset for a given node and offset within a container
  const calculateDOMOffset = (node: Node, offset: number, container: Element): number => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let totalOffset = 0;
    let currentNode;

    while (currentNode = walker.nextNode()) {
      if (currentNode === node) {
        return totalOffset + offset;
      }
      totalOffset += (currentNode.textContent || '').length;
    }

    return totalOffset;
  };

  // Pick a random color for each status message instance
  const statusTagColor = useMemo(() => {
    if (type === "status") {
      // Use a hash of the text to get a stable color for the same status
      let hash = 0;
      for (let i = 0; i < (text || "").length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      const idx = Math.abs(hash) % statusColors.length;
      return statusColors[idx];
    }
    return statusColors[0];
  }, [type, text]);


  const handleOnSidePanelOpen = async () => {
    // Prevent starting a new follow-up if another one is still generating
    if (isFollowUpGenerating || isFollowUpWaitingForServer) {
      message.warning("A follow-up response is still being generated. Please wait until it finishes.");
      return;
    }

    setShowSidePanel(true);
    setFollowUpPromptText(followUpPromptTextLocal);
    setWantToCreateNewFollowUpChat(true);
    setCurrentFollowUpSessionId("");
    setSelectedUserPromptPopUpVisible(false);
    dispatch(setIsChatSideBarCollapsed(true));
    setFollowUpPromptTextLocal("")

    const contextData = selectedTextContextRef.current;
    await handleSendMessage({
      displayText: followUpPromptTextLocal,
      modelInput: selectedText + " " + followUpPromptTextLocal,
      sourceMessageMetadata: {
        source_message_id: message_id!,
        source_message_selected_text: selectedText,
        source_message_starting_position: selectedTextPositionRef.current,
        source_message_ending_position: selectedTextPositionRef.current,
        source_message_hightcolor: getRandomColor(),
        // Add context data for precise matching
        source_message_context_before: contextData?.contextBefore,
        source_message_context_after: contextData?.contextAfter,
        source_message_relative_position: contextData?.relativePosition,
        source_message_dom_offset: contextData?.domOffset
      }
    },
      "follow_up",
      true
    )

  }

  // Auto-scroll to highlighted text when session changes
  useEffect(() => {
    if (showSidePanel && currentFollowUpSessionId && highlightData.metadata) {
      // Small delay to ensure highlighting is rendered
      setTimeout(() => {
        const messageContainer = messageContainerRef.current;
        if (messageContainer) {
          // Find the highlighted span in this message
          const highlightedSpan = messageContainer.querySelector('span[style*="background-color"]');
          if (highlightedSpan) {
            // Scroll the highlighted element into view
            highlightedSpan.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });
          }
        }
      }, 100);
    }
  }, [showSidePanel, currentFollowUpSessionId, highlightData.metadata]);

  // Reset hovered note index when side panel is closed
  useEffect(() => {
    if (!showSidePanel) {
      setHoveredNoteIndex(null);
    }
  }, [showSidePanel]);

  return (

    <div
      ref={messageContainerRef}
      className={`${role === "user" ? styles.userContainer : styles.botContainer} ${showSidePanel ? styles.sidePanelOpen : ""}`}
      data-message-id={message_id}
    >
      {role === "assistant" && <div className={styles.tab}>
        <div className={styles.tabItem + " " + (tabIndex === 0 ? styles.active : "")} onClick={(e) => {
          e.stopPropagation();
          setTabIndex(0);
        }}>
          <div className={styles.tabItemTitle}>
            Answer
          </div>
        </div>
        <div className={styles.tabItem + " " + (tabIndex === 1 ? styles.active : "")} onClick={(e) => {
          e.stopPropagation();
          setTabIndex(1);
        }}>
          <div className={styles.tabItemTitle}>
            Certifications
          </div>
        </div>
      </div>}

      {role === "assistant" &&
        associated_session_ids &&
        associated_session_ids.length > 0 &&
        associated_session_ids.map((session_id, index) => {
          const session_state = getSessionState(session_id);
          // console.log("session_state", session_state);
          return renderNotes(index, session_state, session_id)
        })

      }
      {/* 这个是Ask 悬浮窗, 步骤1, 点击之后弹出popup输入框 */}
      <div className={styles.selectedPopup}
        ref={selectedPopupRef}
        style={{
          top: askButtonPosition.y,
          left: askButtonPosition.x,
          display: selectedPopupVisible ? "block" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (session_type === "follow_up") {
            return;
          }
          setSelectedPopupVisible(false);
          setSelectedUserPromptPopUpVisible(true);
          setFollowUpSourceText(selectedText);
        }}
      >
        {intl.formatMessage({ id: "subchat.ask" })}
      </div>

      {/* 这是popup输入框, 步骤2 */}
      {selectedUserPromptPopUpVisible && <PopupModal
        usePortal={false} // Disable Portal for relative positioning
        inputStyle={{
          position: "absolute",
          top: askButtonPosition.y, // Position above the Ask button
          left: askButtonPosition.x,
          width: "400px",
          height: "auto",
          zIndex: 1000,
          backgroundColor: "var(--theme-background-color)",
          border: "1px solid rgba(0, 0, 0, 0.15)",
          borderRadius: "8px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
        }}
        extraCloseTrigger={true}
        modalStyle={{
          padding: "10px"
        }}
        noBackground={true}
        open={selectedUserPromptPopUpVisible}
        onClose={() => setSelectedUserPromptPopUpVisible(false)}
      >
        <Input.TextArea
          value={followUpPromptTextLocal}
          style={{
            backgroundColor: "var(--theme-background-color)",
            outline: "none",
          }}
          autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={(e) => setFollowUpPromptTextLocal(e.target.value)}
          onPressEnter={async (e) => {
            // 这里就是要开一个new session
            e.preventDefault(); // Prevent newline
            await handleOnSidePanelOpen();
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
            cursor: "pointer"
          }}
          onClick={async (e) => {
            e.preventDefault(); // Prevent newline
            await handleOnSidePanelOpen();
          }}
        >
          <img src={sendMessage}
            style={{
              width: "100%",
              height: "100%",
            }}
            draggable={false} alt="send message" />
        </div>
      </PopupModal>}
      {role === "user" ? (
        // If user message
        type === "text" ? (
          <div className={styles.userMessage}
            onMouseUp={handleMouseUp}
          >
            <div className={styles.userMessageText}>
              {/* {text} */}
              {(() => {
                const { metadata, noteIndex } = highlightData;
                return highlightSelectedText(text, metadata, noteIndex);
              })()}
            </div>
            <div className={styles.userMessageUtilityGroup}>
              <div className={styles.userMessageUtilityItem}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(text);
                }}
              >
                <img src={copyIcon} draggable={false} alt="copy" />
              </div>
            </div>

          </div>
        ) : (
          <div className={styles.userMessage}>
            <img src={text} draggable={false} alt="user-uploaded" className={styles.userImage} />
          </div>
        )
      ) : (
        // If bot message
        type === "generating" ? (
          <div className={styles.botMessageThinking}>
            <img src={thinking} alt="thinking" className={styles.thinkingImage} draggable={false}></img>
            {statusText && <div className={styles.botMessageDescription}>{statusText}</div>}
          </div>
        ) :
          // bot message type is status
          type === "status" ? (
            <div
              className={styles.botStatusMessage}
              style={{
                // Set the color as a CSS variable for the tag
                ["--status-tag-color" as any]: statusTagColor,
              }}
            >
              {text}
            </div>
          ) :
            // bot message type is cancelled, show the cancelled message from backend
            type === "cancelled" ? (
              <div className={styles.reactMarkdown} style={{
                opacity: 0.8,
                //fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 18,
                color: '#666',
                fontFamily: 'noto sans',
                padding: 15
              }}>
                {text}
              </div>
            ) :
              // bot message type is text
              type === "text" ?
                (
                  <div
                    className={styles.botMessage}
                    onMouseUp={handleMouseUp}
                  >
                    {tabIndex === 0 && <div className={styles.answerContent}>
                      <div className={styles.certificationList}>
                        {
                          certificates?.map((certificate) => {
                            return <MiniCertificationCard certificate={certificate} onClick={() => { }} />
                          })
                        }
                      </div>
                      <div className={styles.reactMarkdown}>
                        {(() => {
                          const { metadata, noteIndex } = highlightData;
                          return (
                            <HighlightedMarkdown
                              content={text}
                              metadata={metadata}
                              noteIndex={noteIndex}
                              hoveredNoteIndex={hoveredNoteIndex}
                              showSidePanel={showSidePanel}
                              currentFollowUpSessionId={currentFollowUpSessionId}
                              associated_session_ids={associated_session_ids}
                            />
                          );
                        })()}
                      </div>
                      {
                        (!isGenerating || (isGenerating && !is_last_message)) && <div className={styles.utilityGroup}>
                          <div className={styles.utilityItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(text);
                            }}
                          >
                            <img src={copyIcon} draggable={false} alt="copy" />
                          </div>
                          <div className={styles.utilityItem + (feedback ? (feedback.is_positive ? " " + styles.clicked : " " + styles.not_allowed) : (isPositiveSubmittingFeedback || isNegativeSubmittingFeedback) ? " " + styles.not_allowed : "")}
                            onClick={async (e) => {
                              e.stopPropagation();
                              // 防止重复提交请求
                              if (feedback || isPositiveSubmittingFeedback || isNegativeSubmittingFeedback) {
                                return;
                              }
                              // 先更新本地的
                              setUiMessages(session_type === "follow_up" ? currentFollowUpSessionId : currentChatSessionId, (prev) => {
                                return prev.map((message) => {
                                  if (message.message_id === message_id) {
                                    return {
                                      ...message,
                                      feedback: {
                                        is_positive: true,
                                        user_message_id: message_id!,
                                      }
                                    }
                                  }
                                  return message;
                                })
                              });
                              setIsPositiveSubmittingFeedback(true);
                              await submit_message_feedback(reply_to!, true);
                              setIsPositiveSubmittingFeedback(false);
                            }}
                          >
                            <img src={likeIcon} draggable={false} alt="like" />
                          </div>
                          <div className={styles.utilityItem + (feedback ? (feedback.negative_reason ? " " + styles.clicked : " " + styles.not_allowed) : (isPositiveSubmittingFeedback || isNegativeSubmittingFeedback) ? " " + styles.not_allowed : "")}
                            onClick={(e) => {
                              e.stopPropagation();
                              // 防止提交positive的时候用户能够提交negative feedback
                              if (feedback || isPositiveSubmittingFeedback || isNegativeSubmittingFeedback) {
                                return;
                              }
                              setCurrentLikeSessionType(session_type);
                              setUserMessageId(reply_to!);
                              setBotMessageId(message_id!);
                              setDislikeModalVisible(true);
                            }}>
                            <img src={dislikeIcon} draggable={false} alt="dislike" />
                          </div>
                        </div>
                      }
                    </div>
                    }
                    {tabIndex === 1 && <div className={styles.certificationContent}>
                      {
                        certificates?.map((certificate) => {
                          return <CertificationCard certificate={certificate} onClick={() => { }} />
                        })
                      }
                    </div>}
                  </div>
                ) : null
      )}
      {renderDeleteModal()}
    </div>
  );
}