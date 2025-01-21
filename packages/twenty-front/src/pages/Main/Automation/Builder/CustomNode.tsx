import React from "react";
import { Handle, Position } from "reactflow";

interface CustomNodeProps {
  data: {
    label: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div style={{ padding: "10px", backgroundColor: "#0077c2", color: "white" }}>
    {/* <Handle type='target' position={Position.Left} style={{ display: "none" }} /> */}
    <Handle type='target' position={Position.Top} style={{ background: "#555", opacity: 0 }} />
    <div>{data.label}</div>
    {/* <Handle type='source' position={Position.Right} style={{ display: "none" }} /> */}
    <Handle type='source' position={Position.Bottom} style={{ background: "#555", opacity: 0 }} />
  </div>
);

export default CustomNode;
