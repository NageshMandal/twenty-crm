import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import Input from "src/components/base/Input";
import Textarea from "src/components/base/Textarea";
import useDebounce from "src/hook/common/useDebounce";
import { copyToClipboard, getCode, validateDomain } from "src/utils/functions";
import { handleUpdateAccount, sendDeveloperEmail, visitorSelector } from "src/store/Vistor";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { authSelector } from "src/store/Auth";

const TrackingSetting: React.FC = () => {
  const { domain, token, isEmailPending } = useAppSelector(visitorSelector);
  const { userInfo } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const [screen, setScreen] = useState(0);
  const [domainInfo, setDomainInfo] = useState<string>(domain ?? "");
  const updatedDomain = useDebounce(domainInfo, 1000);

  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("Acquire Script");
  const [body, setBody] = useState<string>("");
  const [isInited, setIsInted] = useState(false);

  const handleUpdateDomain = async () => {
    try {
      await dispatch(handleUpdateAccount({ origins: [domainInfo] }));
      toast.success("Domain successfully updated!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    if (updatedDomain !== domain) {
      handleUpdateDomain();
    }
  }, [updatedDomain]);

  const getScript = (scriptToken: string) => {
    return `<script async>
  (function(w, d) {
    d.addEventListener("DOMContentLoaded", function () {
      var token = "${scriptToken}";
      var script = d.createElement('script');
      script.async = true;
      script.src = "https://track.saleshub.ai/assets/for-cache.min.js?authorization=${scriptToken}";
      script.onload = function () {
        w.salesToolsObserverCached(token);
      };
      d.body.appendChild(script);
    })
  })(window, document)
</script>`;
  };

  const validDomain = useMemo(() => {
    const message = validateDomain(domainInfo);
    return { message };
  }, [domainInfo]);

  useEffect(() => {
    if (!isInited) {
      setBody(`Dear my super developer, 

Please install this tracking code before the </body> tag for all pages.
      ${getCode(token)}

Thanks,
${userInfo?.full_name}`);
      setIsInted(true);
    }
  }, [isInited, userInfo]);

  return (
    <div className='px-32 pt-32 w-1000'>
      <h2 className='font-normal select-none pb-18 text-20 text-neutral-900 dark:text-neutral-300'>
        Install Tracking Code
      </h2>
      {screen == 0 ? (
        <>
          <div className='pt-12'>
            <Input
              label='Domain'
              value={domainInfo ?? ""}
              onChange={(event) => setDomainInfo(event.target.value)}
              error={validDomain}
            />
          </div>
          <div className='pt-20'>
            <h3 className='font-medium text-center text-18 title-1'>Install Tracking Code</h3>
            <p className='mt-10 font-medium text-16 title-1'>Tracking code installation:</p>
            <p className='my-10 title-1 text-14'>
              {`Copy and paste this tracking code into every page of your site just before the </body> tag.`}
            </p>
            <Textarea value={getScript(token ?? "")} className='h-330' readOnly />
            <div className='flex justify-center gap-10 pt-20'>
              <Button onClick={() => copyToClipboard(getScript(token ?? ""))}>Copy</Button>
              <Button buttonStyle='secondary' onClick={() => setScreen(1)}>
                Email to my web developer
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col gap-16 pt-12'>
            <Input
              label='Insert email of you developer:'
              value={email ?? ""}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label='Subject:'
              value={subject ?? ""}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className='pt-20'>
            <Textarea
              label='Script'
              value={body}
              onChange={(event) => setSubject(event.target.value)}
              className='h-400'
              readOnly
            />
            <div className='flex justify-center gap-10 pt-20'>
              <Button
                disabled={!email.length}
                onClick={() => dispatch(sendDeveloperEmail({ email, subject, body }))}
                isPending={isEmailPending}
              >
                Send
              </Button>
              <Button buttonStyle='secondary' onClick={() => setScreen(0)}>
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackingSetting;
