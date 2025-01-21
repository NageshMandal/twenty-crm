import { createAsyncThunk } from "@reduxjs/toolkit";

import { IEditMessage, IManualReq, IResMessage } from "../../utils/types/personalization";
import { commonApi } from "../../api/common";
import { personalizationApi } from "../../api/personalization";
import { socialSellingApi } from "../../api/social-selling";

export const getPersonalWorkflow = createAsyncThunk("personal/manual_workflow", async () => {
  try {
    const response = await commonApi.getWorkflow({ event_filter: "manual_prospect" });
    return response;
  } catch (error: any) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const deleteManualWorkflow = createAsyncThunk(
  "personal/workflow/delete",
  async (wid: number) => {
    try {
      await socialSellingApi.deleteWorkflow(wid);
      const params = { wid };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const getManualProspects = createAsyncThunk(
  "personal/prospects",
  async (req: IManualReq) => {
    try {
      const response = await personalizationApi.getManualProspects(req);
      return { data: response, page: req.page };
    } catch (error: any) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const handleSkipPost = createAsyncThunk("personal/post/skip", async (req: IManualReq) => {
  try {
    await personalizationApi.handleSkipPost(req);
    const params = { pid: req.pid };
    return params;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const handleSendProspect = createAsyncThunk(
  "personal/post/send",
  async (req: IManualReq) => {
    try {
      await personalizationApi.handleSendProspect(req);
      const params = { pid: req.pid };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const updateMessage = createAsyncThunk(
  "message/update",
  async (req: Partial<IEditMessage>) => {
    try {
      await personalizationApi.updateMessage(req);
      const params = { pid: req.pid, sid: req.sid, message: req.message };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const editMessageByAi = createAsyncThunk(
  "workflow/ask_ai/edit-message",
  async (req: Partial<IEditMessage>) => {
    try {
      const res = (await personalizationApi.editMessageByAskAi(req)) as unknown as IResMessage;
      return { pid: req.pid, sid: req.sid, message: res.messages };
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);
