import axios from "../../utils/functions/axios";

class AuthApi {
  async login(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/account/login`,
      data
    );
    return response;
  }

  async forgotPass(data: any) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/account/password/email`,
      data
    );
    return response;
  }

  async restorePass(data: any) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/account/password/reset`,
      data
    );
    return response;
  }

  async getUserInfoByIp() {
    const response = await axios().get(`${process.env.REACT_APP_DEMAND_API_URL}/account/ip`);
    return response;
  }

  async getPlan(params = {}) {
    const response = await axios().get(`${process.env.REACT_APP_DEMAND_API_URL}/chargebee/plans`, {
      params,
    });
    return response;
  }

  async getOpenpayPlans(params = {}) {
    const response = await axios().get(`${process.env.REACT_APP_DEMAND_API_URL}/openpay/plans`, {
      params,
    });
    return response;
  }

  async getOpenpayCheckout(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/openpay/checkout-plan`,
      data
    );
    return response;
  }

  async subscriptionEstimate(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/chargebee/subscription-estimate`,
      data
    );
    return response;
  }

  async subscriptionOpenpayEstimate(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/openpay/subscription-estimate`,
      data
    );
    return response;
  }

  async createPaymentIntent(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/chargebee/payment-intent`,
      data
    );
    return response;
  }

  async createOpenpayPaymentIntent(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/openpay/payment-intent`,
      data
    );
    return response;
  }

  async registerUser(data = {}) {
    const response = await axios().post(
      `${process.env.REACT_APP_DEMAND_API_URL}/account/registerUser`,
      data
    );
    return response;
  }

  async createForCard(data = {}) {
    const response = await axios().post("/", data);
    return response;
  }

  async getUserInfo() {
    const response = await axios(true).get(`${process.env.REACT_APP_DEMAND_API_URL}/account/user`);
    return response;
  }

  async logout() {
    const response = await axios(true).get(
      `${process.env.REACT_APP_DEMAND_API_URL}/account/logout`
    );
    return response;
  }
}

export const authApi = new AuthApi();
