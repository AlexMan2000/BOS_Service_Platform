// import { append_message_to_session, create_new_chat_session, sendMessageToModel } from "@/services/api/halaApi";
// import { useCallback } from "react";
// import { ChatMessageToSubmit } from "@/commons/types/chat";
// import { EventParams, Message } from "@/commons/types/messages";

// export interface UseSendMessageDependencies {
//   // Context functions
//   currentChatSessionId: string;
//   wantToCreateNewChat: boolean;
//   checkAndShowSurvey: () => void;
//   setPromptText: (text: string) => void;
//   isGenerating: boolean;
//   isWaitingForServer: boolean;
  
//   // Session management
//   createSessionState: (sessionId: string) => void;
//   updateSessionState: (sessionId: string, updates: any) => void;
//   setCurrentChatSessionId: (sessionId: string) => void;
//   setUiMessages: (sessionId: string, updater: (prevMessages: Message[]) => Message[]) => void;
//   setCurrentUserMessageId: (id: number) => void;
//   setReloadChatHistory: (updater: (prev: boolean) => boolean) => void;
  
//   // Event source management
//   eventSourceMapRef: React.MutableRefObject<Map<string, EventSource>>;
//   lastEventTypeMapRef: React.MutableRefObject<Map<string, string>>;
  
//   // Bot message finalization
//   finalizeBotMessage: (sessionId?: string) => void;
// }

// export interface UseSendMessageReturn {
//   handleSendMessage: (sendData: { displayText: string; modelInput: string }) => Promise<void>;
//   createSessionHandlers: (sessionId: string) => {
//     eventHandler: (event: MessageEvent, payload?: EventParams) => Promise<void>;
//     errorHandler: () => void;
//   };
// }

// export const useSendMessage = (deps: UseSendMessageDependencies): UseSendMessageReturn => {
//   const {
//     currentChatSessionId,
//     wantToCreateNewChat,
//     checkAndShowSurvey,
//     setPromptText,
//     isGenerating,
//     isWaitingForServer,
//     createSessionState,
//     updateSessionState,
//     setCurrentChatSessionId,
//     setUiMessages,
//     setCurrentUserMessageId,
//     setReloadChatHistory,
//     eventSourceMapRef,
//     lastEventTypeMapRef,
//     finalizeBotMessage,
//   } = deps;

//   // Helper: create session-specific event and error handlers that share state
//   const createSessionHandlers = useCallback((sessionId: string) => {
//     // Shared state between event handler and error handler
//     let lastEventType: string | null = null;
//     let botMessageBuffer: string = "";

//     const eventHandler = async (event: MessageEvent, payload?: EventParams) => {
//       const eventType = event.type;
//       let message;
//       let count = 0;
//       try {
//         message = JSON.parse(event.data);
//       } catch {
//         message = {};
//       }

//       // Always use the session ID from the factory, not from closure
//       const current_session_id = sessionId;

//       if (eventType === "answer") {
//         if (message.data === '') {
//           return;
//         }
//         updateSessionState(current_session_id, {
//           isWaitingForServer: false,
//           isGenerating: true
//         });
//         botMessageBuffer += message.data;
//         setUiMessages(current_session_id, (prevMessages) => {
//           const newMessages = [...prevMessages];
//           const content = message.data;
//           if (
//             newMessages.length > 0 &&
//             newMessages[newMessages.length - 1].role === "bot" &&
//             newMessages[newMessages.length - 1].type === "text"
//           ) {
//             count += 1;
//             if (content && count == 1) {
//               // 正在往里面加
//               newMessages[newMessages.length - 1].text += content;
//             }
//             return newMessages;
//           } else {
//             newMessages.push({
//               text: botMessageBuffer,
//               role: "bot",
//               type: "text"
//             } as Message);
//           }
//           return newMessages;
//         });
//         lastEventType = "answer";
//       } else if (eventType === "done") {
//         updateSessionState(current_session_id, {
//           isGenerating: false
//         });

//         if (lastEventType === "answer") {
//           const message_to_submit: ChatMessageToSubmit = {
//             text: botMessageBuffer,
//             role: "bot",
//             type: "text",
//             reply_to: payload?.reply_to ?? -1
//           };
//           const response = await append_message_to_session(current_session_id, message_to_submit);

//           setUiMessages(current_session_id, (prevMessages) => {
//             const newMessages = [...prevMessages];
//             if (newMessages.length > 0) {
//               newMessages[newMessages.length - 1].text = botMessageBuffer;
//               newMessages[newMessages.length - 1].message_id = response.current_message_id;
//               newMessages[newMessages.length - 1].reply_to = payload?.reply_to ?? -1;
//             }
//             return newMessages;
//           });
//           lastEventType = "done";
//         }
//         finalizeBotMessage(current_session_id);
//       } else if (eventType === "fastAnswer") {
//         const message_to_submit: ChatMessageToSubmit = {
//           text: message.data,
//           role: "bot",
//           type: "text",
//           reply_to: payload?.reply_to ?? -1
//         };
//         const response = await append_message_to_session(current_session_id, message_to_submit);

//         setUiMessages(current_session_id, (prevMessages) => {
//           const newMessages = [...prevMessages];
//           newMessages.push({
//             ...message_to_submit,
//             message_id: response.current_message_id,
//             reply_to: payload?.reply_to ?? -1
//           } as Message);
//           return newMessages;
//         });

//         lastEventType = "fastAnswer";
//       } else if (eventType === "flowNodeStatus") {
//         if (lastEventTypeMapRef.current.get(current_session_id) === "userInput" || 
//             lastEventTypeMapRef.current.get(current_session_id) === "flowNodeStatus") {
//           updateSessionState(current_session_id, {
//             currentGeneratingStatus: message.name
//           });
//           lastEventTypeMapRef.current.set(current_session_id, "flowNodeStatus");
//         }
//       }
//     };
    
//     const errorHandler = () => {
//       if (eventSourceMapRef.current.get(sessionId)) {
//         eventSourceMapRef.current.delete(sessionId);
//       }

//       // Use the shared lastEventType from the closure
//       if (lastEventType !== "done") {
//         updateSessionState(sessionId, {
//           isWaitingForServer: false,
//           isGenerating: false,
//           botMessageBuffer: ""
//         });
//       }
//     };

//     return { eventHandler, errorHandler };
//   }, [
//     updateSessionState,
//     setUiMessages,
//     finalizeBotMessage,
//     lastEventTypeMapRef,
//     eventSourceMapRef
//   ]);

//   const handleSendMessage = useCallback(async (sendData: { displayText: string; modelInput: string }) => {
//     const { displayText, modelInput } = sendData;
    
//     // Validate input
//     const validateInput = (text: string) => {
//       return !!text;
//     };

//     if (!validateInput(displayText)) {
//       return;
//     }

//     // Check for survey before starting new chat
//     if (wantToCreateNewChat && currentChatSessionId === "") {
//       checkAndShowSurvey();
//     }

//     setPromptText("");
    
//     // Don't send more requests while generating or waiting
//     if (isGenerating || isWaitingForServer) {
//       return;
//     }

//     // Save the message to the database
//     let response;
//     if (wantToCreateNewChat && currentChatSessionId === "") {
//       // First time to create a new session
//       console.log("first time to create a new session");
//       const new_session = await create_new_chat_session();
//       createSessionState(new_session.session_id);
//       const message_to_submit: ChatMessageToSubmit = {
//         text: modelInput,
//         role: "user",
//         type: "text"
//       };
//       const new_session_id = new_session.session_id;
//       response = await append_message_to_session(new_session_id, message_to_submit);
//       updateSessionState(new_session_id, {
//         isWaitingForServer: true,
//         isGenerating: false
//       });
//       setCurrentChatSessionId(new_session_id);
//       setUiMessages(new_session_id, (prevMessages) => {
//         const newMessages = [...prevMessages];
//         newMessages.push({
//           ...message_to_submit,
//           message_id: response.current_message_id
//         } as Message);
//         return newMessages;
//       });
//       updateSessionState(new_session_id, {
//         currentUserMessageId: response.current_message_id
//       });
//       setCurrentUserMessageId(response.current_message_id);
//       setReloadChatHistory(prev => !prev);

//       // Create session handlers once to ensure they share state
//       const sessionHandlers = createSessionHandlers(new_session_id);
//       const eventSource = await sendMessageToModel(
//         {
//           message: modelInput,
//           chatId: new_session_id,
//           payload: {
//             reply_to: response.current_message_id,
//             current_session_id: new_session_id,
//           }
//         },
//         sessionHandlers.eventHandler,
//         sessionHandlers.errorHandler
//       );
//       eventSourceMapRef.current.set(new_session_id, eventSource);
//       lastEventTypeMapRef.current.set(new_session_id, "userInput");
//     } else {
//       // Append message to the current session
//       const message_to_submit: ChatMessageToSubmit = {
//         text: modelInput,
//         role: "user",
//         type: "text"
//       };
//       response = await append_message_to_session(currentChatSessionId, message_to_submit);
//       updateSessionState(currentChatSessionId, {
//         isWaitingForServer: true,
//         isGenerating: false
//       });
//       setUiMessages(currentChatSessionId, (prevMessages) => {
//         const newMessages = [...prevMessages];
//         newMessages.push({
//           ...message_to_submit,
//           message_id: response.current_message_id
//         } as Message);
//         return newMessages;
//       });

//       updateSessionState(currentChatSessionId, {
//         currentUserMessageId: response.current_message_id
//       });
//       setCurrentUserMessageId(response.current_message_id);

//       // Create session handlers once to ensure they share state
//       const sessionHandlers = createSessionHandlers(currentChatSessionId);
//       const eventSource = await sendMessageToModel(
//         {
//           message: modelInput,
//           chatId: currentChatSessionId,
//           payload: {
//             reply_to: response.current_message_id,
//             current_session_id: currentChatSessionId,
//           }
//         },
//         sessionHandlers.eventHandler,
//         sessionHandlers.errorHandler
//       );
//       eventSourceMapRef.current.set(currentChatSessionId, eventSource);
//       lastEventTypeMapRef.current.set(currentChatSessionId, "userInput");
//     }
//   }, [
//     currentChatSessionId,
//     wantToCreateNewChat,
//     checkAndShowSurvey,
//     setPromptText,
//     isGenerating,
//     isWaitingForServer,
//     createSessionState,
//     updateSessionState,
//     setCurrentChatSessionId,
//     setUiMessages,
//     setCurrentUserMessageId,
//     setReloadChatHistory,
//     eventSourceMapRef,
//     lastEventTypeMapRef,
//     createSessionHandlers
//   ]);

//   return {
//     handleSendMessage,
//     createSessionHandlers
//   };
// };