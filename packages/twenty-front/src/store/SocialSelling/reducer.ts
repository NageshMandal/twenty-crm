import { createReducer } from "@reduxjs/toolkit";

import {
  addCommentAll,
  addOneComment,
  deleteWorkflow,
  getAskAiPrompts,
  getAutomations,
  getCommentedMessage,
  getProspectList,
  getSSLangs,
  getSSTones,
  getSocialList,
  getToAutoStats,
  handleSkipPost,
  skipSinglePost,
  updateComment,
  updateToAutoStats,
} from "./actions";
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
  isSocialListPending: boolean;
  socialSellingInfoList: IProspect[];
  socialSellingInfoError?: string;
  commentedList: ICommentsInfo[];
  commentedError?: string;
  isCommentedPending?: boolean;
  isOneCommentPending: boolean;
  isOneCommentedError?: string;
  isAllCommentPending: boolean;
  isAllCommentError?: string;
  isSkipPending: boolean;
  isSkipError?: string;
  isDeletePending?: boolean;
  isDeleteError?: string;
  isUpdateCommentPending?: boolean;
  isUpdateCommentError?: string;
  askAiPrompts: IAskAiPrompt[];
  ssLangs: any;
  ssTones: any;
  automations: IWorkflow[];
  isAutomationPending?: boolean;
  isDetailsPending: boolean;
  toAuto: boolean;
  toAutoId: any;
};

const initialState: State = {
  isPending: false,
  workflow: [],
  socialSellingInfoList: [],
  isSocialListPending: false,
  commentedList: [],
  isCommentedPending: false,
  isOneCommentPending: false,
  isAllCommentPending: false,
  isSkipPending: false,
  askAiPrompts: [],
  ssLangs: [],
  ssTones: [],
  isAutomationPending: false,
  automations: [],
  isDetailsPending: false,
  toAuto: false,
  toAutoId: [],
};

export const socialSellingReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getSocialList.pending, (state) => {
      state.isPending = true;
      state.error = undefined;
    })
    .addCase(getSocialList.rejected, (state, { error }) => {
      state.isPending = false;
      state.error = error?.message;
    })
    .addCase(getSocialList.fulfilled, (state, { payload }) => {
      state.workflow = payload.data;
      state.totalLength = payload.data.length;
      state.isPending = false;
    })

    .addCase(getProspectList.pending, (state) => {
      state.isSocialListPending = true;
    })
    .addCase(getProspectList.rejected, (state, { error }) => {
      state.isSocialListPending = false;
      state.socialSellingInfoError = error?.message;
    })
    .addCase(getProspectList.fulfilled, (state, { payload }) => {
      state.isSocialListPending = false;
      state.socialSellingInfoList = payload as unknown as IProspect[];
    })

    .addCase(getCommentedMessage.pending, (state) => {
      state.isCommentedPending = true;
    })
    .addCase(getCommentedMessage.rejected, (state, { error }) => {
      state.isCommentedPending = false;
      state.commentedError = error?.message;
    })
    .addCase(getCommentedMessage.fulfilled, (state, { payload }) => {
      state.isCommentedPending = false;
      state.commentedList = payload.data;
    })

    .addCase(addOneComment.pending, (state) => {
      state.isOneCommentPending = true;
    })
    .addCase(addOneComment.rejected, (state, { error }) => {
      state.isOneCommentPending = false;
      state.isOneCommentedError = error?.message;
    })
    .addCase(addOneComment.fulfilled, (state, { payload }) => {
      const { pid, postId } = payload;
      state.isOneCommentPending = false;
      const prospectList = [...state.socialSellingInfoList];
      const newValue = prospectList.map((item) => {
        if (item.id === pid) {
          const index = item.profile.recent_posts.findIndex((postItem) => postItem.id === postId);
          item.profile.recent_posts[index].is_commented = 1;
        }
        return item;
      });
      state.socialSellingInfoList = newValue;
    })

    .addCase(addCommentAll.pending, (state) => {
      state.isAllCommentPending = true;
    })
    .addCase(addCommentAll.rejected, (state, { error }) => {
      state.isAllCommentPending = false;
      state.isAllCommentError = error?.message;
    })
    .addCase(addCommentAll.fulfilled, (state, { payload }) => {
      const { pid } = payload;
      state.isAllCommentPending = false;
      const prospectList = [...state.socialSellingInfoList];
      const newValue = prospectList.map((item) => {
        if (item.id === pid) {
          item.profile.recent_posts.forEach((postItem) => {
            postItem.is_commented = 1;
          });
        }
        return item;
      });
      state.socialSellingInfoList = newValue;
    })

    .addCase(handleSkipPost.pending, (state) => {
      state.isSkipPending = true;
    })
    .addCase(handleSkipPost.rejected, (state, { error }) => {
      state.isSkipPending = false;
      state.isSkipError = error?.message;
    })
    .addCase(handleSkipPost.fulfilled, (state, { payload }) => {
      const { pid } = payload;
      state.isSkipPending = false;
      const prospectList = [...state.socialSellingInfoList];
      const result = prospectList.filter((item) => item.id !== pid);
      state.socialSellingInfoList = result;
    })

    .addCase(skipSinglePost.pending, (state) => {
      state.isSkipPending = true;
    })
    .addCase(skipSinglePost.rejected, (state, { error }) => {
      state.isSkipPending = false;
      state.isSkipError = error?.message;
    })
    .addCase(skipSinglePost.fulfilled, (state, { payload }) => {
      const { pid, postId } = payload;
      state.isSkipPending = false;
      // const prospectList = [...state.socialSellingInfoList];
      // const result = prospectList.filter((item) => item.id !== pid);
      const comments = [...state.commentedList];
      const commentsList = comments.filter((item) => item.post_id !== postId);
      state.commentedList = commentsList;
      // state.socialSellingInfoList = result;
    })

    .addCase(deleteWorkflow.pending, (state) => {
      state.isDeletePending = true;
    })
    .addCase(deleteWorkflow.rejected, (state, { error }) => {
      state.isDeletePending = false;
      state.isSkipError = error?.message;
    })
    .addCase(deleteWorkflow.fulfilled, (state, { payload }) => {
      const { wid } = payload;
      state.isDeletePending = false;
      const workflowArray = [...state.workflow];
      const result = workflowArray.filter((item) => item.id !== wid);
      state.workflow = result;
    })

    .addCase(updateComment.pending, (state) => {
      state.isUpdateCommentPending = true;
    })
    .addCase(updateComment.rejected, (state, { error }) => {
      state.isUpdateCommentPending = false;
      state.isUpdateCommentError = error?.message;
    })
    .addCase(updateComment.fulfilled, (state, { payload }) => {
      const { cid, message } = payload;
      state.isUpdateCommentPending = false;
      const comments = [...state.commentedList];
      const index = comments.findIndex((item) => item.comment_id === cid);
      comments[index].message = message;
      state.commentedList = comments;
    })

    .addCase(getAskAiPrompts.fulfilled, (state, { payload }) => {
      state.askAiPrompts = payload as unknown as IAskAiPrompt[];
    })
    .addCase(getSSLangs.fulfilled, (state, { payload }) => {
      state.ssLangs = payload as unknown as any;
    })
    .addCase(getSSTones.fulfilled, (state, { payload }) => {
      state.ssTones = payload as unknown as any;
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
    .addCase(getToAutoStats.fulfilled, (state, { payload }) => {
      // console.log("the payload is here : ", payload);
      const { toAuto, toAutoId } = payload as unknown as any;
      state.toAuto = toAuto;
      state.toAutoId = toAutoId;
    })
    .addCase(updateToAutoStats.fulfilled, (state, { payload }) => {
      // console.log("the payload is here : ", payload);
      const { toAuto, toAutoId } = payload as unknown as any;
      state.toAuto = toAuto;
      state.toAutoId = toAutoId;
    });
});
