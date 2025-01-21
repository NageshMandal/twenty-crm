import axios from "../../utils/functions/axios";
import { ICustomSearch, IExportCSV, IReqLead, ITemplate } from "../../utils/types/leads";

class LeadApi {
  async getProspects(data = {}) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/prospects/search`,
      data
    );
    return response;
  }

  async getProspectDetail(id: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/prospects/${id}`
    );
    return response;
  }

  async getAutomationActivity(id: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/prospect/workflow-activities?prospect_id=${id}`
    );
    return response;
  }

  async addAutomation(req: IReqLead) {
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

  async handleHubSpot(req: IReqLead) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/integration-exports/hubspot`,
      {
        crm_type: "Lead",
        filter: {
          all: req.all,
          ids: req.ids,
          query: req.query,
        },
      }
    );
    return response;
  }

  async handleZapier(req: IReqLead) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/integration-exports/zapier`,
      {
        crm_type: "Lead",
        filter: {
          all: req.all,
          ids: req.ids,
          query: req.query,
        },
      }
    );
    return response;
  }

  async getFileExportsSetting() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/file-exports/settings`
    );
    return response;
  }

  async getFileExportsTemplate(objectType: number) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/export-templates?object_type=${objectType}`
    );
    return response;
  }

  async saveTemplate(data: Partial<ITemplate>) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/export-templates`,
      data
    );
    return response;
  }

  async exportCSV(data: IExportCSV) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/file-exports`,
      data
    );
    return response;
  }

  async getLeadTags() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/tags?limit=300`
    );
    return response;
  }

  async addListByTag(data: any) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/prospects/tags/batch-update`,
      data
    );
    return response;
  }

  async handleReply(data: any) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_WORKFLOW_API_URL}/prospect/workflow-response`,
      data
    );
    return response;
  }

  async getTechnology() {
    const response = await axios(true).get(`${process.env.REACT_APP_DEMAND_API_URL}/technologies`);
    return response;
  }

  async getTeam() {
    const response = await axios(true).get(`${process.env.REACT_APP_DEMAND_API_URL}/account/team`);
    return response;
  }

  async getLocation(query: any) {
    let response = null;
    if (query) {
      response = await axios(true).get(
        `${process.env.REACT_APP_DEMAND_API_URL}/addresses/search?q=${query}`
      );
    } else {
      response = await axios(true).get(`${process.env.REACT_APP_DEMAND_API_URL}/addresses/search`);
    }
    return response;
  }

  async handleCustomSearch(data: ICustomSearch) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/prospects/custom-search`,
      data
    );
    return response;
  }
}

export const leadApi = new LeadApi();
