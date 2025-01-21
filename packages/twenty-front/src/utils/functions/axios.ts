import axios from "axios";

const customizedAxios = (isPrivate = false) => {
  if (!isPrivate) {
    const newAxios = axios.create();
    return newAxios;
  }
  const newAxios = axios.create();

  newAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      Object.entries(config.params || {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => !value)
        .forEach(([key]) => {
          delete config.params[key];
        });

      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  newAxios.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Status code:", error.response.status);
        if (error?.response?.status === 401) {
          window.location.replace(window.location.origin + "/auth/login");
          localStorage.clear();
          console.error("error 401");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return newAxios;
};

export default customizedAxios;
