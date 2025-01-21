import axios from "../../utils/functions/axios";
import { ICustomSearch } from "../../utils/types/leads";
import { ICompanyProspect, IEmailDeveloper, IReqVisitor } from "../../utils/types/visitor";

class VisitorApi {
  async getPeopleVisitor(params = {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/search-data`,
      {
        params,
      }
    );
    return response;
  }

  async getCompanyVisitor(params = {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/views`,
      {
        params,
      }
    );
    return response;
  }

  async getSegments(params = {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/segments?segment_type=visitors`,
      {
        params,
      }
    );
    return response;
  }

  async getCompanyProspects(id: string, params = {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/companies/${id}/prospect`,
      {
        params,
      }
    );
    return response;
  }

  async handleSaveProspect(data: ICompanyProspect) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/prospects`,
      data
    );
    return response;
  }

  async handleGetAccount() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/account`
    );
    return response;
  }

  async handleUpdateAccount(data: any) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/account`,
      data
    );
    return response;
  }

  async sendEmailToDeveloper(data: IEmailDeveloper) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/acquire/account/send-developer-email`,
      data
    );
    return response;
  }

  async addAutomation(req: IReqVisitor) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/workflows/${req.wid}/prospects`,
      {
        filter: {
          all: req.all,
          ids: req.ids,
          query: req.query,
        },
      }
    );
    return response;
  }

  async handleCustomSearchByTrackingId(data: ICustomSearch) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/prospects/search-by-trackingid`,
      data
    );
    return response;
  }
}

export const visitorApi = new VisitorApi();
