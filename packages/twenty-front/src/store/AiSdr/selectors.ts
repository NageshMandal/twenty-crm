import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAiSdr = (state: RootState) => state.aiSdr;

export const aiSdrSelector = createSelector(selectAiSdr, (state) => state);
