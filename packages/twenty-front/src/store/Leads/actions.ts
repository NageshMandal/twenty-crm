import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { leadApi } from "../../api/leads";
import { IProspectReq } from "../../utils/types/leads";
import { commonApi } from "../../api/common";

export const getProspectsList = createAsyncThunk("prospect/list", async (req: IProspectReq) => {
  try {
    const response = await leadApi.getProspects(req);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getProspectDetail = createAsyncThunk("prospect/detail", async (id: string) => {
  try {
    const response = await leadApi.getProspectDetail(id);
    return response;
  } catch (error) {
    throw error?.response?.data?.message ?? error.message;
  }
});

export const getAutomationActivity = createAsyncThunk(
  "prospect/automation_activity",
  async (id: string) => {
    try {
      const response = await leadApi.getAutomationActivity(id);
      return response;
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

export const resetDetail = createAction("prospect/reset");
