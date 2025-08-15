import styles from "./AvatarMenu.module.less";
import UserIcon from "@/assets/icons/user-icon.svg";
import LogoutIcon from "@/assets/icons/sign-out-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { initUserInfo, selectUser, setIsAuthenticated } from "@/store/slice/userSlice/userSlice";
import { 
  message } from "antd";
import { setIsSettingModalOpen } from "@/store/slice/globalSlice/globalSlice";
import { useChatPageContext } from "@/pages/HalaAIPages/chat_components/ChatPageContext";
import { useIntl } from "react-intl";

interface AvatarMenuProps {
  width?: string;
  open?: boolean;
  setAuthModalVisible?: Function;
  setMessages?: Function;
}
const AvatarMenu = (props: AvatarMenuProps) => {
  const { width, open, setAuthModalVisible, setMessages } = props;
  const dispatch = useDispatch();
  const { 
    checkAndShowSurvey, 
    clearSessionTimer, 
    setUiMessages, 
    currentChatSessionId, 
    setReloadSideBar,
    clearAllSession,
    setHasReloadedChatHistory,
    setIsChatPageLoading,
  } = useChatPageContext();
  const intl = useIntl();
  // const navigate = useNavigate();

  const {
    isAuthenticated,
    first_name,
    last_name,
    email,
  } = useSelector(selectUser);

  const handleLogout = async () => {
    // Check for survey before logout
    checkAndShowSurvey();
    
    // Clear session timer on logout
    clearSessionTimer();
    dispatch(setIsAuthenticated(false));
    dispatch(initUserInfo());
    localStorage.clear();
    setMessages && setMessages([]);
    setUiMessages && setUiMessages(currentChatSessionId, () => []);
    clearAllSession();
    setReloadSideBar(false);
    setHasReloadedChatHistory(false);
    setIsChatPageLoading(false); // Reset the states
    message.success(intl.formatMessage({ id: "profile.menu.logged_out_successfully" }));
  };

  const handleLogin = () => {
    setAuthModalVisible && setAuthModalVisible(true);
  };

  return (
    <div
      className={[styles.container, (open) && styles.visible].filter(Boolean).join(" ")}
      style={{ width: width ? width : "280px" }}
    >
      {isAuthenticated ? (
        <div className={styles.menuContainer}>
          <div className={styles.personalInfoContainer}>
            <div className={styles.personalInfo}>
              <div className={styles.nameContainer}>
                <div className={styles.name}>{first_name} {last_name}</div>
                <div className={styles.email}>{email}</div>
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.optionContainer}>
            <div className={styles.option} onClick={() => {
                // Check for survey before opening profile settings
                checkAndShowSurvey();
                dispatch(setIsSettingModalOpen(true));
            } }>
              <img src={UserIcon} className={styles.optionIcon}></img>
              {intl.formatMessage({ id: "profile.menu.profile" })}</div>
            <div className={styles.option} onClick={handleLogout}>
              <img src={LogoutIcon} className={styles.optionIcon}></img>
              {intl.formatMessage({ id: "profile.menu.logout" })}</div>
          </div>
        </div>
      ) : (
        <div className={styles.menuContainer}>
          <div className={styles.optionContainerLogin}>
            <div className={styles.option} onClick={handleLogin}>Log In</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
