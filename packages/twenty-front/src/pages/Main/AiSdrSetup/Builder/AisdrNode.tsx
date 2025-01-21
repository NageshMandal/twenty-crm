import { RiDragMove2Fill, RiSettings2Fill } from "react-icons/ri";
import { Handle, Position } from "reactflow";
import "./AisdrActionNode.scss";

const AisdrNode = ({ data }: { data: any }) => {
  console.log("data: ", data);
  const handleSetting = () => {
    console.log("handleSetting: ");
    if (data.label) {
      if (data.label == "Prospector") {
        console.log("handleSetting: prospecteor");
      }
      if (data.label == "Personalizer") {
        console.log("handleSetting: personalizer");
      }
    }
  };
  return (
    <div className='flex items-center justify-center h-40 rounded-bl-xl w-500'>
      <div
        id='drag'
        className={`drag transition-all duration-200 flex items-center justify-center h-full text-white bg-primary rounded-bl-xl p-10`}
      >
        <RiDragMove2Fill className='w-20 h-20 text-white' />
      </div>
      <Handle type='target' position={Position.Top} style={{ background: "#555", opacity: 0 }} />
      <Handle type='source' position={Position.Bottom} style={{ background: "#555", opacity: 0 }} />
      <div
        className={`cursor-pointer h-full flex items-center justify-center bg-primary text-white p-10 ${
          data.isInitialNode ? "animated-button" : ""
        } ${data.showAdvance ? "" : "rounded-tr-xl"}`}
      >
        {data.isOnStep} - {data.label}
        {data.isInitialNode && (
          <>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </>
        )}
      </div>
      {data.showAdvance && !data.isInitialNode && (
        <>
          <div className='flex items-center justify-center h-40'>
            <div
              className={`transition-all duration-200 flex items-center justify-center h-full text-white bg-primary cursor-pointer p-10 ${
                data.isInitialNode ? "rounded-tr-xl" : ""
              }`}
            >
              {/* <Icon id='configure' name='EllipsisVertical' className='w-20 h-20 text-white' /> */}
              <RiSettings2Fill
                id='configure'
                className='w-20 h-20 text-white cursor-pointer'
                onClick={() => {
                  handleSetting();
                }}
              />
            </div>
            {/* {!data.isInitialNode && (data.label == "Linkedin" || data.label == "Email") && (
              <div
                id='delete'
                className={`transition-all duration-200 flex items-center justify-center h-full text-white p-10 cursor-pointer bg-error-1 h-full rounded-tr-xl`}
              >
                <GoTrash id='delete' className='w-20 h-20 text-white' />
              </div>
            )} */}
          </div>
          <div className='bg-primary w-20 h-2 border-2 border-primary'></div>
          <div className='flex flex-col items-end justify-center h-80 p-2 bg-primary dark:bg-primary-dark rounded-xl'>
            <div className='flex items-center justify-center w-full rounded-full cursor-pointer text-white my-1 px-10'>
              Completed: 0
            </div>
            <div className='flex items-center justify-center w-full rounded-full cursor-pointer text-white my-1 px-10'>
              Processing: 0
            </div>
            <div className='flex items-center justify-center w-full rounded-full cursor-pointer text-white my-1 px-10'>
              Queued: 0
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AisdrNode;
