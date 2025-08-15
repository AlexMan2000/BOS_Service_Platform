import { combineReducers } from "@reduxjs/toolkit";
import globalReducer from "./slice/globalSlice/globalSlice"
import userReducer from "./slice/userSlice/userSlice";

export const reducer = combineReducers({
    global: globalReducer,
    user: userReducer
});

export type RootState = ReturnType<typeof reducer>;