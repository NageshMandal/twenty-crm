import axios from "../../utils/functions/axios";

class CommonApi {
  async getWorkflow(params = {}) {
    const response = await axios(true).get(`${process.env.REACT_APP_WORKFLOW_API_URL}/workflow`, {
      params,
    });
    return response;
  }
}

export const commonApi = new CommonApi();
