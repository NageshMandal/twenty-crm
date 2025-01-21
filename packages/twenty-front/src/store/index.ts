import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { authReducer } from "./Auth";
import { socialSellingReducer } from "./SocialSelling";
import { leadReducer } from "./Leads";
import { personalizationReducer } from "./Personalization";
import { automationReducer } from "./Automation";
import { visitorReducer } from "./Vistor";
import { aiSdrReducer } from "./AiSdr";
import { aiSdrSetupReducer } from "./AiSdrSetup";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socialSelling: socialSellingReducer,
    aiSdr: aiSdrReducer,
    leads: leadReducer,
    personalization: personalizationReducer,
    automation: automationReducer,
    visitor: visitorReducer,
    aiSdrSetup: aiSdrSetupReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
