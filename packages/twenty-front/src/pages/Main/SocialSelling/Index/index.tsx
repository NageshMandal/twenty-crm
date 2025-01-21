import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FieldValues, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useAsyncError, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "src/components/base/Button";

import Checkbox from "src/components/base/Checkbox";
import Icon from "src/components/base/Icon";
import Input from "src/components/base/Input";
import Modal from "src/components/base/Modal";

import Switch from "src/components/base/Switch";
import TableEmpty from "src/components/base/TableEmpty";
import TableSkeleton from "src/components/base/TableSkeleton";
import { IFlowChart, IProspect, IWorkflow } from "src/utils/types/social-selling";
import { SocialCreateSchema } from "src/utils/schema/socialCreate";
import {
  deleteWorkflow,
  getAutomations,
  getSSLangs,
  getSSTones,
  getAskAiPrompts,
  getSocialList,
  getToAutoStats,
  socialSellingSelector,
} from "src/store/SocialSelling";
import { paths } from "src/routes/path";
import { socialSellingApi } from "src/api/social-selling";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useTimeCounter } from "src/hook/common/useTimeCounter";
import ReactSelect from "src/components/base/ReactSelect";
import axios from "src/utils/functions/axios";
import { authSelector } from "src/store/Auth/selectors";
import Avatar from "react-avatar";
import { getValue } from "@testing-library/user-event/dist/utils";
import ComboBoxSS from "src/components/base/ComboBoxSS";
import {
  useReactTable,
  createColumnHelper,
  RowModel,
  Table,
  flexRender,
  getCoreRowModel,
  SortingFn,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Helmet } from "react-helmet-async";
import TelescopeModal from "src/components/base/TelescopeModal";

const SocialSellingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(SocialCreateSchema) });

  const { isPending, workflow, totalLength, ssLangs, ssTones, automations } =
    useAppSelector(socialSellingSelector);
  const { userInfo } = useAppSelector(authSelector);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow>();
  // const [ssTones, setSSTones] = useState(undefined);
  // const [ssLangs, setSSLangs] = useState(undefined);

  const { remainingTime } = useTimeCounter(30);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isButtonPending, setIsButtonPending] = useState(false);

  const handleNavigate = (id: number, name: string) => {
    navigate(`${paths.main.socialSelling.index}/${id}`, { state: { name } });
  };

  const getSocialSelling = async () => {
    setIsButtonPending(true);
    await dispatch(getSocialList());
    setIsButtonPending(false);
  };

  const getLangs = async () => {
    // setSSLangs(dispatch(getSSLangs("0")));
    await dispatch(getSSLangs("0"));
    // console.log("ssLangs : " + JSON.stringify(ssLangs));
  };

  const getPrompts = async () => {
    await dispatch(getAskAiPrompts("0"));
  };

  const getTones = async () => {
    // setSSTones(dispatch(getSSTones("0")));
    await dispatch(getSSTones("0"));
    // console.log("ssTones : " + JSON.stringify(ssTones));
  };

  // const getTones = async () => {
  //   // await dispatch(getTonesPrompts("0"));
  //   const response = await axios(true).get(
  //     `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${0}/ss-tones-prompts`
  //   );
  //   if (response) {
  //     setSSTones(response);
  //     toast.success("AI Tones Loaded");
  //   }
  // };

  // const getLangs = async () => {
  //   // await dispatch(getSSLangs("0"));
  //   const response = await axios(true).get(
  //     `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${0}/ss-langs`
  //   );
  //   if (response) {
  //     setSSLangs(response);
  //     // console.log("response : " + JSON.stringify(response));
  //     toast.success("AI Languages Loaded");
  //   }
  // };

  const isChecked = useWatch({ control, name: "aiAutomated" });
  const max = useWatch({ control, name: "max" });
  const toAuto = useWatch({ control, name: "ssToAutomationSwitch", defaultValue: false });
  const toAutoId = useWatch({ control, name: "automations", defaultValue: undefined });
  const navigationUrl: string = useWatch({ control, name: "url" }) ?? "";
  const [selectedLang, setSelectedLang] = useState("English");
  const [selectedTone, setSelectedTone] = useState("Praise");
  const [selectedToneId, setSelectedToneId] = useState("0");
  const [selectedExample, setSelectedExample] = useState("Select a Tone To See Ai Example");
  const [isTelescopeModalOpen, setIsTelescopeModalOpen] = useState(false);
  const [telescopeData, setTelescopeData] = useState<any>([]);
  const [telescopeWorkflowName, setTelescopeWorkflowName] = useState("");

  useEffect(() => {
    const validUrl = "https://www.linkedin.com/sales/lists/";
    if (navigationUrl?.length >= validUrl.length) {
      if (!navigationUrl.startsWith(validUrl)) {
        setError("url", { message: "Invalid Sales Navigator URL" });
      } else {
        setError("url", { message: "" });
      }
    }
  }, [navigationUrl]);

  useEffect(() => {
    if (max) {
      setValue("profileNumber", 50);
    } else {
      setValue("profileNumber", 50);
    }
  }, [max]);

  const onSubmit = async (data: FieldValues) => {
    setIsCreateLoading(true);
    const id1 = `f${(+new Date()).toString(16)}`;
    const id2 = id1 + 2;
    const id3 = id2 + 2;
    const id4 = id3 + 2;

    let flowchart: IFlowChart[] = [
      {
        choosenFunction: "linkedin",
        content: {
          value: "Linkedin Sales Navigator List",
          profileNumber: data.profileNumber ?? 100,
          from_page: 1,
          searchURL: data.url,
        },
        id: id1,
        prevNode: null,
      },
      {
        choosenFunction: "linkedin",
        content: {
          value: "Crawl for posts",
          limit: data.profileNumber ?? 10,
          from_page: 1,
          profiles: data.url,
        },
        id: id2,
        prevNode: id1,
      },
      {
        choosenFunction: "linkedin",
        content: {
          value: "Linkedin Send Comments",
          limit: data.profileNumber ?? 10,
          from_page: 1,
          post_urls: [
            {
              post_url: "",
              comment: "",
            },
          ],
          comment: "",
          language: selectedLang,
          tone: selectedToneId,
          to_auto: toAuto,
          to_auto_id: toAutoId?.id ? toAutoId.id : null,
        },
        id: id4,
        prevNode: isChecked ? id3 : id2,
      },
    ];

    if (isChecked) {
      const automatedAI = {
        choosenFunction: "linkedin",
        content: {
          value: "Automated AI",
        },
        id: id3,
        prevNode: id2,
      };
      flowchart.splice(2, 0, automatedAI);
    } else {
      flowchart = flowchart.filter((node) => node.content.value !== "Automated AI");
    }
    try {
      await socialSellingApi.createSocialSelling({
        name: data.name,
        flowchart: flowchart,
      });
      // console.log("flowchart became like: " + JSON.stringify(flowchart));
      setShowModal(false);
      toast.success("Workflow successfully created!");
      getSocialSelling();
    } catch (error) {
      console.error("error: ", error);
    }
    setIsCreateLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      if (selectedWorkflow) {
        await dispatch(deleteWorkflow(selectedWorkflow.id));
        toast.success("Workflow successfully deleted!");
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("error: ", error);
    }
    setIsDeleteLoading(false);
  };

  const handleStartClick = async (wId) => {
    setIsButtonPending(true);
    try {
      // Assuming 'id' is the ID of the workflow
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wId}/process`
      );
      if ((response as any).message === "Workflow resumed") {
        toast.success(
          "Workflow started successfully, changes will reflect in the next few minutes"
        );
        getSocialSelling();
      } else {
        toast.error("Failed to start workflow, changes will reflect in the next few minutes");
        getSocialSelling();
      }
    } catch (error) {
      console.log(error);
    }
    setIsButtonPending(false);
  };

  const handlePauseClick = async (wId) => {
    setIsButtonPending(true);
    try {
      // Assuming 'id' is the ID of the workflow
      const response = await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wId}/pause`
      );
      if ((response as any).message === "success") {
        toast.success("Workflow paused successfully, changes will reflect in the next few minutes");
        getSocialSelling();
      } else {
        toast.error("Failed to pause workflow, changes will reflect in the next few minutes");
        getSocialSelling();
      }
    } catch (error) {
      console.log(error);
    }
    setIsButtonPending(false);
  };

  const handleRestartClick = async (wId) => {
    setIsButtonPending(true);
    try {
      // Assuming 'id' is the ID of the workflow
      const response = await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wId}/restart`
      );
      if ((response as any).message === "success") {
        toast.success(
          "Workflow restarted successfully, changes will reflect in the next few minutes"
        );
        getSocialSelling();
      } else {
        toast.error("Failed to restart workflow, changes will reflect in the next few minutes");
        getSocialSelling();
      }
    } catch (error) {
      console.log(error);
    }
    setIsButtonPending(false);
  };
  const handleTelescopeClick = async (wId, wName) => {
    setIsButtonPending(true);
    try {
      // setIsTelescopeModalOpen(true);
      // Assuming 'id' is the ID of the workflow
      const response = await axios(true).post(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wId}/telescope`
      );
      if ((response as any).status === 200) {
        setTelescopeData((response as any).data);
        setTelescopeWorkflowName(wName);
        setIsTelescopeModalOpen(true);
        // toast.success(
        //   "Workflow restarted successfully, changes will reflect in the next few minutes"
        // );
      } else {
        toast.error("Failed to check telescope");
      }
    } catch (error) {
      console.log(error);
    }
    setIsButtonPending(false);
  };

  const columnHelper = createColumnHelper<IWorkflow>();

  const columns = [
    columnHelper.accessor("name", {
      header: "NAME",
      cell: ({ row }) => (
        <div
          className={`flex items-start gap-6 dark:text-primary-300 ${
            row.original.status != "running" && row.original.status != "processing"
              ? "text-red-500"
              : ""
          }`}
        >
          <p
            className='cursor-pointer group-hover:text-white hover:text-primary dark:hover:text-primary-400'
            onClick={() => handleNavigate(row.original.id, row.original.name)}
          >
            {row.original.name}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "STATUS",
      cell: ({ row }) => (
        <div
          className={`flex items-start gap-6 dark:text-neutral-300 ${
            row.original.status != "running" && row.original.status != "processing"
              ? "text-red-500 dark:text-red-500"
              : ""
          }`}
        >
          <p>{row.original.status}</p>
        </div>
      ),
    }),
    {
      header: "CONTROL",
      accessor: "StartorStop",
      cell: ({ row }) => {
        if (row.original.status === "paused") {
          return (
            <div className='flex items-start gap-6'>
              <Button
                className='primary'
                isPending={isButtonPending}
                disabled={isButtonPending}
                onClick={() => handleStartClick(row.original.id)}
              >
                RESUME
              </Button>
            </div>
          );
        } else if (row.original.status === "running" || row.original.status === "processing") {
          return (
            <div className='flex items-start gap-6'>
              <Button
                className='primary'
                isPending={isButtonPending}
                disabled={isButtonPending}
                onClick={() => handlePauseClick(row.original.id)}
              >
                PAUSE
              </Button>
            </div>
          );
        } else {
          return (
            <div className='flex items-start gap-6'>
              <Button disabled isPending={isButtonPending}>
                RESUME
              </Button>
            </div>
          );
        }
      },
    },
    {
      header: "RESET",
      accessor: "Restart",
      cell: ({ row }) => (
        <div className='flex items-start gap-6'>
          <Button
            className='primary'
            isPending={isButtonPending}
            disabled={isButtonPending}
            onClick={() => handleRestartClick(row.original.id)}
          >
            RESET AND START
          </Button>
        </div>
      ),
    },
    columnHelper.accessor("automated", {
      header: "AUTOMATION",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original?.automated ? "Automated" : "Manual"}</p>
        </div>
      ),
    }),
    columnHelper.accessor("log", {
      header: "TELESCOPE",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <Button
            className=''
            buttonStyle='secondary'
            isPending={isButtonPending}
            onClick={() => handleTelescopeClick(row.original.id, row.original.name)}
          >
            TELESCOPE
          </Button>{" "}
        </div>
      ),
    }),
    // columnHelper.accessor("log", {
    //   header: "LAST LOGS",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300 overflow-auto max-h-40 w-160 max-w-200'>
    //       <p>{row.original?.log ?? ""}</p>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("leads_count", {
      header: "LEADS",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original.leads_count}</p>
        </div>
      ),
    }),
    columnHelper.accessor("today_posts", {
      header: "TODAY POSTS/COMMENTED",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>
            {row.original.today_posts}/{row.original.today_comments}
          </p>
        </div>
      ),
    }),
    // columnHelper.accessor("today_posts", {
    //   header: "TODAY POSTS",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300'>
    //       <p>{row.original.today_posts}</p>
    //     </div>
    //   ),
    // }),
    // columnHelper.accessor("today_comments", {
    //   header: "TODAY COMMENTED",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300'>
    //       <p>{row.original.today_comments}</p>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("total_posts", {
      header: "TOTAL POSTS/COMMENTED",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>
            {row.original.total_posts}/{row.original.total_comments}
          </p>
        </div>
      ),
    }),
    // columnHelper.accessor("total_posts", {
    //   header: "TOTAL POSTS",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300'>
    //       <p>{row.original.total_posts}</p>
    //     </div>
    //   ),
    // }),
    // columnHelper.accessor("total_comments", {
    //   header: "TOTAL COMMENTED",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300'>
    //       <p>{row.original.total_comments}</p>
    //     </div>
    //   ),
    // }),
    // columnHelper.accessor("total_posts", {
    //   header: "TOTAL POSTS",
    //   cell: ({ row }) => (
    //     <div className='flex items-start gap-6 dark:text-neutral-300'>
    //       <p>{row.original.total_posts}</p>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("remaining_comment_count", {
      header: "REMAINING COMMENTS",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original.remaining_comment_count}</p>
        </div>
      ),
    }),
    columnHelper.accessor("last_ss_run", {
      header: "LAST RUN",
      cell: ({ row }) => {
        const lastRun = row.original.last_ss_run ? new Date(row.original.last_ss_run) : null;
        const formattedDate = lastRun
          ? `${lastRun.getFullYear()}-${(lastRun.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${lastRun.getDate().toString().padStart(2, "0")} ${lastRun
              .getHours()
              .toString()
              .padStart(2, "0")}:${lastRun.getMinutes().toString().padStart(2, "0")}:${lastRun
              .getSeconds()
              .toString()
              .padStart(2, "0")}`
          : "N/A";

        return (
          <div className='flex items-start gap-6 dark:text-neutral-300'>
            <p>{formattedDate}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("created_at", {
      header: "CREATED ON",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original.created_at}</p>
        </div>
      ),
    }),
    {
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className='flex items-center justify-between gap-5 text-primary'>
          <p
            className='cursor-pointer group-hover:text-white'
            onClick={() => handleNavigate(row.original.id, row.original.name)}
          >
            See Posts
          </p>
          <Icon
            onClick={() => {
              setShowDeleteModal(true);
              setSelectedWorkflow(row.original);
            }}
            name='Cross'
            className='w-20 h-20 text-neutral-800 dark:text-neutral-300 group-hover:text-white'
          ></Icon>
        </div>
      ),
    },
  ];

  // Initialize react-table instance
  const reactTable = useReactTable({
    columns,
    data: workflow,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleGetAutomations = async () => {
    dispatch(getAutomations());
  };

  useEffect(() => {
    getSocialSelling();
    getLangs();
    getTones();
    handleGetAutomations();
    getPrompts();
  }, []);

  const onLangChange = async (val: any) => {
    // console.log("val p: " + JSON.stringify(val.value));
    setSelectedLang(val.value);
  };
  const onToneChange = async (val: any) => {
    // console.log("val p: " + JSON.stringify(val.value));
    setSelectedTone(val.label);
    setSelectedToneId(val.value);
    //extract example from ssTones based on id val.value
    const selectedToneForExample = ssTones.find((tone) => tone.id === val.value);
    const selectedToneExample1 = selectedToneForExample ? selectedToneForExample.example : "";

    setSelectedExample(selectedToneExample1);

    // setSelectedExample(val.example);
  };

  return (
    <>
      <Helmet>
        <title> SocialSelling </title>
        <meta name='' content='' />
      </Helmet>
      <TelescopeModal
        show={isTelescopeModalOpen}
        onClose={() => setIsTelescopeModalOpen(false)}
        children={null}
        telescopeData={telescopeData}
        workflowName={telescopeWorkflowName}
      ></TelescopeModal>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-20'>
            <h2 className='font-normal select-none text-neutral-800 dark:text-neutral-300 text-25'>
              Social Selling Engage
            </h2>
            <Button
              buttonStyle='secondary'
              rounded
              onClick={() => {
                setShowModal(true);
                reset();
                setValue("profileNumber", 50);
              }}
            >
              Create a Social Selling List
            </Button>
          </div>
          {!isPending && totalLength && (
            <p className='select-none text-16 text-neutral-800 dark:text-neutral-300'>
              Records 1 to {totalLength} of {totalLength}
            </p>
          )}
        </div>
        <div className='pb-20 pt-35 p-20 overflow-x-auto'>
          <table className='relative z-10 w-full border shadow-md bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300 border-borderColor dark:border-borderColor-dark overflow-x: auto'>
            <thead className='w-full'>
              {reactTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='border-b border-neutral-300 shadow-sm'>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none px-20 font-medium text-left py-14 text-14"
                          : "px-20 font-medium text-left py-14 text-14"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex items-center'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            // asc: " 🔼",
                            asc: <Icon name={"GoSortAsc"} className='ml-2' />,
                            // desc: " 🔽",
                            desc: <Icon name={"GoSortDesc"} className='ml-2' />,
                          }[header.column.getIsSorted() as string] ?? (
                            <Icon name={"GoFilter"} className='ml-2' />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isPending && !workflow.length ? (
                <TableSkeleton rowCount={15} cellCount={15} />
              ) : (
                reactTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-b border-neutral-300 shadow-sm'>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className='px-20 font-normal py-14 text-13'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className='grid grid-cols-2 gap-20'>
          <div className='flex flex-col gap-10'>
            <form className='py-20 w-450' onSubmit={handleSubmit(onSubmit)}>
              <h2 className='font-normal text-center dark:text-neutral-200 text-neutral-800 text-24'>
                Add to a Social Selling
              </h2>
              <div className='flex flex-col gap-20 pt-20'>
                <Input
                  name='name'
                  type='text'
                  label='Name *'
                  register={register("name")}
                  error={errors.name}
                />
                <Input
                  name='url'
                  type='text'
                  label='Sale Navi URL *'
                  register={register("url")}
                  error={errors.url}
                />
                {/* checking commit */}
                <ReactSelect
                  label='AI will Comment in Language'
                  placeholder={selectedLang}
                  options={
                    ssLangs
                      ? Array.from(ssLangs).map((item: any) => ({
                          label: item.lang,
                          value: item.lang,
                        }))
                      : []
                  }
                  // options={[
                  //   { label: "English", value: "English" },
                  //   { label: "German", value: "German" },
                  //   { label: "French", value: "French" },
                  //   { label: "Spanish", value: "Spanish" },
                  //   { label: "Swiss German", value: "Swiss German" },
                  //   { label: "Portuguese", value: "Portuguese" },
                  //   { label: "Danish", value: "Danish" },
                  //   { label: "Dutch", value: "Dutch" },
                  //   { label: "Swedish", value: "Swedish" },
                  //   { label: "Norwegian", value: "Norwegian" },
                  //   { label: "Hebrew", value: "Hebrew" },
                  //   { label: "Italian", value: "Italian" },
                  //   { label: "Arabic", value: "Arabic" },
                  // ]}
                  value={selectedLang}
                  onChange={(val: any) => {
                    // console.log("val c: " + JSON.stringify(val));
                    onLangChange(val);
                  }}
                ></ReactSelect>
                <div className='pt-8'>
                  <ReactSelect
                    label='AI Tone for Commenting'
                    placeholder={selectedTone}
                    //doing same for ai as lang
                    options={
                      ssTones
                        ? Array.from(ssTones).map((item: any) => ({
                            label: item.name,
                            value: item.id,
                          }))
                        : []
                    }
                    // options={[
                    //   { label: "Praise", value: "Praise" },
                    //   { label: "Ask Question", value: "Ask Question" },
                    //   { label: "Challenge the post", value: "Challenge the post" },
                    //   { label: "General Comment", value: "General Comment" },
                    // ]}
                    value={selectedTone}
                    onChange={(val: any) => {
                      // console.log("val c: " + JSON.stringify(val));
                      onToneChange(val);
                    }}
                  ></ReactSelect>
                </div>
                <div>
                  <label
                    className={`block px-5 mb-2 font-normal dark:text-neutral-300 text-neutral-800 text text-15`}
                  >
                    How many Profiles would you like to add to this list? (max: 1000)
                  </label>
                  <div className='flex gap-10'>
                    <Controller
                      name='profileNumber'
                      control={control}
                      defaultValue=''
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='number'
                          divClassName='w-100'
                          error={errors.profileNumber}
                          onChange={(e) => {
                            // Update the field value with React Hook Form's Controller
                            if (Number(e.target.value) > 1000) {
                              // console.log("Profile number: " + e.target.value);
                              field.onChange(1000); // Use the Controller's field.onChange to update to 50
                            } else {
                              field.onChange(e.target.value); // Otherwise, use the value from the event
                            }
                          }}
                        />
                      )}
                    />
                    {/* <Input
                      type='number'
                      divClassName='w-100'
                      register={register("profileNumber")}
                      error={errors.profileNumber}
                      onChange={(e: any) => {
                        if (e.target.value > 50) {
                          console.log("prfilen.o " + e.target.value);
                          setValue("profileNumber", 50);
                        }
                      }}
                    /> */}
                    <Checkbox
                      control={control}
                      name='max'
                      className='flex-none w-18 h-18'
                      label='max'
                    />
                  </div>
                </div>
                <div>
                  <div className='flex flex-col justify-start gap-6 p-8 py-12 border shadow-md bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark rounded-md'>
                    <Switch
                      control={control}
                      name='aiAutomated'
                      suffixLabel='Advance: AI Automated (Optional)'
                    />
                    <p className='text-14 title-1'>
                      When this Option is ON the system will automatically comment on posts on your
                      behalf. when OFF you can review them prior to the manual comment
                    </p>
                  </div>
                </div>
                <div className='p-8 py-12 border shadow-md bg-contentColor dark:bg-contentColor-dark border-borderColor dark:border-borderColor-dark rounded-md'>
                  <label
                    className={`block px-5 mb-2 font-normal dark:text-neutral-300 text-neutral-800 text text-15`}
                  >
                    Advance: Add to Automations on Comment (Optional)
                  </label>
                  <div className='flex items-center gap-10'>
                    <span>
                      <Switch
                        control={control}
                        name='ssToAutomationSwitch'
                        prefixLabel='On Comment + '
                      />
                    </span>
                    <ComboBoxSS
                      placeholder='Choose Automation'
                      control={control}
                      name='automations'
                      list={automations}
                      label=''
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 pt-10 gap-15'>
                  <Button
                    className='w-150'
                    isPending={isCreateLoading}
                    type='submit'
                    buttonClassName='flex justify-end'
                  >
                    Start Social Selling
                  </Button>
                  <Button
                    className='w-150'
                    buttonStyle='secondary'
                    buttonClassName='flex justify-start'
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className='flex flex-col gap-10 items-center justify-center  p-16 mt-20  h-full pb-30'>
            <div className='border rounded-lg border-borderColor bg-bodyBgColor dark:bg-contentColor-dark dark:border-borderColor-dark py-30'>
              <div className='flex items-center gap-10 px-10'>
                <Avatar src={userInfo?.avatar} name={userInfo?.full_name} size='40' round />
                <p className='text-14 title-1'>{userInfo?.full_name}</p>
              </div>
              <div className='pt-10 pl-60 items-center justify-center flex-grow-0 text-neutral-700 dark:text-neutral-400 text-14 w-500 p-30'>
                {selectedExample}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className='py-20 w-380'>
          <h2 className='font-normal text-center dark:text-neutral-200 text-neutral-800 text-24'>
            Do you want to delete this Workflow?
          </h2>
          <div className='flex justify-center gap-15 pt-25 '>
            <Button
              buttonStyle='error'
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
              isPending={isDeleteLoading}
              type='submit'
              buttonClassName='flex justify-end'
            >
              Delete
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
              buttonClassName='flex justify-end'
              buttonStyle='secondary'
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SocialSellingPage;
