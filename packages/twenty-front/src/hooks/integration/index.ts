import { useEffect, useState } from "react";

import { integrationApi } from "../../api/integration";
import { IIntegration, TResIntegration } from "../../utils/types/integration";

export const useIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState<IIntegration[]>([]);
  const [isCalendlyConnected, setIsCalendlyConnected] = useState(false);
  const [calendlyAccessToken, setCalendlyAccessToken] = useState("");

  const getIntegration = async () => {
    setIsLoading(true);
    try {
      const res = (await integrationApi.getIntegration()) as unknown as TResIntegration;
      setIntegrations(res?.integrations);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getIntegration();
  }, []);

  return {
    integrations,
    isLoading,
    isCalendlyConnected,
    setIsCalendlyConnected,
    calendlyAccessToken,
    setCalendlyAccessToken,
  };
};
