import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

import Button from "src/components/base/Button";
import automizy from "src/assets/integration_logo/automizy.png";
import basecrm from "src/assets/integration_logo/basecrm.png";
import closeio from "src/assets/integration_logo/closeio.png";
import hubspot from "src/assets/integration_logo/hubspot.png";
import insightly from "src/assets/integration_logo/insightly.png";
import marketo from "src/assets/integration_logo/marketo.png";
import msdynamicscrm from "src/assets/integration_logo/msdynamicscrm.png";
import nimblecrm from "src/assets/integration_logo/nimblecrm.png";
import pardot from "src/assets/integration_logo/pardot.png";
import pipedrive from "src/assets/integration_logo/pipedrive.png";
import pipelinedeals from "src/assets/integration_logo/pipelinedeals.png";
import salesflare from "src/assets/integration_logo/salesflare.png";
import salesforce from "src/assets/integration_logo/salesforce.png";
import sugarcrm from "src/assets/integration_logo/sugarcrm.png";
import zapier from "src/assets/integration_logo/zapier.png";
import zohocrm from "src/assets/integration_logo/zohocrm.png";
import { paths } from "src/routes/path";
import { useIntegration } from "src/hook/integration";
import axios from "src/utils/functions/axios";
import defaultAxios from "axios";
import { toast } from "react-toastify";
import { InlineWidget } from "react-calendly";

export const Logos: { [key: string]: string } = {
  automizy: automizy,
  basecrm: basecrm,
  closeio: closeio,
  hubspot: hubspot,
  insightly: insightly,
  marketo: marketo,
  msdynamicscrm: msdynamicscrm,
  nimblecrm: nimblecrm,
  pardot: pardot,
  pipedrive: pipedrive,
  pipelinedeals: pipelinedeals,
  salesflare: salesflare,
  salesforce: salesforce,
  sugarcrm: sugarcrm,
  zapier: zapier,
  zohocrm: zohocrm,
};

const Integration: React.FC = () => {
  const navigate = useNavigate();

  const {
    integrations,
    isLoading,
    isCalendlyConnected,
    setIsCalendlyConnected,
    calendlyAccessToken,
    setCalendlyAccessToken,
  } = useIntegration();

  const [schedulingLink, setSchedulingLink] = useState("");
  const [userLink, setUserLink] = useState("");

  const fetchSchedulingLink = async () => {
    try {
      const response = await defaultAxios({
        method: "get",
        url: `https://api.calendly.com/event_types?user=${userLink}`,
        headers: {
          Authorization: `Bearer ${calendlyAccessToken}`,
        },
      });
      if (response.data.collection.length > 0) {
        setSchedulingLink(response.data.collection[0].scheduling_url);
      } else {
        toast.error("No event types found for the Calendly account");
      }
    } catch (error) {
      console.error("Fetch Scheduling Link Error:", error);
      toast.error("Error fetching scheduling link");
    }
  };

  useEffect(() => {
    const fetchCalendlyConnectionStatus = async () => {
      try {
        const response = await axios(true).get(
          `${process.env.REACT_APP_WORKFLOW_API_URL}/integration/calendly/connection-status`,
          {}
        );
        if ((response as any).status === "connected") {
          setIsCalendlyConnected(true);
          setCalendlyAccessToken((response as any).access_token);
          setUserLink((response as any).user_link);
        }
      } catch (error) {
        console.error("Calendly Connection Status Error:", error);
      }
    };

    const fetchOAuthToken = async () => {
      setIsCalendlyConnected(false);
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        // console.log("--------------code is : " + code);
        try {
          const response = await axios(true).post(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/integration/calendly/callback`,
            {
              code,
            }
          );
          console.log("OAuth Success:", response.data);
          toast.success("Calendly OAuth Success!");
          setIsCalendlyConnected(true);
          await fetchCalendlyConnectionStatus();
          // Handle success, maybe update state or show a message
        } catch (error) {
          console.error("OAuth Error:", error);
          toast.error("Calendly OAuth Error!");
          // Handle error, maybe show an error message
        }
      } else {
        fetchCalendlyConnectionStatus();
      }
    };

    fetchOAuthToken();
  }, [location.search]);

  const handleConnectCalendly = () => {
    setIsCalendlyConnected(false);
    window.location.href = `https://auth.calendly.com/oauth/authorize?client_id=${process.env.REACT_APP_CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_CALENDLY_REDIRECT_URI}`;
  };

  const handleOpenCalendly = () => {
    fetchSchedulingLink();
  };

  return isLoading && integrations?.length === 0 ? (
    <>
      <div className='flex flex-col pb-50'>
        <h2 className='pb-20 font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
          Integration
        </h2>
        <div className=''>
          <p className='px-4 py-12 title-1'>Calenders & Meetings</p>
          <div className='flex flex-wrap gap-20'>
            {isCalendlyConnected ? (
              <>
                <Button buttonStyle='green'>Calendly Connected</Button>
              </>
            ) : (
              <Button onClick={handleConnectCalendly}>Connect Calendly</Button>
            )}
          </div>
        </div>
      </div>
      <div className='fixed inset-0 flex items-center justify-center w-screen h-screen'>
        <BarLoader color='#2285E1' width={230} height={5} />
      </div>
    </>
  ) : (
    <div className='flex flex-col pb-50'>
      <h2 className='pb-20 font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
        Integration
      </h2>
      <div className=''>
        <p className='px-4 py-12 title-1'>Calenders & Meetings</p>
        <div className='gap-20'>
          {isCalendlyConnected ? (
            <>
              <Button buttonStyle='green' onClick={handleConnectCalendly}>
                Calendly Connected
              </Button>
              <div>
                <Button onClick={handleOpenCalendly}>Open Calendly</Button>
              </div>
              {schedulingLink && (
                <div>
                  <InlineWidget url={schedulingLink} />
                </div>
              )}
            </>
          ) : (
            <Button onClick={handleConnectCalendly}>Connect Calendly</Button>
          )}
        </div>
        <p className='px-4 py-12 title-1'>CRM System</p>
        <div className='flex flex-wrap gap-20 large:max-w-1500 max-w-1100'>
          {integrations && integrations?.length > 0
            ? integrations
                ?.filter(
                  (item) =>
                    !item.sync_type &&
                    item?.slug !== "pardot" &&
                    item?.slug !== "marketo" &&
                    item?.slug !== "automizy"
                )
                ?.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col border p-30 border-borderColor dark:border-borderColor-dark h-300 w-270 bg-contentColor dark:bg-contentColor-dark'
                  >
                    <div className='flex items-center justify-center h-130'>
                      <img src={Logos[item.slug]} alt='integration' />
                    </div>
                    <div className='flex flex-col justify-between flex-1'>
                      <p className='px-2 text-center title-1 text-14'>{item.name}</p>
                    </div>
                    <Button
                      buttonClassName='px-20'
                      fullWidth
                      buttonStyle={item?.active ? "green" : "primary"}
                      onClick={() =>
                        navigate(`${paths.main.integration.index}/${item.id}`, { state: item })
                      }
                    >
                      {item?.active ? "Edit Integration" : "Connect"}
                    </Button>
                  </div>
                ))
            : null}
        </div>
      </div>
      <div className='pt-10'>
        <p className='px-4 py-12 title-1'> Sync System</p>
        <div className='flex flex-wrap gap-20 large:max-w-1500 max-w-1100'>
          {integrations && integrations?.length > 0
            ? integrations
                ?.filter((item) => item.sync_type)
                ?.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col border p-30 border-borderColor dark:border-borderColor-dark h-300 w-270 bg-contentColor dark:bg-contentColor-dark'
                  >
                    <div className='flex items-center justify-center h-130'>
                      <img src={Logos[item.slug]} alt='integration' />
                    </div>
                    <div className='flex flex-col justify-between flex-1'>
                      <p className='px-2 text-center title-1 text-14'>{item.name}</p>
                    </div>
                    <Button
                      buttonClassName='px-20'
                      fullWidth
                      onClick={() =>
                        navigate(`${paths.main.integration.index}/${item.id}`, { state: item })
                      }
                    >
                      Connect
                    </Button>
                  </div>
                ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default Integration;
