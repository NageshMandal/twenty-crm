import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { automationApi } from "../../api/automation";
import {
  IBuilderAiSdr,
  IBuilderAiSdrSetup,
  IBuilderEmail,
  IBuilderMessage,
} from "../../utils/types/automation";

export const getAutomations = createAsyncThunk("automation/list", async () => {
  try {
    const response = await automationApi.getAutomationsList();
    return response;
  } catch (error: any) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const deleteAutomation = createAsyncThunk("automation/delete", async (id: number) => {
  try {
    await automationApi.deleteAutomationProcessFromList(id);
    return { id };
  } catch (error: any) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const setValueBuilderMessage = createAction<IBuilderMessage>("builder/message/show");

export const setResetBuilderMessage = createAction("builder/message/reset");

export const setValueBuilderAiSdr = createAction<IBuilderAiSdr>("builder/aisdr/show");

export const setResetBuilderAiSdr = createAction("builder/aisdr/reset");

export const setValueBuilderAiSdrSetup =
  createAction<IBuilderAiSdrSetup>("builder/aisdrsetup/show");

export const setResetBuilderAiSdrSetup = createAction("builder/aisdrsetup/reset");

export const setValueBuilderEmail = createAction<IBuilderEmail>("builder/email/show");

export const setResetBuilderEmail = createAction("builder/email/reset");

export const setBuilderScreenMode = createAction<boolean>("builder/screen");
