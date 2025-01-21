import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { FaCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

import AuthenticationModal from "./AuthenticationModal";
import Button from "src/components/base/Button";
import FieldMapping from "./FieldMapping";
import HeaderTool from "./Header";
import Icon from "src/components/base/Icon";
import SettingModal from "./SettingModal";
import {
  IIntegration,
  IIntegrationSetting,
  IResSetting,
  IShowIntegration,
} from "src/utils/types/integration";
import { Logos } from "../Index";
import { integrationApi } from "src/api/integration";
import { useIntegration } from "src/hook/integration";

const IntegrationDetail: React.FC = () => {
  const { state } = useLocation();
  const params = useParams();

  const [integration, setIntegration] = useState<IIntegration>(state);
  const { integrations } = useIntegration();

  useEffect(() => {
    if (integrations.length > 0) {
      const integrationId = params?.integrationId as string;
      const current = integrations?.find((item) => String(item.id) == integrationId);
      if (current && !integration) {
        setIntegration(current);
      }
    }
  }, [integrations]);

  const [showInfo, setShowInfo] = useState<IShowIntegration>();
  const [settingInfo, setSettingInfo] = useState<IIntegrationSetting[]>();

  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(true);
  const [isSettingLoading, setIsSettingLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const handleShowIntegration = async () => {
    setIsShowLoading(true);
    try {
      const res = (await integrationApi.showIntegration(
        integration?.slug
      )) as unknown as IShowIntegration;
      setShowInfo(res);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsShowLoading(false);
  };

  const handleGetIntegrationSetting = async () => {
    try {
      const res = (await integrationApi.getIntegrationSettings(
        integration?.slug
      )) as unknown as IResSetting;
      setSettingInfo(res?.settings);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const initialIntegrationSetting = async () => {
    setIsSettingLoading(true);
    handleGetIntegrationSetting();
    setIsSettingLoading(false);
  };

  const handleActivation = async (slug: string, active: boolean) => {
    setIsActiveLoading(true);
    try {
      if (active) {
        await integrationApi.toggleIntegration(slug, active);
        setIntegration((prev) => ({ ...prev, active: false }));
      } else {
        if (showInfo?.status) {
          await integrationApi.toggleIntegration(slug, active);
          setIntegration((prev) => ({ ...prev, active: true }));
        } else {
          toast.warn(`Please, login before you can activate ${integration?.name} integration.`);
        }
      }
    } catch (error) {
      // console.log("error: ", error);
    }
    setIsActiveLoading(false);
  };

  useEffect(() => {
    if (integration) {
      handleShowIntegration();
      initialIntegrationSetting();
    }
  }, [integration]);

  return (
    <>
      <div className='max-w-1000 pb-100'>
        <HeaderTool label={integration?.name} />
        <p className='pt-4 pb-16 mt-20 border-t border-b text-13 border-borderColor dark:border-borderColor-dark mb-30 text-neutral-800 dark:text-neutral-300'>
          {`Keep prospect data synced between your Demand and ${
            integration?.name ?? "CRM"
          } accounts for smoother prospect
        management. You can sync the following data: prospect's profile, sent and received emails,
        notes, tags and company info.`}
        </p>
        {integration?.sync_type ? null : (
          <>
            <div className='border px-60 py-25 text-neutral-700 dark:text-neutral-300 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark rounded-xl'>
              <div className='flex gap-10'>
                <p>jq@usedemand.com</p>
                <p className='px-6 py-2 text-white bg-blue-500 border border-blue-500 rounded-full text-12 dark:bg-hoverColor-dark dark:border-blue-900/50'>
                  {integration?.active ? "Processing" : "Paused"}
                </p>
              </div>
              <div
                className='flex items-center gap-20 pt-20 w-fit'
                role='button'
                onClick={() => handleActivation(integration?.slug, integration?.active)}
              >
                <div className='flex items-center gap-10 transition-all duration-100 hover:text-neutral-800 dark:hover:text-neutral-200'>
                  {integration?.active ? (
                    <FaRegCirclePause className='w-24 h-24' />
                  ) : (
                    <FaCirclePlay className='w-24 h-24 ' />
                  )}
                  <p className='select-none'>{integration?.active ? "Stop" : "Resume"}</p>
                  {isActiveLoading && (
                    <ReactLoading type={"spin"} color='#2285E1' width={20} className='!h-20' />
                  )}
                </div>
              </div>
              <div className='flex gap-16 pt-20'>
                <Button
                  buttonClassName=''
                  onClick={() => {
                    setShowAuthModal(true);
                  }}
                >
                  Authentication
                </Button>
                <Button
                  buttonClassName=''
                  disabled={!showInfo?.status}
                  onClick={() => {
                    setShowSettingModal(true);
                  }}
                >
                  {`${integration?.name} Setting`}
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-10 pt-24 text-neutral-800 dark:text-neutral-300'>
              <p className='text-13'>Synchronization type</p>
              <p className='pt-10 text-12'>
                Choose whether you want to set up a one-way or a two-way data sync. In a one-way
                sync, data will be copied from your main app to your secondary app, but no data will
                be copied back. In a two-way sync, both apps will copy data from each other after
                each change in either database.
              </p>
            </div>
            <div className='grid grid-cols-12 gap-20 py-20'>
              <div className='flex items-center justify-center col-span-5 border rounded-lg h-55 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:dark:border-borderColor-dark'>
                <Icon name='Logo' className='w-35 h-35' />
              </div>
              <div className='flex items-center justify-center col-span-2 my-8 border rounded-lg text-neutral-800 dark:text-neutral-400 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
                <Icon name='Exchange' className='w-30 h-30' />
              </div>
              <div className='flex items-center justify-center col-span-5 border rounded-lg h-50 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
                <img src={Logos[integration?.slug]} className='h-50' alt='integration' />
              </div>
            </div>
            <FieldMapping slug={integration?.slug} name={integration?.name} />
            <div className='flex justify-end'>
              <Button buttonClassName='py-26 flex' className='w-120 justify-end'>
                Launch
              </Button>
            </div>
          </>
        )}
      </div>
      <AuthenticationModal
        handleShowIntegration={handleShowIntegration}
        integration={integration}
        isShowLoading={isShowLoading}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        showInfo={showInfo}
      />
      <SettingModal
        open={showSettingModal}
        onClose={() => setShowSettingModal(false)}
        handleGetIntegrationSetting={handleGetIntegrationSetting}
        integration={integration}
        isSettingLoading={isSettingLoading}
        settingInfo={settingInfo}
      />
    </>
  );
};

export default IntegrationDetail;
