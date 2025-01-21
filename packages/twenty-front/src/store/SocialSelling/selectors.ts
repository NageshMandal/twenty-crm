import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectSocialSelling = (state: RootState) => state.socialSelling;

export const socialSellingSelector = createSelector(selectSocialSelling, (state) => state);
