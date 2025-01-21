import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAiSdrSetup = (state: RootState) => state.aiSdrSetup;

export const aiSdrSetupSelector = createSelector(selectAiSdrSetup, (state) => state);
