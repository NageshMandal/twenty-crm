import { createAsyncThunk } from "@reduxjs/toolkit";

import { ICommentRequest } from "../../utils/types/social-selling";
import { commonApi } from "../../api/common";
import { socialSellingApi } from "../../api/social-selling";

export const getSocialList = createAsyncThunk("social_list_engage", async () => {
  try {
    const response = await commonApi.getWorkflow({ event_filter: "social_selling" });
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.errors?.email[0] ?? error?.response?.data?.message ?? error.message
    );
  }
});

export const getProspectList = createAsyncThunk("prospect_list", async (wid: string) => {
  try {
    const response = await socialSellingApi.getSocialSelling(wid);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getCommentedMessage = createAsyncThunk("commented_message", async (wid: string) => {
  try {
    const response = await socialSellingApi.getSocialSellingMessage(wid);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const addOneComment = createAsyncThunk(
  "post/add-comment",
  async (request: ICommentRequest) => {
    try {
      await socialSellingApi.addOneComment(request);
      const params = { pid: request.pid, postId: request.postId };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/update",
  async (request: ICommentRequest) => {
    try {
      await socialSellingApi.updateComment(request);
      const params = { cid: request.cid, message: request.message };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const addCommentAll = createAsyncThunk(
  "post/add-comment-all",
  async (request: Partial<ICommentRequest>) => {
    try {
      await socialSellingApi.addAllComment(request);
      const params = { pid: request.pid };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const handleSkipPost = createAsyncThunk(
  "post/skip",
  async (request: Partial<ICommentRequest>) => {
    try {
      await socialSellingApi.handleSkipPost(request);
      const params = { pid: request.pid };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const skipSinglePost = createAsyncThunk(
  "single_post/skip",
  async (request: Partial<ICommentRequest>) => {
    try {
      await socialSellingApi.skipSinglePost(request);
      const params = { pid: request.pid, postId: request.postId };
      return params;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const deleteWorkflow = createAsyncThunk("workflow/delete", async (wid: number) => {
  try {
    await socialSellingApi.deleteWorkflow(wid);
    const params = { wid };
    return params;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getAskAiPrompts = createAsyncThunk("workflow/ask_ai/prompt", async (wid: string) => {
  try {
    const response = await socialSellingApi.getAskAiPrompt(wid);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getSSTones = createAsyncThunk("workflow/ss_tones", async (wid: string) => {
  try {
    const response = await socialSellingApi.getSSTones("0");
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getSSLangs = createAsyncThunk("workflow/ss_langs", async (wid: string) => {
  try {
    const response = await socialSellingApi.getSSLangs("0");
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const editCommentByAi = createAsyncThunk(
  "workflow/ask_ai/edit",
  async (request: ICommentRequest) => {
    try {
      await socialSellingApi.editCommentByAskAi(request);
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);

export const editCommentByLang = createAsyncThunk(
  "workflow/ss_langs/edit",
  async (request: ICommentRequest) => {
    try {
      await socialSellingApi.editCommentByLang(request);
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);
export const getAutomations = createAsyncThunk("prospect/automations", async () => {
  try {
    const response = await commonApi.getWorkflow({ event_filter: "my_contact" });
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});
export const getToAutoStats = createAsyncThunk("prospect/get-to-auto", async (request: string) => {
  try {
    const response = await socialSellingApi.getToAuto(request);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const updateToAutoStats = createAsyncThunk(
  "prospect/update-to-auto",
  async (request: ICommentRequest) => {
    try {
      const response = await socialSellingApi.updateToAuto(request);
      return response;
    } catch (error) {
      throw error?.response?.data?.message ?? error.message;
    }
  }
);
