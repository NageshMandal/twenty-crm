import { createReducer } from "@reduxjs/toolkit";

import {
  deleteAutomation,
  getAutomations,
  setBuilderScreenMode,
  setResetBuilderMessage,
  setValueBuilderMessage,
  setValueBuilderEmail,
  setResetBuilderEmail,
  setResetBuilderAiSdr,
  setValueBuilderAiSdr,
} from "./actions";
import { IWorkflow } from "../../utils/types/social-selling";
import {
  IBuilderAiSdr,
  IBuilderAiSdrSetup,
  IBuilderEmail,
  IBuilderMessage,
} from "../../utils/types/automation";

type State = {
  isAutomationPending: boolean;
  isDeleteAutomationPending: boolean;
  automations: IWorkflow[];
  builderMessage?: IBuilderMessage;
  builderAiSdr?: IBuilderAiSdr;
  builderAiSdrSetup?: IBuilderAiSdrSetup;
  builderEmail?: IBuilderEmail;
  isFullScreen: boolean;
};

const initialState: State = {
  isAutomationPending: false,
  isDeleteAutomationPending: false,
  automations: [],
  isFullScreen: false,
};

export const automationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getAutomations.pending, (state) => {
      state.isAutomationPending = true;
    })
    .addCase(getAutomations.rejected, (state) => {
      state.isAutomationPending = false;
    })
    .addCase(getAutomations.fulfilled, (state, { payload }) => {
      state.isAutomationPending = false;
      state.automations = payload.data;
    })

    .addCase(deleteAutomation.pending, (state) => {
      state.isDeleteAutomationPending = true;
    })
    .addCase(deleteAutomation.rejected, (state) => {
      state.isDeleteAutomationPending = false;
    })
    .addCase(deleteAutomation.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.isDeleteAutomationPending = false;
      const newArray = [...state.automations].filter((item) => item.id !== id);
      state.automations = newArray;
    })
    .addCase(setValueBuilderMessage, (state, { payload }) => {
      state.builderMessage = payload;
    })
    .addCase(setResetBuilderMessage, (state) => {
      state.builderMessage = undefined;
    })
    .addCase(setValueBuilderAiSdr, (state, { payload }) => {
      state.builderAiSdr = payload;
    })
    .addCase(setResetBuilderAiSdr, (state) => {
      state.builderAiSdr = undefined;
    })
    .addCase(setValueBuilderEmail, (state, { payload }) => {
      state.builderEmail = payload;
    })
    .addCase(setResetBuilderEmail, (state) => {
      state.builderEmail = undefined;
    })
    .addCase(setBuilderScreenMode, (state, { payload }) => {
      state.isFullScreen = payload;
    });
});
