import { createAsyncThunk } from "@reduxjs/toolkit";

import { ICommentRequest } from "../../utils/types/social-selling";
import { commonApi } from "../../api/common";
import { aiSdrApi } from "../../api/ai-sdr";

export const getAiSdrList = createAsyncThunk("ai_sdr_list", async () => {
  try {
    const response = await commonApi.getWorkflow({ event_filter: "ai_sdr" });
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
    );
  }
});

export const deleteWorkflow = createAsyncThunk("workflow/delete", async (wid: number) => {
  try {
    await aiSdrApi.deleteWorkflow(wid);
    const params = { wid };
    return params;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});
