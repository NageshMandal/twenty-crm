import axios from "../../utils/functions/axios";

class IntegrationApi {
  async getIntegration() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations`
    );
    return response;
  }

  async setDefaultIntegration(slug: string) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/set-default`
    );
    return response;
  }

  async toggleIntegration(slug: string, active: boolean) {
    const action = active ? "deactivate" : "activate";
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/${action}`
    );
    return response;
  }

  async showIntegration(slug: string) {
    // if (slug === "zapier") {
    //   return Promise.resolve({ status: true });
    // }
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/show`
    );
    return response;
  }

  async authIntegration(slug: string, data: {}) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/auth`,
      data
    );
    return response;
  }

  async logoutIntegration(slug: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/auth/logout`
    );
    return response;
  }

  async getIntegrationSettings(slug: string) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/settings`
    );
    return response;
  }

  async updateIntegrationSettings(slug: string, data: {}) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/settings/update`,
      data
    );
    return response;
  }

  async getIntegrationFields(slug: string, params?: {}) {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/fields`,
      { params }
    );
    return response;
  }

  async integrationMap(slug: string, crm_field_hash: string, st_field_name: string) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/field/map`,
      {
        crm_field_hash,
        st_field_name,
      }
    );
    return response;
  }

  async integrationUnMap(slug: string, crm_field_hash: string) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/${slug}/field/unmap`,
      {
        crm_field_hash,
      }
    );
    return response;
  }

  async zapierActivateEvent(id: string) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/zapier/event/${id}/activate`
    );
    return response;
  }

  async zapierDeactivateEvent(id: string) {
    const response = await axios(true).put(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/zapier/event/${id}/deactivate`
    );
    return response;
  }

  async zapierGetApiKey() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/zapier/api-key`
    );
    return response;
  }

  async zapierGenerateApiKey() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/dashboard/integrations/zapier/api-key/generate`
    );
    return response;
  }

  async integrate(slug: string, data: {}) {
    const response = await axios(true).post(
      `${process.env.REACT_APP_DEMAND_API_URL}/integration-exports/${slug}`,
      data
    );
    return response;
  }
}

export const integrationApi = new IntegrationApi();
