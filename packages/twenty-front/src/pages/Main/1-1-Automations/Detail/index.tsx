import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BarLoader, MoonLoader } from "react-spinners";

import Container from "src/components/base/Container";
import emptyImage from "src/assets/errors/empty.png";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { getManualProspects, personalizationSelector } from "src/store/Personalization";
import ManualPostContent from "./Content";
import { getAskAiPrompts } from "src/store/SocialSelling/actions";
import { paths } from "src/routes/path";
import Icon from "src/components/base/Icon";

const OneAutomationPage: React.FC = () => {
  const param = useParams();
  const wid = param?.wid as string;

  const dispatch = useAppDispatch();

  const { state } = useLocation();

  const { prospects, isProspectsPending } = useAppSelector(personalizationSelector);

  const postLength = useMemo(
    () =>
      prospects
        ?.map((item) => item.profile?.recent_posts?.length)
        ?.reduce((total, currentValue) => total + currentValue, 0),
    [prospects]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [page, setPage] = useState(1);

  const handleGetProspects = async () => {
    setIsLoading(true);
    await dispatch(getManualProspects({ wid, page }));
    setIsLoading(false);
  };

  const handleMoreGet = async () => {
    if (!isProspectsPending) {
      const req = {
        wid,
        page: page + 1,
      };
      await dispatch(getManualProspects(req));
      setPage((prev) => prev + 1);
    }
  };

  const handleGetPrompt = async () => {
    try {
      dispatch(getAskAiPrompts(wid));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    const element = document.getElementById("main") as HTMLElement;

    const handleScroll = () => {
      const isBottom = element.scrollTop + element.clientHeight >= element.scrollHeight;
      if (isBottom) {
        setReachedBottom(true);
      } else {
        setReachedBottom(false);
      }
    };
    element.addEventListener("scroll", handleScroll);
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (reachedBottom) {
      handleMoreGet();
    }
  }, [reachedBottom]);

  useEffect(() => {
    handleGetProspects();
    handleGetPrompt();
  }, []);

  return (
    <Container className=''>
      <div className='flex items-center justify-between'>
        <div>
          <Link
            to={paths.main.personalization.index}
            className='flex items-center gap-4 pb-4 text-neutral-800 dark:text-neutral-300'
          >
            <Icon name='ArrowLeft' className='w-20 h-20' />
            <p>1-1 Sales Automations List</p>
          </Link>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            1-1 Sales Automations
          </h2>
        </div>
      </div>
      <div className='flex items-center justify-between py-20'>
        <div>
          {!isLoading && (
            <>
              <p className='text-14 file:font-normal text-neutral-800 dark:text-neutral-300'>
                {postLength} posts of {prospects?.length ? prospects?.length : 0} prospects found in
              </p>
              <p className='font-bold text-14 text-neutral-800 dark:text-neutral-300'>
                {state?.name}
              </p>
            </>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className='flex items-center justify-center flex-1 w-full h-full '>
          <BarLoader color='#2285E1' width={230} height={5} />
        </div>
      ) : (
        prospects?.map((item, index) => (
          <ManualPostContent key={item.prospect_id + index} prospect={item} wid={wid} />
        ))
      )}
      {prospects?.length === 0 && !isLoading && (
        <div className='flex flex-col items-center justify-center flex-1 gap-20 h-600'>
          <img className='w-200 h-200' src={emptyImage} alt='empty social selling' />
          <p className='font-medium text-neutral-800 dark:text-neutral-300'>No prospects</p>
        </div>
      )}
      {isProspectsPending && !isLoading ? (
        <div className='flex justify-center w-full pt-20'>
          <MoonLoader color='#2285E1' size={25} />
        </div>
      ) : null}
    </Container>
  );
};

export default OneAutomationPage;
