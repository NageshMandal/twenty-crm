import { createReducer } from "@reduxjs/toolkit";

import {
  getAutomationActivity,
  getAutomations,
  getProspectDetail,
  getProspectsList,
  resetDetail,
} from "./actions";
import { IAutomationActivity, IProspect } from "../../utils/types/leads";
import { IWorkflow } from "../../utils/types/social-selling";

type State = {
  isProspectListPending: boolean;
  prospectList: IProspect[];
  isDetailsPending: boolean;
  prospect?: IProspect;
  isAutomationPending?: boolean;
  automationActivities?: IAutomationActivity[];
  automations: IWorkflow[];
  grandTotalLeads: any;
};

const initialState: State = {
  isProspectListPending: false,
  prospectList: [],
  isDetailsPending: false,
  isAutomationPending: false,
  automations: [],
  grandTotalLeads: 0,
};

export const leadReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getProspectsList.pending, (state) => {
      state.isProspectListPending = true;
    })
    .addCase(getProspectsList.rejected, (state) => {
      state.isProspectListPending = false;
    })
    .addCase(getProspectsList.fulfilled, (state, { payload }) => {
      state.isProspectListPending = false;
      const res = payload as any;
      if (res?.offset === 0) {
        state.prospectList = payload.data;
        state.grandTotalLeads = (payload as any).total;
      } else {
        state.prospectList = [...state.prospectList, ...payload.data];
      }
    })

    .addCase(getProspectDetail.pending, (state) => {
      state.isDetailsPending = true;
    })
    .addCase(getProspectDetail.rejected, (state) => {
      state.isDetailsPending = false;
    })
    .addCase(getProspectDetail.fulfilled, (state, { payload }) => {
      state.isDetailsPending = false;
      state.prospect = payload as unknown as IProspect;
    })

    .addCase(getAutomationActivity.pending, (state) => {
      state.isAutomationPending = true;
    })
    .addCase(getAutomationActivity.rejected, (state) => {
      state.isAutomationPending = false;
    })
    .addCase(getAutomationActivity.fulfilled, (state, { payload }) => {
      state.isDetailsPending = false;
      state.automationActivities = payload?.data?.data;
    })

    .addCase(getAutomations.pending, (state) => {
      state.isAutomationPending = true;
    })
    .addCase(getAutomations.rejected, (state) => {
      state.isAutomationPending = false;
    })
    .addCase(getAutomations.fulfilled, (state, { payload }) => {
      state.isDetailsPending = false;
      state.automations = payload.data;
    })

    .addCase(resetDetail, (state) => {
      state.isDetailsPending = false;
      state.prospect = undefined;
    });
});
