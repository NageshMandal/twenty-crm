import axios from "../../utils/functions/axios";
import { ICommentRequest, ICreateSocial } from "../../utils/types/social-selling";

class SocialSellingApi {
  async getSocialSelling(id: string, params = {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${id}/social-selling-all`,
      {
        params,
      }
    );
    return response;
  }

  async createSocialSelling(data: ICreateSocial) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/socialUpdate`,
      data
    );
    return response;
  }

  async deleteWorkflow(wid: number) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/delete`
    );
    return response;
  }

  async getSocialSellingMessage(id: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${id}/social-prospects/messages`
    );
    return response;
  }

  async addOneComment(req: ICommentRequest) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/comment/${req.sid}/comment-id/${req.cid}`,
      { message: req.message }
    );
    return response;
  }

  async updateComment(req: ICommentRequest) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/messages/${req.sid}/comment-id/${req.cid}`,
      { message: req.message }
    );
    return response;
  }

  async addAllComment(req: Partial<ICommentRequest>) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/process`
    );
    return response;
  }

  async handleSkipPost(req: Partial<ICommentRequest>) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/comment/${req.sid}/comment-id/${req.cid}/skip-post/${req.postId}`
    );
    return response;
  }

  async skipSinglePost(req: Partial<ICommentRequest>) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/comment/${req.sid}/comment-id/${req.cid}/skip-single-post/${req.postId}`
    );
    return response;
  }

  async editCommentByAskAi(req: Partial<ICommentRequest>) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-prospects/${req.pid}/edit-comment/${req.sid}/comment-id/${req.cid}/prompt-id/${req.promptId}`,
      { message: req.message }
    );
    return response;
  }

  async editCommentByLang(req: Partial<ICommentRequest>) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/ss-lang-edit/${req.pid}/edit-comment/${req.sid}/comment-id/${req.cid}/ss-lang-id/${req.langId}`,
      { message: req.message }
    );
    return response;
  }

  async getAskAiPrompt(wid: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/askai-prompts`
    );
    return response;
  }

  async getSSTones(wid: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/ss-tones-prompts`
    );
    return response;
  }

  async getSSLangs(wid: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/ss-langs`
    );
    return response;
  }

  async getToAuto(wid: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/social-selling/get-to-auto`
    );
    return response;
  }

  async updateToAuto(req: ICommentRequest) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${req.wid}/social-selling/update-to-auto/to-auto/${req.toAuto}/to-auto-id/${req.toAutoId}`
    );
    return response;
  }
}

export const socialSellingApi = new SocialSellingApi();
