import { v4 as uuidv4 } from "uuid";

function AddAINode(props: any, selectedOptionValue: any, side: any, recievedNodeId = "") {
  // console.log("side: " + side + " posx " + props.position.x);
  let uniqueNodeId = uuidv4();
  if (recievedNodeId !== "") {
    uniqueNodeId = recievedNodeId;
  }
  let posx = props.position.x;
  if (side == "left") {
    posx = posx - 300;
  } else {
    posx = props.position.x + 300;
  }
  // console.log("side: " + side + " posx " + posx);
  const newAiNode = {
    id: uniqueNodeId,
    type: "addAiActionNode",
    dragHandle: ".drag",
    position: { x: posx, y: props.position.y + 110 },
    data: {
      label: side === "left" ? "1-1 Only" : "1-1 AutoPilot",
      side: side,
    },
    isConnectable: false,
  };
  const uniqueEdgeId = uuidv4();
  const newAiEdge = {
    id: `e-${uniqueEdgeId}`,
    source: props.id,
    target: uniqueNodeId,
    style: { strokeWidth: 2 },
    data: {
      label: "Go With",
    },
    type: "addAiActionEdge",
  };
  return { newAiNode, newAiEdge };
}

export default AddAINode;
