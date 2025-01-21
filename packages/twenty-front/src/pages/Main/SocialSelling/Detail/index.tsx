import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { Link, useLocation, useParams } from "react-router-dom";

import Button from "src/components/base/Button";
import Container from "src/components/base/Container";
import Icon from "src/components/base/Icon";
import MenuButton from "src/components/base/MenuButton";
import SocialSellingContent from "./Content";
import emptyImage from "src/assets/errors/empty.png";
import {
  getAutomations,
  getCommentedMessage,
  getProspectList,
  getToAutoStats,
  socialSellingSelector,
  updateToAutoStats,
} from "src/store/SocialSelling";
import { IPost } from "src/utils/types/social-selling";
import { SortByList } from "src/utils/constants";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useForm, useWatch } from "react-hook-form";
import ComboBoxSS from "src/components/base/ComboBoxSS";
import Switch from "src/components/base/Switch";
import { getValue } from "@testing-library/user-event/dist/utils";
import ReactLoading from "react-loading";

const SocialSellingPage: React.FC = () => {
  const param = useParams();
  const wid = param?.wid as string;

  const dispatch = useAppDispatch();
  const { state } = useLocation();

  const { socialSellingInfoList, commentedList, automations, toAuto, toAutoId } =
    useAppSelector(socialSellingSelector);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { control, setValue, reset, getValues } = useForm();
  const toAutoSS = useWatch({ control, name: "ssToAutomationSwitch", defaultValue: false });
  const toAutoIdSS = useWatch({ control, name: "automations", defaultValue: undefined });
  const [isAutoSSPending, setIsAutoSSPending] = useState(false);
  const [newToAuto, setNewToAuto] = useState(toAuto);
  const [newToAutoId, setNewToAutoId] = useState(toAutoId);

  const postList = useMemo(() => {
    if (!!socialSellingInfoList.length && !!commentedList.length) {
      const result = socialSellingInfoList.filter(
        (socialItem) =>
          commentedList?.find((commentItem) =>
            socialItem.profile.recent_posts.find((postItem) => postItem.id === commentItem.post_id)
          ) && socialItem.profile.recent_posts.find((item) => !item.is_commented)
      );
      if (selectedSort == 1) {
        result.sort((a, b) => {
          const dateA = new Date(a.profile.recent_posts[0].created_at);
          const dateB = new Date(b.profile.recent_posts[0].created_at);
          return dateB.getTime() - dateA.getTime();
        });
      }
      return result;
    } else return [];
  }, [socialSellingInfoList, commentedList, selectedSort]);

  const allPostList = useMemo(() => {
    if (socialSellingInfoList) {
      const result: IPost[] = [];
      socialSellingInfoList.forEach(({ profile }) => {
        result.push(...profile.recent_posts);
      });
      return result;
    }
  }, [socialSellingInfoList]);

  const getProspectInfo = async () => {
    setIsLoading(true);
    try {
      await dispatch(getProspectList(wid));
      await dispatch(getCommentedMessage(wid));
    } catch (error) {
      console.error("error: ", error);
    }
    setIsLoading(false);
  };

  const handleGetAutomations = async () => {
    dispatch(getAutomations());
  };

  const callOutGetToAuto = async () => {
    await dispatch(getToAutoStats(wid));
  };

  useEffect(() => {
    if (toAuto) {
      setValue("ssToAutomationSwitch", true);
    } else {
      setValue("ssToAutomationSwitch", false);
    }
    // console.log("its to auto ", toAuto);
  }, [toAuto]);

  useEffect(() => {
    if (toAutoId) {
      const selectedAutomation = automations.find((automation) => automation.id === toAutoId);
      if (selectedAutomation) {
        setValue("automations", selectedAutomation);
      }
    }
    // console.log("its to auto ", toAuto);
  }, [toAutoId]);

  const handleSwitchClick = async () => {
    // console.log("Switch clicked!");
    if (!isAutoSSPending) {
      setIsAutoSSPending(true);
      await dispatch(updateToAutoStats({ wid, toAuto: !toAutoSS, toAutoId: toAutoIdSS.id }));
      setValue("ssToAutomationSwitch", !toAutoSS);
      setIsAutoSSPending(false);
    }
  };
  const handleComboBoxSelect = async (selectedItem: any) => {
    if (!isAutoSSPending) {
      setIsAutoSSPending(true);
      // console.log("Selected Item:", selectedItem);
      await dispatch(updateToAutoStats({ wid, toAuto: toAutoSS, toAutoId: selectedItem.id }));
      setIsAutoSSPending(false);
    }
  };

  useEffect(() => {
    getProspectInfo();
    handleGetAutomations();
    callOutGetToAuto();
  }, []);

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <div>
          <Link
            to={paths.main.socialSelling.index}
            className='flex items-center gap-4 pb-4 text-neutral-800 dark:text-neutral-300'
          >
            <Icon name='ArrowLeft' className='w-20 h-20' />
            <p>Social Selling Engage List</p>
          </Link>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            Social Selling Engage
          </h2>
        </div>
      </div>
      <div className='flex items-center justify-between py-20'>
        <div>
          {!isLoading && (
            <>
              <p className='text-14 file:font-normal text-neutral-800 dark:text-neutral-300'>
                {commentedList ? commentedList.length : 0} comments for{" "}
                {allPostList ? allPostList.length : 0} posts found to engage with from
              </p>
              <p className='font-bold text-14 text-neutral-800 dark:text-neutral-300'>
                {state?.name}
              </p>
            </>
          )}
        </div>
        <div className='flex items-center gap-10'>
          {/* <span>Add to Automation: </span> */}
          {isAutoSSPending ? (
            <ReactLoading type='bars' width={24} height={21} color={"#2285E1"} />
          ) : (
            <>
              <span onClick={handleSwitchClick} className='cursor-pointer'>
                <Switch control={control} name='ssToAutomationSwitch' prefixLabel='On Comment + ' />
              </span>
              <ComboBoxSS
                placeholder='Choose Automation'
                control={control}
                name='automations'
                list={automations}
                label=''
                onSelect={handleComboBoxSelect}
              />
            </>
          )}

          <p className='pl-10 font-medium text-14 text-neutral-800 dark:text-neutral-300'>
            Sort by
          </p>
          <MenuButton
            value={selectedSort}
            onChange={setSelectedSort}
            menuList={SortByList}
            button={
              <div className='flex items-center justify-center gap-4 overflow-hidden font-normal border w-140 rounded-xl drop-shadow-sm focus:outline-none py-9 px-18 text-14 focus:text-primary-2 border-borderColor dark:border-borderColor-dark bg-contentColor dark:bg-contentColor-dark text-primary'>
                <p className={"whitespace-nowrap tablet:block hidden min-w-90"}>
                  {SortByList.find((item) => item.value === selectedSort)?.label}
                </p>
                <div className={"w-15 h-15 flex-none"}>
                  <Icon name='ChevronDown' />
                </div>
              </div>
            }
          />
          <Button onClick={() => setSelectedSort(0)} prefix='Reload'>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center w-full py-250'>
          <BarLoader color='#2285E1' width={230} height={5} />
        </div>
      ) : (
        postList?.map((item) => (
          <SocialSellingContent
            key={item.id}
            wid={wid}
            socialSellingInfo={item}
            toAuto={toAutoSS}
            toAutoId={toAutoIdSS}
          />
        ))
      )}
      {postList?.length === 0 && !isLoading && (
        <div className='flex flex-col items-center justify-center flex-1 gap-20 h-600'>
          <img className='w-200 h-200' src={emptyImage} alt='empty social selling' />
          <p className='font-medium text-neutral-800 dark:text-neutral-300'>No prospects</p>
        </div>
      )}
    </Container>
  );
};

export default SocialSellingPage;
