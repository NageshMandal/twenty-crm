import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Button from "src/components/base/Button";
import Icon from "src/components/base/Icon";
import Modal from "src/components/base/Modal";
import TableEmpty from "src/components/base/TableEmpty";
import TableSkeleton from "src/components/base/TableSkeleton";
import { IWorkflow } from "src/utils/types/social-selling";
import {
  deleteManualWorkflow,
  getPersonalWorkflow,
  personalizationSelector,
} from "src/store/Personalization";
import { paths } from "src/routes/path";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import { useTimeCounter } from "src/hook/common/useTimeCounter";

const PersonalizationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isWorkflowPending, workflowList, workflowLength, isDeletePending } =
    useAppSelector(personalizationSelector);

  const { remainingTime } = useTimeCounter(30);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow>();

  const handleNavigate = (id: number, name: string) => {
    navigate(`${paths.main.personalization.index}/${id}`, { state: { name } });
  };

  const handleGetWorkflow = async () => {
    await dispatch(getPersonalWorkflow());
  };

  const handleDelete = async () => {
    try {
      if (selectedWorkflow) {
        await dispatch(deleteManualWorkflow(selectedWorkflow.id));
        toast.success("Workflow successfully deleted!");
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const tableColumn = [
    {
      id: "name",
      label: "LIST NAME",
      width: "w-500",
      render: (row: IWorkflow) => (
        <div className='flex items-start gap-6'>
          <p>{row?.name}</p>
          {/* <p className='text-12 text-primary group-hover:text-white'>
            {!row?.social_selling_count
              ? remainingTime > 0
                ? `Crawling time is ${remainingTime} mins`
                : ""
              : ""}
          </p> */}
        </div>
      ),
    },
    {
      id: "manual_prospect_count",
      label: "PROSPECT COUNT",
      width: "w-270",
    },
    {
      id: "created_at",
      label: "CREATED BY",
      width: "w-270",
    },
    {
      id: "updated_at",
      label: "LAST RUN",
      width: "w-270",
    },
    {
      id: "action",
      label: "ACTIONS",
      width: "w-170",
      render: (row: IWorkflow) => (
        <div className='flex items-center justify-between gap-5 text-primary'>
          <p
            className='cursor-pointer group-hover:text-white'
            onClick={() => handleNavigate(row.id, row.name)}
          >
            Start 1-1
          </p>
          <Icon
            onClick={() => {
              setShowDeleteModal(true);
              setSelectedWorkflow(row);
            }}
            name='Cross'
            className='w-20 h-20 text-neutral-800 dark:text-neutral-300 group-hover:text-white'
          ></Icon>
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleGetWorkflow();
  }, []);

  return (
    <>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-20'>
            <h2 className='font-normal select-none text-neutral-800 dark:text-neutral-300 text-25'>
              1-1 Sales Automations
            </h2>
          </div>
          {!isWorkflowPending && workflowLength && (
            <p className='select-none text-16 text-neutral-800 dark:text-neutral-300'>
              Records 1 to {workflowLength} of {workflowLength}
            </p>
          )}
        </div>
        <div className='pb-20 pt-35'>
          <table className='relative z-10 w-full border shadow-md bg-contentColor dark:bg-contentColor-dark text-neutral-800 dark:text-neutral-300 border-borderColor dark:border-borderColor-dark'>
            <thead className='w-full'>
              <tr>
                {tableColumn.map((item) => (
                  <td
                    key={item.id}
                    className={`px-20 font-medium text-left py-14 text-14 ${item.width}`}
                  >
                    {item.label}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {isWorkflowPending && !workflowList.length ? (
                <TableSkeleton rowCount={15} cellCount={5} />
              ) : workflowList?.length ? (
                workflowList?.map((socialItem: any, socialIndex: number) => (
                  <tr
                    key={socialIndex}
                    className='transition-all duration-100 hover:bg-primary-2 dark:hover:bg-primary-5 group'
                  >
                    {tableColumn.map((item) => (
                      <td
                        key={item?.id}
                        className='px-20 font-normal group-hover:text-white py-14 text-13'
                      >
                        {item.render ? item.render(socialItem) : socialItem[item.id]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : null}
            </tbody>
            {!workflowList?.length && !isWorkflowPending && <TableEmpty height='h-700' />}
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
              isPending={isDeletePending}
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

export default PersonalizationPage;
