import { createReducer } from "@reduxjs/toolkit";

import { handleGetAccount, handleUpdateAccount, sendDeveloperEmail } from "./actions";
import { IVisitorAccount } from "src/utils/types/visitor";
import { IWorkflow } from "src/utils/types/social-selling";
import { getAutomations } from "./actions";

type State = {
  domain?: string;
  token?: string;
  includes?: any[];
  excludes?: {
    domains: string[];
    ips: string[];
    pages: string[];
  };
  isEmailPending: boolean;
  isAccountPending: boolean;
  automations: IWorkflow[];
  isAutomationPending?: boolean;
  isDetailsPending: boolean;
};

const initialState: State = {
  isEmailPending: false,
  isAccountPending: false,
  automations: [],
  isDetailsPending: false,
  isAutomationPending: false,
};

export const visitorReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(handleGetAccount.fulfilled, (state, action) => {
      const result = action.payload as unknown as IVisitorAccount;
      state.domain = result.origins[0];
      state.token = result.token;
      state.excludes = result.excludes;
      state.includes = result.includes;
    })
    .addCase(handleUpdateAccount.pending, (state) => {
      state.isAccountPending = true;
    })
    .addCase(handleUpdateAccount.rejected, (state) => {
      state.isAccountPending = false;
    })
    .addCase(handleUpdateAccount.fulfilled, (state, action) => {
      const result = action.payload;
      if (result.origins) {
        state.domain = result.origins[0];
      }
      if (result.includes) {
        state.includes = result.includes;
      }
      if (result.excludes) {
        state.excludes = result.excludes;
      }
      state.isAccountPending = false;
    })
    .addCase(sendDeveloperEmail.pending, (state) => {
      state.isEmailPending = true;
    })
    .addCase(sendDeveloperEmail.rejected, (state) => {
      state.isEmailPending = false;
    })
    .addCase(sendDeveloperEmail.fulfilled, (state) => {
      state.isEmailPending = false;
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
    });
});
