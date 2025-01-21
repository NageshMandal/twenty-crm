import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { authApi } from "../../api/auth";
import { userApi } from "../../api/user";

export const getUserInfo = createAsyncThunk("account/user", async () => {
  try {
    const response = await authApi.getUserInfo();
    return response;
  } catch (error: any) {
    throw (
      error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
    );
  }
});

export const logout = createAsyncThunk("account/logout", async () => {
  try {
    const response = await authApi.logout();
    return response;
  } catch (error: any) {
    throw (
      error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
    );
  }
});

export const getCookie = createAsyncThunk("account/cookie", async () => {
  try {
    const response = await userApi.getCookieInfo();
    return response;
  } catch (error: any) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getLinkedinConnectionStatus = createAsyncThunk(
  "account/linkedinconnectionstatus",
  async () => {
    try {
      const response = await userApi.getLinkedinConnectionInfo();
      return response;
    } catch (error: any) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const setDarkMode = createAction<boolean>("darkMode");
