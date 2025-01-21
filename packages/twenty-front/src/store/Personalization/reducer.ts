import { createReducer } from "@reduxjs/toolkit";

import {
  deleteManualWorkflow,
  editMessageByAi,
  getManualProspects,
  getPersonalWorkflow,
  handleSendProspect,
  handleSkipPost,
  updateMessage,
} from "./actions";
import { IProspect, IWorkflow } from "../../utils/types/social-selling";

type State = {
  isWorkflowPending: boolean;
  workflowList: IWorkflow[];
  workflowLength?: number;
  prospects: IProspect[];
  isProspectsPending: boolean;
  isDeletePending: boolean;
  isMessagePending: boolean;
  isAskAiPending: boolean;
};

const initialState: State = {
  isWorkflowPending: false,
  workflowList: [],
  prospects: [],
  isProspectsPending: false,
  isDeletePending: false,
  isMessagePending: false,
  isAskAiPending: false,
};

export const personalizationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getPersonalWorkflow.pending, (state) => {
      state.isWorkflowPending = true;
    })
    .addCase(getPersonalWorkflow.rejected, (state) => {
      state.isWorkflowPending = false;
    })
    .addCase(getPersonalWorkflow.fulfilled, (state, { payload }) => {
      state.isWorkflowPending = false;
      const manualProspects = payload.data?.filter((item: any) => item.manual_prospect_count !== 0);
      state.workflowList = [...manualProspects];
      state.workflowLength = manualProspects?.length;
    })

    .addCase(deleteManualWorkflow.pending, (state) => {
      state.isDeletePending = true;
    })
    .addCase(deleteManualWorkflow.rejected, (state) => {
      state.isDeletePending = false;
    })
    .addCase(deleteManualWorkflow.fulfilled, (state, { payload }) => {
      const { wid } = payload;
      state.isDeletePending = false;
      const workflowArray = [...state.workflowList];
      const result = workflowArray.filter((item) => item.id !== wid);
      state.workflowList = result;
    })

    .addCase(getManualProspects.pending, (state) => {
      state.isProspectsPending = true;
    })
    .addCase(getManualProspects.rejected, (state) => {
      state.isProspectsPending = false;
    })
    .addCase(getManualProspects.fulfilled, (state, { payload }) => {
      state.isProspectsPending = false;
      if (payload.page == 1) {
        state.prospects = payload.data as unknown as IProspect[];
      } else {
        state.prospects = [...state.prospects, ...(payload.data as unknown as IProspect[])];
      }
    })

    .addCase(handleSkipPost.fulfilled, (state, { payload }) => {
      const { pid } = payload;
      const prospectList = [...state.prospects];
      const result = prospectList.filter((item) => item.id !== pid);
      state.prospects = result;
    })

    .addCase(handleSendProspect.fulfilled, (state, { payload }) => {
      const { pid } = payload;
      const prospectList = [...state.prospects];
      const result = prospectList.filter((item) => item.id !== pid);
      state.prospects = result;
    })

    .addCase(updateMessage.pending, (state) => {
      state.isMessagePending = true;
    })
    .addCase(updateMessage.rejected, (state) => {
      state.isMessagePending = false;
    })
    .addCase(updateMessage.fulfilled, (state, { payload }) => {
      state.isMessagePending = false;
      const { pid, message, sid } = payload;
      const prospectIndex = [...state.prospects].findIndex((item) => item.id === pid);
      const messageIndex = [...state.prospects]
        .find((item) => item.id === pid)
        ?.messages.findIndex((item) => item.step_id === sid) as number;
      state.prospects[prospectIndex].messages[messageIndex].message = message as string;
    })

    .addCase(editMessageByAi.pending, (state) => {
      state.isAskAiPending = true;
    })
    .addCase(editMessageByAi.rejected, (state) => {
      state.isAskAiPending = false;
    })
    .addCase(editMessageByAi.fulfilled, (state, { payload }) => {
      state.isAskAiPending = false;
      const { pid, message, sid } = payload;
      const prospectIndex = [...state.prospects].findIndex((item) => item.id === pid);
      const messageIndex = [...state.prospects]
        .find((item) => item.id === pid)
        ?.messages.findIndex((item) => item.step_id === sid) as number;
      state.prospects[prospectIndex].messages[messageIndex].message = message as string;
    });
});
