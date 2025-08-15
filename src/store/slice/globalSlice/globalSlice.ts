import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import MobileDetect from "mobile-detect"


interface GlobalState {
    sessionId: string
    locale: string
    sideBarCollapse: boolean
    pageStatus: string
    pageIndex: number
    isMobile: boolean
    isWindows: boolean
    isMac: boolean,
    anyChangeOnCurrentPage: boolean // used for protective outgoing link jumping
    shouldTriggerRefresh: boolean // used for protective outgoing link jumping
    isChatSideBarCollapsed: boolean
    isInboxSideBarCollapsed: boolean
    isSettingModalOpen: boolean
    currentApp: 'chat' | 'inbox'
}


const getInitialLocale = () => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
        return savedLocale;
    }

    // 获取浏览器默认语言，例如：'en-US'、'zh-CN' -> 'en'、'zh'
    const browserLocale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
    const locale = browserLocale.toLowerCase().slice(0, 2);
    console.log("browserLocale", browserLocale, locale);
    return locale;

}


const initialState: GlobalState = {
    sessionId: '',
    locale: getInitialLocale(),
    sideBarCollapse: false,
    pageStatus: "/dashboard",
    pageIndex: 0,
    isMobile: false,
    isWindows: false,
    isMac: false,
    anyChangeOnCurrentPage: false,
    shouldTriggerRefresh: false,
    isChatSideBarCollapsed: false,
    isInboxSideBarCollapsed: false,
    isSettingModalOpen: false,
    currentApp: 'chat'
}


export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setSessionId: (state, action) => {
            state.sessionId = action.payload.sessionId;
        },
        setLocale: (state, action) => {
            state.locale = action.payload.locale;
            localStorage.setItem("locale", state.locale);
        },
        setSideBarCollapse: (state, action) => {
            state.sideBarCollapse = action.payload.sideBarCollapse;
        },
        setPageStatus: (state, action) => {
            state.pageStatus = action.payload.pageStatus;
        },
        setPageIndex: (state, action) => {
            state.pageIndex = action.payload.pageIndex;
        },
        setOSInfo: (state) => {
            const md = new MobileDetect(window.navigator.userAgent);
            const userAgent = navigator.userAgent.toLowerCase();
            const isMac = userAgent.includes("mac");
            const isWindows = userAgent.includes("win");
            const isMobile = !!md.mobile();
            state.isMobile = isMobile;
            state.isWindows = isWindows;
            state.isMac = isMac;
        },
        setAnyChangeOnCurrentPage: (state, action: PayloadAction<boolean>) => {
            state.anyChangeOnCurrentPage = action.payload;
        },
        setShouldTriggerRefresh: (state, action: PayloadAction<boolean>) => {
            state.shouldTriggerRefresh = action.payload;
        },
        setIsChatSideBarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isChatSideBarCollapsed = action.payload;
        },
        setIsInboxSideBarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isInboxSideBarCollapsed = action.payload;
        },
        setIsSettingModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isSettingModalOpen = action.payload;
        },
        setCurrentApp: (state, action: PayloadAction<'chat' | 'inbox'>) => {
            state.currentApp = action.payload;
        }
    }
})


export const selectGlobalState = (state: RootState) => state.global

export const { setSessionId
    , setLocale
    , setSideBarCollapse
    , setOSInfo
    , setPageStatus
    , setPageIndex
    , setAnyChangeOnCurrentPage
    , setShouldTriggerRefresh
    , setIsChatSideBarCollapsed
    , setIsInboxSideBarCollapsed
    , setIsSettingModalOpen
    , setCurrentApp
} = globalSlice.actions

export default globalSlice.reducer
