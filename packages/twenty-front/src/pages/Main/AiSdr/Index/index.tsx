import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "src/components/base/Button";

import Icon from "src/components/base/Icon";
import Modal from "src/components/base/Modal";

import TableSkeleton from "src/components/base/TableSkeleton";
import { IWorkflow } from "src/utils/types/social-selling";
import { SocialCreateSchema } from "src/utils/schema/socialCreate";
import { deleteWorkflow, aiSdrSelector, getAiSdrList } from "src/store/AiSdr";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useTimeCounter } from "src/hook/common/useTimeCounter";
import axios from "src/utils/functions/axios";
import { authSelector } from "src/store/Auth/selectors";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Helmet } from "react-helmet-async";
import TelescopeModal from "src/components/base/TelescopeModal";

const AiSdrPage: React.FC = () => {
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

  const { isPending, workflow, totalLength } = useAppSelector(aiSdrSelector);
  const { userInfo } = useAppSelector(authSelector);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow>();

  const { remainingTime } = useTimeCounter(30);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isButtonPending, setIsButtonPending] = useState(false);

  const handleNavigate = (id: number, name: string) => {
    navigate(`${paths.main.aiSdr.index}/${id}`, { state: { name } });
  };

  const getAiSdr = async () => {
    setIsButtonPending(true);
    await dispatch(getAiSdrList());
    setIsButtonPending(false);
  };

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
        getAiSdr();
      } else {
        toast.error("Failed to start workflow, changes will reflect in the next few minutes");
        getAiSdr();
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
        getAiSdr();
      } else {
        toast.error("Failed to pause workflow, changes will reflect in the next few minutes");
        getAiSdr();
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
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${wId}/aisdr/telescope`
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
    // {
    //   header: "CONTROL",
    //   accessor: "StartorStop",
    //   cell: ({ row }) => {
    //     if (row.original.status === "paused") {
    //       return (
    //         <div className='flex items-start gap-6'>
    //           <Button
    //             className='primary'
    //             isPending={isButtonPending}
    //             disabled={isButtonPending}
    //             onClick={() => handleStartClick(row.original.id)}
    //           >
    //             RESUME
    //           </Button>
    //         </div>
    //       );
    //     } else if (row.original.status === "running" || row.original.status === "processing") {
    //       return (
    //         <div className='flex items-start gap-6'>
    //           <Button
    //             className='primary'
    //             isPending={isButtonPending}
    //             disabled={isButtonPending}
    //             onClick={() => handlePauseClick(row.original.id)}
    //           >
    //             PAUSE
    //           </Button>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div className='flex items-start gap-6'>
    //           <Button disabled isPending={isButtonPending}>
    //             RESUME
    //           </Button>
    //         </div>
    //       );
    //     }
    //   },
    // },

    columnHelper.accessor("aiSdrAutomated", {
      header: "AUTOMATION",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original?.aiSdrAutomated ? "AutoPilot" : "CoPilot"}</p>
        </div>
      ),
    }),
    columnHelper.accessor("cat", {
      header: "Category",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original?.cat ? row.original?.cat : ""}</p>
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
    columnHelper.accessor("leads_count", {
      header: "LEADS",
      cell: ({ row }) => (
        <div className='flex items-start gap-6 dark:text-neutral-300'>
          <p>{row.original.leads_count}</p>
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
            See Inbox
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
  useEffect(() => {
    getAiSdr();
  }, []);
  return (
    <>
      <Helmet>
        <title> AiSdr </title>
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
              AI SDR
            </h2>
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

export default AiSdrPage;
