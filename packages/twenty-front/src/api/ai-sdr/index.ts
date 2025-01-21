import axios from "../../utils/functions/axios";
import { ICommentRequest, ICreateSocial } from "../../utils/types/social-selling";

class AiSdrApi {
  async deleteWorkflow(wid: number) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wid}/delete`
    );
    return response;
  }
}

export const aiSdrApi = new AiSdrApi();
