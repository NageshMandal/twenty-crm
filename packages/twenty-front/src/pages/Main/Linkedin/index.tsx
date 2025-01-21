import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import axios from "src/utils/functions/axios";

const LinkedinPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [noUpdate, setNoUpdate] = useState(true);
  const [username, setUsername] = useState("");

  const { register, handleSubmit, control, reset, watch } = useForm();
  const [isPending, setIsPending] = useState(false);
  const [haveOtp, setHaveOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isWaitingOtp, setIsWaitingOtp] = useState(false);

  const [isTab1Active, setIsTab1Active] = useState(true);
  const [isTab2Active, setIsTab2Active] = useState(false);

  const [openLoginForm, setOpenLoginFrom] = useState(false);
  const [startAskingOtp, setStartAskingOtp] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAskingOtp, setIsAskingOtp] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [listenForOtpCalled, setListenForOtpCalled] = useState(false);
  const [startListeningForSuccessLogin, setStartListeningForSuccessLogin] = useState(false);
  const [startAskingServiceLogs, setStartAskingServiceLogs] = useState(false);
  const [isListeningForServiceLogs, setIsListeningForServiceLogs] = useState(false);
  const [serviceLogs, setServiceLogs] = useState([]);

  const onSubmit = async (formData: FieldValues) => {
    setIsPending(true);
    try {
      const data = { username: formData.username, password: formData.passwordNew };
      await axios(true)
        .post(`${process.env.REACT_APP_DEMAND_API_URL}/user/linkedin/`, data)
        .then((response) => {
          toast.success("Linkedin Updated successfully");
        })
        .catch((error) => {
          toast.error("Error Updating Linkedin Password" + error);
          // console.error("Error Updation of MailBox:", error);
        });
    } catch (error) {}

    setIsPending(false);
  };

  const onSubmitOtp = async (formData: FieldValues) => {
    setIsPending(true);
    try {
      const data = formData.otp;
      await axios(true)
        .post(`${process.env.REACT_APP_WORKFLOW_API_URL}/user/linkedin/authcode`, data)
        .then((response) => {
          // toast.success("Linkedin Updated successfully");
          setOtp("");
        })
        .catch((error) => {
          toast.error("Error Updating Linkedin Otp" + error);
          // console.error("Error Updation of MailBox:", error);
        });
    } catch (error) {}

    setIsPending(false);
  };

  const listenForOtp = async () => {
    setListenForOtpCalled(true);
    let counter = 0;
    while (startAskingOtp) {
      counter++;
      if (counter >= 100) {
        setStartAskingOtp(false);
        break;
      }
      if (isAskingOtp) {
        setStartAskingOtp(false);
        console.log("askingotp listening: a2", JSON.stringify(startAskingOtp));
        break;
      }
      if (isUserLoggedIn) {
        setStartAskingOtp(false);
        break;
      }
      try {
        // Make a request to check for OTP
        const otpResponse = await axios(true)
          .get(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/login/asking-login-otp`)
          .then(async (response) => {
            console.log("askingotp listening: ", JSON.stringify(response.data));
            setIsAskingOtp(response.data);
            if (response.data == true) {
              console.log("askingotp yes");
              return response.data;
            } else {
            }
          });
        if (otpResponse) {
          setStartAskingOtp(false);
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.error("Error checking OTP:", error);
      }
    }
    setListenForOtpCalled(false);
  };

  const listenForServiceLogs = async () => {
    setIsListeningForServiceLogs(true);
    let counter = 0;
    while (counter <= 200 && startAskingServiceLogs) {
      if (isUserLoggedIn) {
        setStartAskingServiceLogs(false);
        break;
      }
      counter++;
      try {
        const logsResponse = await axios(true)
          .get(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/service-logs`)
          .then(async (response) => {
            // console.log("servicelogs listening: ", JSON.stringify(response.data));
            setServiceLogs(response.data);
          });
      } catch (error) {
        console.log(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
    }

    setIsListeningForServiceLogs(false);
  };

  const loginToLinkedin = async (formData: FieldValues) => {
    setIsPending(true);
    setIsAskingOtp(false);
    setStartAskingOtp(true);
    setStartAskingServiceLogs(true);
    toast.info("Please wait while we integrate your Linkedin...");
    // listenForOtp();
    try {
      const data = { username: formData.username, password: formData.passwordNew };
      await axios(true)
        .post(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/login`, data)
        .then((response) => {
          if (response.status == 200) {
            if (response.data == "success") {
              // setIsUserLoggedIn(true);
              toast.success("Linkedin Data Submitted Successfully");
            } else {
              setIsUserLoggedIn(false);
            }
          }
        })
        .catch((error) => {
          toast.error("Error Updating Linkedin Password" + error);
          setIsUserLoggedIn(false);
          // console.error("Error Updation of MailBox:", error);
        });
    } catch (error) {}
    setStartListeningForSuccessLogin(true);
    let loginCounter = 0;
    while (true) {
      loginCounter++;
      if (loginCounter >= 600) {
        setIsPending(false);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
      if (isUserLoggedIn) {
        setIsPending(false);
        break;
      }
    }

    setStartAskingOtp(false);
    setStartAskingServiceLogs(false);
    setIsPending(false);
  };

  const updateLoginOtp = async (formData: FieldValues) => {
    // Check if OTP contains only numbers
    if (!/^\d+$/.test(formData.otp)) {
      toast.error("Only numbers are accepted for OTP");
      return; // Exit the function if input is not numeric
    }
    setIsPending(true);
    setSubmittingOtp(true);
    try {
      const data = { otp: formData.otp };
      await axios(true)
        .post(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/login/update-otp`, data)
        .then((response) => {
          toast.success("Linkedin OTP submitted successfully");
          setOtp("");
        })
        .catch((error) => {
          toast.error("Error Updating Linkedin Otp" + error);
        });
    } catch (error) {}

    // setIsPending(false);
    setOpenLoginFrom(false);
    setStartListeningForSuccessLogin(true);
    setSubmittingOtp(false);
  };

  // const getRequiredCode = async () => {
  //   try {
  //     const response = await axios(true).get(
  //       `${process.env.REACT_APP_WORKFLOW_API_URL}/user/linkedin/authcode`
  //     );
  //     if (response) {
  //       setIsWaitingOtp(response.data.data.required); // Assign username to state
  //     }
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    if (startAskingOtp && !listenForOtpCalled) {
      // The state has been updated, trigger your function
      listenForOtp();
    }
  }, [startAskingOtp]);

  useEffect(() => {
    if (isAskingOtp) {
      setStartAskingOtp(false);
    }
  }, [isAskingOtp]);

  useEffect(() => {
    if (!isListeningForServiceLogs && startAskingServiceLogs) {
      listenForServiceLogs();
    }
  }, [startAskingServiceLogs]);

  const listenForSuccessLogin = async () => {
    let count = 600;
    while (startListeningForSuccessLogin) {
      if (isUserLoggedIn) {
        setStartListeningForSuccessLogin(false);
        setOpenLoginFrom(false);
        console.log("listening for success listening: a2", JSON.stringify(startAskingOtp));
        break;
      }
      if (count < 1) {
        setStartListeningForSuccessLogin(false);
        break;
      } else {
        count = count - 1;
      }
      try {
        // Make a request to check for OTP
        const loginResponse = await axios(true)
          .get(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/login/is-login`)
          .then(async (response) => {
            console.log("askinglogin listening: ", JSON.stringify(response.data));
            setIsUserLoggedIn(response.data);
            if (response.data == true) {
              // console.log("askingotp yes");
              return response.data;
            } else {
              return false;
            }
          });
        if (loginResponse) {
          setStartListeningForSuccessLogin(false);
          setIsPending(false);
          setSubmittingOtp(false);
          setStartAskingOtp(false);
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error("Error checking Login:", error);
      }
    }
    setStartListeningForSuccessLogin(false);
  };

  useEffect(() => {
    if (startListeningForSuccessLogin) {
      listenForSuccessLogin();
    }
  }, [startListeningForSuccessLogin]);

  // useEffect(() => {
  //   getRequiredCode();
  // }, []);

  const passwordNew = watch("passwordNew", "");
  const passwordConfirm = watch("passwordConfirm", "");

  useEffect(() => {
    setNoUpdate(passwordNew !== "");
  }, [passwordNew]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(true).get(
          `${process.env.REACT_APP_DEMAND_API_URL}/user/linkedin`
        );

        if (response.data && response.data.username) {
          setUsername(response.data.username); // Assign username to state
          // console.log("response link" + response.data.username);
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
    };

    const isLogin = async () => {
      setIsPending(true);
      try {
        const response = await axios(true).get(
          `${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/login/is-login`
        );

        if (response.data) {
          setIsUserLoggedIn(response.data); // Assign username to state
        }
        if (isUserLoggedIn) {
          setOpenLoginFrom(false);
          setIsPending(false);
          setStartAskingOtp(false);
          setIsAskingOtp(false);
        }
        console.log("islogin " + response.data);
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
      setIsPending(false);
    };

    const listenForServiceLogsOnce = async () => {
      try {
        const logsResponse = await axios(true)
          .get(`${process.env.REACT_APP_WORKFLOW_API_URL}/linkedin/service-logs`)
          .then(async (response) => {
            console.log("servicelogs listening: ", JSON.stringify(response.data));
            setServiceLogs(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    isLogin();

    fetchData();

    listenForServiceLogsOnce();

    setStartAskingOtp(false);
  }, []);

  return (
    <div className='flex items-center justify-between pl-0 ml-0'>
      <div className='flex items-center justify-center gap-20 w-full'>
        <div className='font-normal text-title text-25 w-full'>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300 text-center'>
            Linkedin Automatic Integration
          </h2>
          <div className='py-4 pb-20 pt-10 w-full'>
            <div className='flex items-center justify-center gap-50 w-full text-center pt-10'>
              {/* <button
                className={`font-normal select-none text-25 text-neutral-800 dark:text-neutral-300 tab-button ${
                  isTab1Active ? "active border-b-2 border-neutral-800 dark:border-neutral-300" : ""
                }`}
                onClick={() => {
                  setIsTab1Active(true);
                  setIsTab2Active(false);
                }}
              >
                Linkedin Automatic Integration
              </button> */}
              {/* <button
                className={`font-normal select-none text-25 text-neutral-800 dark:text-neutral-300 tab-button ${
                  isTab2Active ? "active border-b-2 border-neutral-800 dark:border-neutral-300" : ""
                }`}
                onClick={() => {
                  setIsTab1Active(false);
                  setIsTab2Active(true);
                }}
              >
                Linkedin Manual Integration
              </button> */}
            </div>
            {isTab1Active && (
              <div className='h-full'>
                {openLoginForm ? (
                  <div>
                    {isAskingOtp ? (
                      <div>
                        <form onSubmit={handleSubmit(updateLoginOtp)}>
                          <div className='pt-20'>
                            <label className='dark:text-white pt-8'>
                              Enter Linkedin verification code here:
                            </label>
                            <Input
                              type='number'
                              pattern='\d*'
                              name='otp'
                              register={register("otp")}
                              defaultValue={otp}
                              disabled={submittingOtp}
                              onChange={(e) => {
                                setOtp(e.target.value);
                              }}
                              required
                              className='dark:bg-gray-999 dark:text-white'
                            />
                          </div>
                          <div className='flex justify-between pt-20'>
                            <Button
                              isPending={submittingOtp}
                              disabled={submittingOtp}
                              buttonStyle='primary'
                              type='submit'
                              className='dark:bg-gray-999 dark:text-white'
                            >
                              Submit OTP Code
                            </Button>
                          </div>
                        </form>
                        <div className='dark:text-white pt-8'>Service Logs:</div>
                        <div className='font-normal text-8'>
                          {serviceLogs &&
                            serviceLogs.map((log) => (
                              <div className='pb-8 dark:text-white' key={log.id}>
                                <p>Status: {log.logs}</p>
                                <p>Updated At: {log.updated_at}</p>
                                {/* Add more fields as needed */}
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <form onSubmit={handleSubmit(loginToLinkedin)}>
                          <div className='pt-8'>
                            <label className='dark:text-white pt-8'>Email address *</label>
                            <Input
                              type='text'
                              name='username'
                              register={register("username")}
                              defaultValue={username}
                              required
                              className='dark:bg-gray-999 dark:text-white'
                            />
                          </div>
                          <div className='pt-8'>
                            <label className='dark:text-white pt-8'>Password *</label>
                            <Input
                              type='password'
                              name='passwordNew'
                              register={register("passwordNew")}
                              defaultValue={""}
                              required
                              className='dark:bg-gray-999 dark:text-white'
                            />
                          </div>
                          <div className='flex justify-center pt-20'>
                            <Button
                              isPending={isPending || submittingOtp}
                              disabled={!noUpdate}
                              buttonStyle='primary'
                              type='submit'
                              className='dark:bg-gray-999 dark:text-white w-120'
                            >
                              Login
                            </Button>
                          </div>
                        </form>
                        <div className='dark:text-white pt-8'>Service Logs:</div>
                        <div className='font-normal text-8'>
                          {serviceLogs &&
                            serviceLogs.map((log) => (
                              <div className='pb-8 dark:text-white' key={log.id}>
                                <p>Status: {log.logs}</p>
                                <p>Updated At: {log.updated_at}</p>
                                {/* Add more fields as needed */}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {isPending ? (
                      <div className='pt-100 flex items-center justify-center'>
                        <ReactLoading color='#2285E1' type='bars' width={50} height={40} />
                      </div>
                    ) : (
                      <div>
                        <div className='pt-100 flex items-center justify-center'>
                          <div
                            className={`border-2 ${
                              !isUserLoggedIn ? "border-rose-400" : "border-green-400"
                            } rounded-full p-40 hover:bg-green-400 cursor-pointer`}
                            onClick={() => {
                              setOpenLoginFrom(true);
                            }}
                          >
                            <Icon name='LinkedIn' className='w-100 h-100 ' />
                          </div>
                        </div>
                        <div className='pt-10 flex items-center justify-center text-neutral-800 dark:text-neutral-300'>
                          {isUserLoggedIn
                            ? "Integrated Successfully"
                            : "Start Linkedin Integration"}
                        </div>
                        <div className='pt-40'>
                          {!isUserLoggedIn && (
                            <div className='dark:text-white pt-8'>Service Logs:</div>
                          )}
                          <div className='font-normal text-8'>
                            {!isUserLoggedIn &&
                              serviceLogs &&
                              serviceLogs.map((log) => (
                                <div className='pb-8 dark:text-white' key={log.id}>
                                  <p>Status: {log.logs}</p>
                                  <p>Updated At: {log.updated_at}</p>
                                  {/* Add more fields as needed */}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* {isTab2Active && (
              <div className='pt-10'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='pt-8'>
                    <label className='dark:text-white pt-8'>Email address *</label>
                    <Input
                      type='text'
                      name='username'
                      register={register("username")}
                      defaultValue={username}
                      required
                      className='dark:bg-gray-999 dark:text-white'
                    />
                  </div>
                  <div className='pt-8'>
                    <label className='dark:text-white pt-8'>Current Linkedin Password *</label>
                    <Input
                      type='password'
                      name='passwordSmtp'
                      register={register("passwordCurrent")}
                      defaultValue={""}
                      required
                      className='dark:bg-gray-999 dark:text-white'
                    />
                  </div>
                  <div className='pt-8'>
                    <label className='dark:text-white pt-8'>New Password *</label>
                    <Input
                      type='password'
                      name='passwordNew'
                      register={register("passwordNew")}
                      defaultValue={""}
                      required
                      className='dark:bg-gray-999 dark:text-white'
                    />
                  </div>
                  <div className='pt-8'>
                    <label className='dark:text-white pt-8'>Confirm Password *</label>
                    <Input
                      type='password'
                      name='passwordConfirm'
                      register={register("passwordConfirm")}
                      defaultValue={""}
                      required
                      className='dark:bg-gray-999 dark:text-white'
                    />
                  </div>
                  <div className='flex justify-between pt-20'>
                    <Button
                      isPending={isPending}
                      disabled={!noUpdate}
                      buttonStyle='primary'
                      type='submit'
                      className='dark:bg-gray-999 dark:text-white'
                    >
                      Update
                    </Button>
                  </div>
                  {isPending && (
                    <div className='pt-20 dark:text-white'>
                      HangOn we are integrating The Linkedin
                    </div>
                  )}
                </form>
                <form onSubmit={handleSubmit(onSubmitOtp)}>
                  <div className='pt-20'>
                    <label className='dark:text-white pt-8'>
                      Enter the verification code here:
                    </label>
                    <Input
                      type='text'
                      name='otp'
                      register={register("otp")}
                      defaultValue={otp}
                      disabled={!isWaitingOtp}
                      onChange={(e) => {
                        setHaveOtp(e.target.value !== "");
                        setOtp(e.target.value);
                      }}
                      required
                      className='dark:bg-gray-999 dark:text-white'
                    />
                  </div>
                  <div className='flex justify-between pt-20'>
                    <Button
                      isPending={isPending}
                      disabled={!isWaitingOtp || isPending}
                      buttonStyle='primary'
                      type='submit'
                      className='dark:bg-gray-999 dark:text-white'
                    >
                      Send Code
                    </Button>
                  </div>
                </form>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedinPage;
