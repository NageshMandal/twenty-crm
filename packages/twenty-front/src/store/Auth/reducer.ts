import { createReducer } from "@reduxjs/toolkit";

import {
  getCookie,
  getLinkedinConnectionStatus,
  getUserInfo,
  logout,
  setDarkMode,
} from "./actions";
import { ICookieInfo, ILinkedinConnectionStatus, IUser } from "../../utils/types";

type AuthState = {
  isPending: boolean;
  error?: string;
  userInfo?: IUser;
  dark: boolean;
  cookieInfo?: ICookieInfo;
  linkedinConnectionStatus?: ILinkedinConnectionStatus;
};

const initialState: AuthState = {
  isPending: false,
  dark: false,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getUserInfo.pending, (state) => {
      state.isPending = true;
      state.error = undefined;
    })
    .addCase(getUserInfo.rejected, (state, { error }) => {
      state.isPending = false;
      state.error = error?.message;
    })
    .addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.isPending = false;
      state.userInfo = payload as unknown as IUser;
    })
    .addCase(logout.fulfilled, (state, {}) => {
      state.userInfo = undefined;
    })
    .addCase(getCookie.fulfilled, (state, { payload }) => {
      state.cookieInfo = payload as unknown as ICookieInfo;
    })
    .addCase(getLinkedinConnectionStatus.fulfilled, (state, { payload }) => {
      state.linkedinConnectionStatus = payload as unknown as ILinkedinConnectionStatus;
    })
    .addCase(setDarkMode, (state, { payload }) => {
      state.dark = payload;
    });
});
