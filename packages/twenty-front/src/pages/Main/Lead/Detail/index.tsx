import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { BarLoader } from "react-spinners";

import Activity from "./Activity";
import Icon from "src/components/base/Icon";
import ProfileAction from "./ProfileAction";
import Sequence from "./Suquences";
import { getAutomations, getProspectDetail, leadSelector, resetDetail } from "src/store/Leads";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";

const LeadDetailPage: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const { state } = useLocation();

  const { prospect, automations } = useAppSelector(leadSelector);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetDetail = async () => {
    setIsLoading(true);
    try {
      await dispatch(getProspectDetail(params.leadId as string));
      if (automations.length === 0) {
        await dispatch(getAutomations());
      }
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const resetData = () => {
    dispatch(resetDetail());
  };

  useEffect(() => {
    if (params) {
      handleGetDetail();
    }
    return () => resetData();
  }, []);

  return isLoading ? (
    <div className='flex items-center justify-center w-full min-h-[calc(100vh-220px)] pt-20'>
      <BarLoader color='#2285E1' width={230} height={5} />
    </div>
  ) : (
    <section className='pb-50'>
      <Link
        to={paths.main.lead.index}
        className='flex items-center gap-4 pb-4 text-neutral-800 dark:text-neutral-300'
      >
        <Icon name='ArrowLeft' className='w-20 h-20' />
        <p>My Leads</p>
      </Link>
      <div className='grid grid-cols-12 pt-10 text-neutral-800 dark:text-neutral-300 gap-25'>
        <div className='col-span-4 p-20 border rounded-md bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark'>
          <div className='flex items-center gap-15 pb-47'>
            <Avatar
              src={state?.avatar ?? prospect?.image_url}
              name={prospect?.name.replace(/^(\w)\w*\s(\w)\w*.*$/, "$1 $2")}
              className='flex-none overflow-hidden rounded-md'
            />
            <div className='flex flex-col gap-4'>
              <p className='flex float-right justify-end'>
                <Link to={prospect?.social_profiles[0]?.url}>
                  <Icon name='LinkedIn' className='w-18 h-18' />
                </Link>
              </p>
              <p className='text-neutral-800 dark:text-neutral-200 text-16'>{prospect?.name}</p>
              <p className='text-neutral-600 dark:text-neutral-300 text-16'>
                {prospect?.company?.name}
              </p>
              <p className='text-primary text-16'>{prospect?.company?.position}</p>
            </div>
          </div>
          <ProfileAction />
          <div className='border-b pt-17 pb-25 border-borderColor dark:border-borderColor-dark'>
            <div className='flex items-center pb-12'>
              <Icon name='Phone' className='w-15 h-15 text-neutral-600 dark:text-neutral-400' />
              <p className='pl-10 text-14 text-neutral-600 dark:text-neutral-300'>
                Mobile Phone:{" "}
                <span className='text-primary'>
                  {prospect?.phones?.map((item) => item.phone)?.join(",")}
                </span>
              </p>
            </div>
            <div className='flex items-center gap-8 pb-12'>
              <Icon name='MailBox' className='w-15 h-15 text-neutral-600 dark:text-neutral-400' />
              <p className='text-14 text-neutral-600 dark:text-neutral-300'>
                Email:{" "}
                <span className='text-primary'>
                  {prospect?.emails?.map((item) => item.email)?.join(",")}
                </span>
              </p>
            </div>
            <div className='flex items-center gap-8'>
              <Icon name='Location' className='w-15 h-15 text-neutral-600 dark:text-neutral-400' />
              <p className='text-14 text-neutral-600 dark:text-neutral-300'>
                Location:{" "}
                <span className='text-primary'> {prospect?.locations[0]?.address_string}</span>
              </p>
            </div>
          </div>
          <div className='pt-23 pb-30'>
            <p className='text-neutral-800 dark:text-neutral-200'>COMPANY</p>
            <div className='grid grid-cols-12 gap-32 pt-16'>
              <div className='flex flex-col col-span-5 gap-15'>
                <div className='flex items-start gap-8'>
                  <Icon
                    name='Location'
                    className='flex-none mt-5 w-15 h-15 text-neutral-600 dark:text-neutral-400'
                  />
                </div>
                <div className='flex items-center gap-8'>
                  <Icon
                    name='Earth'
                    className='flex-none w-15 h-15 text-neutral-600 dark:text-neutral-400'
                  />
                  <p className='text-14 text-primary'>
                    <span className='text-info'>www.</span>
                    {prospect?.company?.domain}
                  </p>
                </div>
                <div className='flex items-center gap-8'>
                  <Icon name='Phone' className='w-15 h-15 text-neutral-600 dark:text-neutral-400' />
                  <p className='text-14 text-neutral-600 dark:text-neutral-300'>
                    Phone: <span className='text-primary'></span>
                  </p>
                </div>
              </div>
              <div className='flex flex-col col-span-7 gap-5'>
                <p className='text-gray-800 dark:text-gray-300 text-14'>
                  Industry:{" "}
                  <span className='text-gray-600 dark:text-neutral-400'>{prospect?.industry}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 col-span-8 gap-25'>
          <div>
            <p className='pb-10 text-16 text-neutral-800 dark:text-neutral-300'>Experience</p>
            <div className='flex flex-col p-20 border rounded-md gap-15 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark min-h-500 text-14'>
              {[...new Array(6).keys()].map((item) => (
                <div key={item} className='flex flex-col gap-1'>
                  <p className='text-neutral-600 dark:text-neutral-300'>Amobee</p>
                  <p className='text-neutral-800 dark:text-neutral-400'>
                    Regional Vice President Of Sales, Central
                  </p>
                  <p className='text-primary text-12'>(Apr 2020 to Current)</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className='pb-10 text-16 text-neutral-800 dark:text-neutral-300'>Education</p>
            <div className='flex flex-col p-20 border rounded-md gap-15 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark min-h-500 text-14'>
              <div className='flex flex-col gap-1'>
                <p className='text-neutral-600 dark:text-neutral-300'>University Of Iowa</p>
                <p className='text-neutral-800 dark:text-neutral-400'>
                  Bachelors, Bachelor Of Arts
                </p>
                <p className='text-primary text-12'>(2004 - 2008)</p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-neutral-600 dark:text-neutral-300'>
                  Dowling Catholic High School
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-neutral-600 dark:text-neutral-300'>University Of Iowa</p>
              </div>
            </div>
          </div>
          <div>
            <p className='pb-10 text-16 text-neutral-800 dark:text-neutral-300'>Skills</p>
            <div className='flex flex-col p-20 border rounded-md gap-15 bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark min-h-500 text-14'>
              {[
                "Online Advertising",
                "Advertising",
                "Digital Media",
                "Advertising Sales",
                "Marketing",
                "Interactive Advertising",
              ].map((item) => (
                <p key={item} className='text-neutral-600 dark:text-neutral-300'>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Sequence overview={prospect?.overview} />
      <Activity activities={prospect?.activities} prospectId={prospect?.id ?? ""} />
    </section>
  );
};

export default LeadDetailPage;
