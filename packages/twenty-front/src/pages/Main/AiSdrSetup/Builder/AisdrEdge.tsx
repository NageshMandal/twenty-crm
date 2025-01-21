import React, { FC } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from "reactflow";

const AisdrEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "",
            padding: 8,
            borderRadius: 10,
            fontSize: 12,
            opacity: 0.9,
          }}
          className='nodrag nopan bg-primary'
        >
          <p className='text-white'>{data.label}</p>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default AisdrEdge;
