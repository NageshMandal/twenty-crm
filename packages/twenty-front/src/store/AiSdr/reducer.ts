import { createReducer } from "@reduxjs/toolkit";

import { deleteWorkflow, getAiSdrList } from "./actions";
import {
  IAskAiPrompt,
  ICommentsInfo,
  IWorkflow,
  IProspect,
} from "../../utils/types/social-selling";

type State = {
  isPending: boolean;
  error?: string;
  workflow: IWorkflow[];
  totalLength?: number;
  isAiSdrListPending: boolean;
  aiSdrInfoList: IProspect[];
  isDeletePending?: boolean;
  isDeleteError?: string;
  automations: IWorkflow[];
  isAutomationPending?: boolean;
  isDetailsPending: boolean;
  toAuto: boolean;
  toAutoId: any;
};

const initialState: State = {
  isPending: false,
  workflow: [],
  aiSdrInfoList: [],
  isAiSdrListPending: false,
  isAutomationPending: false,
  automations: [],
  isDetailsPending: false,
  toAuto: false,
  toAutoId: [],
};

export const aiSdrReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getAiSdrList.pending, (state) => {
      state.isPending = true;
      state.error = undefined;
    })
    .addCase(getAiSdrList.rejected, (state, { error }) => {
      state.isPending = false;
      state.error = error?.message;
    })
    .addCase(getAiSdrList.fulfilled, (state, { payload }) => {
      state.workflow = payload.data;
      state.totalLength = payload.data.length;
      state.isPending = false;
    })
    .addCase(deleteWorkflow.pending, (state) => {
      state.isDeletePending = true;
    })
    .addCase(deleteWorkflow.fulfilled, (state, { payload }) => {
      const { wid } = payload;
      state.isDeletePending = false;
      const workflowArray = [...state.workflow];
      const result = workflowArray.filter((item) => item.id !== wid);
      state.workflow = result;
    });
});
