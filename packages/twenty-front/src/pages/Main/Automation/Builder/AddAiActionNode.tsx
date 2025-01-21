import { useState } from "react";
import { RiDragMove2Fill } from "react-icons/ri";
import { Handle, Position } from "reactflow";
import "./AddAiActionNode.scss";
import Tooltip from "src/components/base/Tooltip";
interface NodeData {
  side?: string;
  label: string;
}

const AddAiActionNode = ({ data }: { data: NodeData }) => {
  // const [selectedOption, setSelectedOption] = useState(data.label);

  return (
    <div className='' id='nodeSelectId'>
      <div className='flex items-center justify-center h-40 rounded-bl-xl w-500'>
        <div
          id='drag'
          className={`drag transition-all duration-200 flex items-center justify-center h-full text-white bg-primary rounded-bl-xl p-10`}
        >
          <RiDragMove2Fill className='w-20 h-20 text-white' />
        </div>
        <Handle type='target' position={Position.Top} style={{ background: "#555", opacity: 0 }} />
        <Handle
          type='source'
          position={Position.Bottom}
          style={{ background: "#555", opacity: 0 }}
        />
        <Tooltip
          label={
            data.side === "left"
              ? "You will be able to see Advance AI Messages before sending them"
              : "Your prospects will automatically receive Advance AI Generated Messages"
          }
        >
          <div id='nodeSelectId' style={{ padding: 0, margin: 0, zIndex: 999 }}>
            <div
              id='nodeSelectId'
              className={`animated-button cursor-pointer h-full text-white items-center px-10 flex justify-center bg-primary rounded-tr-lg pr-20`}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <p id='nodeSelectId' className='px-6'>
                {data.label === "1-1 Only" ? "1-1 CoPilot" : data.label}
              </p>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default AddAiActionNode;
