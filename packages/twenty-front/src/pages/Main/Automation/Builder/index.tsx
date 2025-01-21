import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  addEdge,
  getConnectedEdges,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";

import AddActionNode from "./AddActionNode";
import addNewNode from "./AddNewNode"; // Import the addNewNode function
import Button from "src/components/base/Button";
import SplashScreen from "src/components/modules/SplashScreen";
import addDelayNode from "./AddDelayNode";
import axios from "src/utils/functions/axios";
import workflowTemplate, { FlowchartNode } from "./WorkflowTemplate";
import { automationMenu } from "./AutomationMenu";
import { automationSelector, setBuilderScreenMode } from "src/store/Automation";
import { preBuiltTemplateList } from "./PreBuiltTemplates";
import { useAppDispatch, useAppSelector } from "src/hook/redux/useStore";
import addAINode from "./AddAiNode";
import AddAiActionNode from "./AddAiActionNode";
import AddAiActionEdge from "./AddAiActionEdge";
import { workflowAutomationsArray } from "./TemplateFormOptions";
import Checkbox from "src/components/base/Checkbox";
import { Controller, useForm } from "react-hook-form";
// import Switch from "src/components/base/Switch";
import { Switch } from "@headlessui/react";
import { handleAisdrSetup } from "./handleAisdrSetup";

interface FormData {
  [key: string]: string | { value: string; label: string };
}

const centerX = window.innerWidth / 2;

const initialNodeUId = uuidv4();

const initialNodes = [
  {
    id: initialNodeUId,
    position: { x: centerX - 300, y: 30 },
    dragHandle: ".drag",
    data: {
      isFormField: false,
      isRootUrlCorrect: true,
      isDelay: false,
      label: "Add Action",
      choosenFunction: "linkedin",
      isInitialNode: true,
      isDropDownDisabled: false,
      menuData: automationMenu.options.map((option) => ({
        name: option.name,
        icon: option.icon,
      })),
      formData: {},
      isOnStep: 1,
    },
    type: "addActionNode",
    isConnectable: false,
  },
];
const initialEdges: Edge[] = [];
const proOptions = { hideAttribution: true };
const nodeTypes = { addActionNode: AddActionNode, addAiActionNode: AddAiActionNode };
const edgeTypes = { addAiActionEdge: AddAiActionEdge };

let newWorkflowTemplate = { ...workflowTemplate };

newWorkflowTemplate.name = new Date().toLocaleString("en-US", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true, // Include AM/PM format
});

type Props = {
  templateName?: string;
  workflowId?: number;
  summerWorkflowId?: any;
  onBackTab: Function;
  onNextTab: Function;
  rWorkflowTemplate?: any;
  leadTemplateName?: any;
  startMethod?: any;
  aisdrData?: any;
};

const Builder: React.FC<Props> = ({
  templateName,
  workflowId,
  onNextTab,
  onBackTab,
  rWorkflowTemplate,
  leadTemplateName,
  summerWorkflowId,
  startMethod,
  aisdrData,
}) => {
  // console.log("workflowId" + workflowId);
  const dispatch = useAppDispatch();
  const { isFullScreen } = useAppSelector(automationSelector);
  // const [isShowStats, setIsShowStats] = useState(false);
  // const copyOfInitNode = [...initialNodes];
  const copyOfInitNode = JSON.parse(JSON.stringify(initialNodes));
  const copyOfInitEdge = [...initialEdges];
  const [nodes, setNodes, onNodesChange] = useNodesState(copyOfInitNode);
  const [oldNodes, setOldNodes, onOldNodesChange] = useNodesState(copyOfInitNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState(copyOfInitEdge);

  const [isOldNodeLoading, setIsOldNodeLoading] = useState(true);
  const [isSaveWorkflowPending, setIsSaveWorkflowPending] = useState(false);
  const [isNextPending, setIsNextPending] = useState(false);
  const { control, handleSubmit } = useForm();

  console.log("setTemplateName", templateName);

  const emailTemplates = async () => {
    setIsOldNodeLoading(true);
    try {
      const response = await axios(true).get(
        `${process.env.REACT_APP_PLAYBOOK_API_URL}/templates`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // toast.success("Email Template Loaded Successfully");
      if (response) {
        // console.log("response : " + JSON.stringify(response));
      }
    } catch (error) {
      console.error("Email Template Loading:", error);
      // toast.error("Email Template Not Loaded");
    }
    setIsOldNodeLoading(false);
  };

  let recommendedTemplate = useMemo(() => {
    if (templateName) {
      const template = preBuiltTemplateList?.find((item) => item.name === templateName);
      return template;
    } else if (leadTemplateName) {
      const template = preBuiltTemplateList?.find((item) => item.name === leadTemplateName);
      return template;
    }
  }, [templateName, leadTemplateName]);
  // console.log("recommendedTemplate: ", recommendedTemplate);
  // console.log("leadTemplateName: ", recommendedTemplate);

  console.log("lead template name", leadTemplateName);

  let rWorkflowTemplateToLoad = useMemo(() => {
    if (rWorkflowTemplate) {
      return rWorkflowTemplate;
    }
  }, [rWorkflowTemplate]);
  // console.log("receivedWorkflowTemplate: ", rWorkflowTemplateToLoad);

  // const missingFormNodes = useMemo(() => {
  //   const result = [...nodes]
  //     ?.slice(0, -1)
  //     ?.filter((item) => {
  //       console.log("missing checking: " + JSON.stringify(item.data.label));
  //       const isFormField = item.data.isFormField;
  //       const isRootUrlCorrect = item.data.isRootUrlCorrect;
  //       const isFormData = !!Object.keys(item.data.formData).length;
  //       function hasMissingValues(obj: any) {
  //         if (typeof obj !== "object") {
  //           return obj === undefined || obj === "";
  //         }

  //         for (const key in obj) {
  //           if (obj.hasOwnProperty(key)) {
  //             const value = obj[key];
  //             if (hasMissingValues(value)) {
  //               console.log("nodes missing bfc: " + JSON.stringify(obj));
  //               return true;
  //             }
  //           }
  //         }
  //         // console.log("nodes missing c: " + JSON.stringify(obj));
  //         return false;
  //       }

  //       const isEmpty = !!Object.values(item.data.formData).filter((val) => {
  //         return hasMissingValues(val);
  //       }).length;
  //       // console.log("nodes missing c: " + JSON.stringify(isEmpty));
  //       console.log("isFormField: " + JSON.stringify(isFormField));
  //       console.log("isEmpty: " + JSON.stringify(isEmpty));
  //       console.log("isFormData: " + JSON.stringify(isFormData));
  //       console.log("isRootUrlCorrect: " + JSON.stringify(isRootUrlCorrect));
  //       if (isFormField && (isEmpty || !isFormData || !isRootUrlCorrect)) {
  //         console.log("missing checkied : " + JSON.stringify(item.data.label));
  //         return true;
  //       }
  //     })
  //     ?.map((item) => item.data.label);
  //   // console.log("missing: " + JSON.stringify(result));
  //   return result;
  // }, [nodes]);
  const missingFormNodes = () => {
    const result = [...nodes]
      ?.slice(0, -1)
      ?.filter((item) => {
        // console.log("missing checking: " + JSON.stringify(item.data));
        const isFormField = item.data.isFormField;
        const isRootUrlCorrect = item.data.isRootUrlCorrect;
        // const isFormData = !!Object.keys(item.data.formData).length;
        const isFormData = item.data.formData && Object.keys(item.data.formData).length > 0;
        function hasMissingValues(obj: any) {
          // console.log("nodes missing c: " + (obj == undefined || obj == ""));
          if (typeof obj !== "object") {
            return obj === undefined || obj === "";
          }

          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              if (value === undefined) return true;
              if (hasMissingValues(value)) {
                // console.log("nodes missing bfc: " + JSON.stringify(obj));
                return true;
              }
            }
          }
          // console.log("nodes missing c: " + JSON.stringify(obj));
          return false;
        }
        const isEmpty = isFormData
          ? Object.keys(item.data.formData).length === 0 || // Check if the object is empty
            !!Object.values(item.data.formData).some((val) => {
              console.log("nodes missing -c: " + JSON.stringify(val));
              //going to add optional form values here
              if (
                val === item.data.formData.imageUrl ||
                item.data.formData.defineIcpAndPersona ||
                item.data.formData.typesAndSignals
              ) {
                return false; // Skip the check for imageUrl
              }
              const hasMissingVal = hasMissingValues(val);
              console.log("nodes missing -chasMissingVal: " + JSON.stringify(hasMissingVal));
              return hasMissingVal;
            })
          : true;

        // const isEmpty = isFormData
        //   ? !!Object.values(item.data.formData).some((val) => {
        //       if (val === item.data.formData.imageUrl) {
        //         return false; // Skip the check for imageUrl
        //       }
        //       return hasMissingValues(val);
        //     })
        //   : true;
        // const isEmpty = !!Object.values(item.data.formData).some((val) => {
        //   // console.log("nodes isempty bfc: " + JSON.stringify(val));
        //   if (val === item.data.formData.imageUrl) {
        //     return false; // Skip the check for imageUrl
        //   }
        //   return hasMissingValues(val);
        // });
        // // console.log("nodes missing c: " + JSON.stringify(isEmpty));
        // console.log("isFormField: " + JSON.stringify(isFormField));
        // console.log("isEmpty: " + JSON.stringify(isEmpty));
        // console.log("isFormData: " + JSON.stringify(isFormData));
        // console.log("formData value: ", item.data.formData);
        // console.log("formData type: ", typeof item.data.formData);
        // console.log("isRootUrlCorrect: " + JSON.stringify(isRootUrlCorrect));
        if (isFormField && (isEmpty || !isFormData || !isRootUrlCorrect)) {
          return true;
        }
      })
      ?.map((item) => item.data.label);
    // console.log("missing: " + JSON.stringify(result));
    return result;
  };

  const onConnect = useCallback((params: any) => setEdges(addEdge(params, edges)), [edges]);

  const arrangeNodes = async () => {
    if (nodes.length > 0) {
      newWorkflowTemplate.flowchart = nodes
        .filter((node1, index) => {
          // Check if the current node is "Add Action" and the node above it has the label "Delay"
          if (
            node1.data.label === "Add Action" &&
            index > 0 &&
            nodes[index - 1].data.label === "Delay"
            //   ||
            // (index > 0 && node1.data.label === "1-1 Only") ||
            // (index > 0 && node1.data.label === "1-1 + AutomatedAI") ||
            // (index > 0 && node1.data.label === "Add Action")
          ) {
            return false; // Skip "Add Action" and the node above it with "Delay"
          }
          return true; // Include all other nodes
        })
        .map((node1, index) => {
          // node1.data = nodes[index].data;
          // console.log("node.formdata:2 " + JSON.stringify(node1.data));
          const flowchartNode: FlowchartNode = {
            content: {
              // ...node1.data,
              value: node1.data.label,
              ...node1.data.formData,
            },
            choosenFunction: node1.data.choosenFunction,
            id: node1.id,
            prevNode: null,
          };

          // Set prevNode based on the number of nodes
          if (index === 0) {
            flowchartNode.prevNode = null; // First node, so prevNode is null
            if (!flowchartNode.id) {
              flowchartNode.id = uuidv4();
            }
          } else {
            flowchartNode.prevNode = nodes[index - 1].id; // Previous node's id
          }

          const keysToInclude = [
            //   "searchURL",
            //   "profileNumber",
            "messageField",
            //   "delayUnit",
            //   "delayValue",
            //   "withdrawal",
            //   "link",
            //   "numberOfMembers",
            //   "commentersUsage",
            //   "reactionType",
            //   "proficiency",
            //   "relationship",
            //   "extractProfileNumber",
            //   "websiteSearchURL",
            //   "location",
            //   "industry",
            //   "companySize",
            //   "technologyUsage",
            //   "messageField",
            //   "companyName",
            //   "jobTitle",
            //   "groupUrl",
            "templateId",
            "mailboxId",
            "isRotating",
            "aiSdrPitchCTAId",
            "aiSdrField",
            "aiSdrAdditionalInfoField",
            "aiSdrObjectionsField",
            "aiSdrCompetitionsField",
            "aiSdrAutomated",
          ];

          if (nodes[index].data) {
            // Create a dynamic type for nodes[index].data
            type DynamicData = {
              [key: string]: string | undefined;
            };

            // Assert that nodes[index].data is of the dynamic type
            const dynamicData = nodes[index].data as unknown as DynamicData;

            // Iterate through the keys and assign them to flowchartNode.content if they exist
            for (const key of keysToInclude) {
              if (dynamicData.hasOwnProperty(key)) {
                // console.log("arraging adding keys: " + JSON.stringify(dynamicData));
                // Use type assertion to suppress type error
                flowchartNode.content[key as keyof typeof flowchartNode.content] = dynamicData[
                  key
                ] as any;
                node1.data.formData[key as keyof typeof node1.data.formData] = dynamicData[
                  key
                ] as never;
              }
            }
          }
          // if (nodes[index].data.hasOwnProperty("searchURL")) {
          //   // Create a dynamic type for nodes[index].data
          //   type DynamicData = {
          //     [key: string]: string | undefined;
          //   };

          //   // Assert that nodes[index].data is of the dynamic type
          //   const dynamicData = nodes[index].data as unknown as DynamicData;

          //   // Assign the key and its value to flowchartNode.content
          //   flowchartNode.content.searchURL = dynamicData.searchURL;
          // }

          return flowchartNode;
        });
      // console.log("New Node: " + JSON.stringify(workflowTemplate));
      // console.log("All Node: " + JSON.stringify(nodes));
    }
  };

  const backupOldNodes = async () => {
    if (nodes.length > 0) {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        value: node.data.label,
      }));
      // .filter((node) => {
      //   // Filter out nodes with label "1-1 only", "1-1 automated", and "add action"
      //   return (
      //     node.data.label !== "1-1 Only" &&
      //     node.data.label !== "1-1 + Automated AI" &&
      //     node.data.label !== "Add Action"
      //   );
      // });
      setOldNodes(updatedNodes);
    }
  };

  const reRednerAllNodes = async () => {
    if (nodes.length > 0) {
      const updatedNodes = nodes.map((node) => ({
        ...node,
        value: node.data.label,
      }));
      // .filter((node) => {
      //   // Filter out nodes with label "1-1 only", "1-1 automated", and "add action"
      //   return (
      //     node.data.label !== "1-1 Only" &&
      //     node.data.label !== "1-1 + Automated AI" &&
      //     node.data.label !== "Add Action"
      //   );
      // });
      setNodes(updatedNodes);
    }
  };

  const prepareSendingNodes = async () => {
    if (nodes.length > 0) {
      const updatedNodes = nodes
        .map((node) => ({
          ...node,
          value: node.data.label,
        }))
        .filter((node) => {
          // Filter out nodes with label "1-1 only", "1-1 automated", and "add action"
          return (
            node.data.label !== "1-1 Only" &&
            node.data.label !== "1-1 AutoPilot" &&
            node.data.label !== "Add Action"
          );
        });
      setNodes(updatedNodes);
    }
  };

  const restoreOldNodes = async () => {
    if (oldNodes.length > 0) {
      const updatedNodes = oldNodes.map((node) => ({
        ...node,
        value: node.data.label,
      }));
      // .filter((node) => {
      //   // Filter out nodes with label "1-1 only", "1-1 automated", and "add action"
      //   return (
      //     node.data.label !== "1-1 Only" &&
      //     node.data.label !== "1-1 + Automated AI" &&
      //     node.data.label !== "Add Action"
      //   );
      // });
      setNodes(updatedNodes);
    }
  };

  useEffect(() => {
    arrangeNodes();
  }, [nodes, edges]);

  const onNodesDelete = useCallback(
    (deleted: any[]) => {
      const nodesToDelete = new Set();
      const edgesToDelete = new Set();
      const selectedNode = deleted[0];

      // Find all children nodes and collect their IDs
      function deleteNodesRecursive(nodeId: any) {
        const currentNode = nodes.find((node) => node.id === nodeId);
        if (currentNode) {
          const connectedEdges = getConnectedEdges([currentNode], edges);

          connectedEdges.forEach((edge) => {
            const connectedNodeId = edge.target === currentNode.id ? null : edge.target;
            nodesToDelete.add(connectedNodeId);
            edgesToDelete.add(edge.id);
            deleteNodesRecursive(connectedNodeId);
          });
        }
      }

      const parentEdge = edges.find((edge) => edge.target === selectedNode.id);
      if (parentEdge) {
        const parentNodeId = parentEdge.source;
        nodesToDelete.add(parentNodeId);

        // Now, you can find the parent node using parentNodeId
        const grandParentEdge = edges.find((edge) => edge.target === parentNodeId);
        if (grandParentEdge) {
          const grandParentNodeId = grandParentEdge.source;
          const selectedNodeParent = nodes.find((node) => node.id === grandParentNodeId);
          if (selectedNodeParent) {
            selectedNodeParent.data.isDropDownDisabled = false;
          }
        }
        deleteNodesRecursive(parentNodeId);
      }

      setEdges((prevEdges) => {
        const updatedEdges = prevEdges.filter((edge) => !edgesToDelete.has(edge.id));
        return updatedEdges;
      });

      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node) => !nodesToDelete.has(node.id));
        return updatedNodes;
      });
      // arrangeNodes();
    },
    [nodes, edges, setNodes, setEdges]
  );
  const addingDelayNode = (node: any, selectedOptionValue: any) => {
    // const nodesLength = nodes.length;
    const nodesLength = node.data.isOnStep ? node.data.isOnStep : 1;
    const delayAdded = addDelayNode(node, selectedOptionValue);
    node.data.isDropDownDisabled = true;
    // node.data.isOnStep = nodesLength;

    if (delayAdded) {
      delayAdded.newDelayNode.data.isDropDownDisabled = true;
      const prebuiltData: FormData = {
        value: "Delay",
        delayValue: "2",
      };
      const updatedFormData = {
        ...node.data.formData,
        ...prebuiltData,
      };
      delayAdded.newDelayNode.data.formData = updatedFormData;
      const { newDelayNode, newDelayEdge } = delayAdded;
      delayAdded.newDelayNode.data.isOnStep = nodesLength + 1;
      setNodes((prevNodes) => [...prevNodes, newDelayNode]);
      setEdges((prevEdges) => [...prevEdges, newDelayEdge]);
      delayAdded.newDelayNode.data.formData = updatedFormData;
    }
    return delayAdded;
  };
  const createNewNode = (node: any, selectedOptionValue: any) => {
    // const nodesLength = nodes.length;
    const nodesLength = node.data.isOnStep ? node.data.isOnStep : 1;
    if (
      selectedOptionValue === "Linkedin Sales Navigator Search Extractor" ||
      selectedOptionValue === "Linkedin Search Extractor"
    ) {
      const delayAdded = addingDelayNode(node, selectedOptionValue);
      const leftNode = addAINode(delayAdded?.newDelayNode, selectedOptionValue, "left");

      if (leftNode) {
        const { newAiNode, newAiEdge } = leftNode;
        setNodes((prevNodes) => [...prevNodes, newAiNode]);
        setEdges((prevEdges) => [...prevEdges, newAiEdge]);
      }

      const rightNode = addAINode(delayAdded?.newDelayNode, selectedOptionValue, "right");

      if (rightNode) {
        const { newAiNode, newAiEdge } = rightNode;
        setNodes((prevNodes) => [...prevNodes, newAiNode]);
        setEdges((prevEdges) => [...prevEdges, newAiEdge]);
      }

      const result = addNewNode(delayAdded?.newDelayNode, selectedOptionValue);

      if (result) {
        const { newNode, newEdge } = result;
        result.newNode.data.isOnStep = delayAdded?.newDelayNode.data.isOnStep
          ? delayAdded?.newDelayNode.data.isOnStep + 1
          : 0;
        result.newNode.position.y = result.newNode.position.y + 40;
        result.newEdge.type = "addAiActionEdge";
        result.newEdge.data.label = "Go With";
        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
        result.newNode.data.isOnStep = delayAdded?.newDelayNode.data.isOnStep
          ? delayAdded?.newDelayNode.data.isOnStep
          : 0;
      }
    } else if (selectedOptionValue === "1-1 Only" || selectedOptionValue === "1-1 AutoPilot") {
      nodes[4].data.label = "1-1";
      nodes[4].data.isDropDownDisabled = true;
      nodes[4].data.choosenFunction = "other";
      edges[3].data.label = "";
      edges[3].type = "";
      setEdges(edges);
      const delayAdded = addingDelayNode(nodes[4], selectedOptionValue);

      const result = addNewNode(delayAdded?.newDelayNode, "1-1");

      if (result) {
        const { newNode, newEdge } = result;
        result.newNode.data.isOnStep = delayAdded?.newDelayNode.data.isOnStep
          ? delayAdded?.newDelayNode.data.isOnStep + 1
          : 0;
        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
        result.newNode.data.isOnStep = delayAdded?.newDelayNode.data.isOnStep
          ? delayAdded?.newDelayNode.data.isOnStep
          : 0;
      }
      if (selectedOptionValue === "1-1 AutoPilot" && result) {
        result.newNode.data.label = "Automated AI";
        result.newNode.data.isDropDownDisabled = true;
        const delayAdded1 = addingDelayNode(result.newNode, selectedOptionValue);
        const resultaai = addNewNode(delayAdded1?.newDelayNode, "Automated AI");

        if (resultaai) {
          const { newNode, newEdge } = resultaai;
          resultaai.newNode.data.isOnStep = delayAdded1?.newDelayNode.data.isOnStep
            ? delayAdded1?.newDelayNode.data.isOnStep + 2
            : 0;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          resultaai.newNode.data.isOnStep = delayAdded1?.newDelayNode.data.isOnStep
            ? delayAdded1?.newDelayNode.data.isOnStep + 1
            : 0;
        }
      }

      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 Only");
        return updatedNodes;
      });
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 AutoPilot");
        return updatedNodes;
      });
    } else if (selectedOptionValue === "Visited Website") {
      if (edges[3]) {
        edges[3].data.label = "";
        edges[3].type = "";
        setEdges(edges);
      }
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 Only");
        return updatedNodes;
      });
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 AutoPilot");
        return updatedNodes;
      });
      const delayAdded = addDelayNode(node, selectedOptionValue);
      node.data.isDropDownDisabled = true;
      if (selectedOptionValue == "Send Mail") {
        node.data.choosenFunction = "mail";
      }
      // node.data.isOnStep = nodesLength;

      if (delayAdded) {
        delayAdded.newDelayNode.data.isDropDownDisabled = true;
        const prebuiltData: FormData = {
          value: "Delay",
          delayValue: "2",
        };
        const updatedFormData = {
          ...node.data.formData,
          ...prebuiltData,
        };
        delayAdded.newDelayNode.data.formData = updatedFormData;
        const { newDelayNode, newDelayEdge } = delayAdded;
        delayAdded.newDelayNode.data.isOnStep = nodesLength + 1;
        setNodes((prevNodes) => [...prevNodes, newDelayNode]);
        setEdges((prevEdges) => [...prevEdges, newDelayEdge]);
        delayAdded.newDelayNode.data.formData = updatedFormData;
        const result = addNewNode(delayAdded.newDelayNode, selectedOptionValue);

        if (result) {
          const { newNode, newEdge } = result;
          result.newNode.data.isOnStep = delayAdded.newDelayNode.data.isOnStep + 1;
          newNode.data.label = "Prospect on Linkedin";
          newNode.data.isDropDownDisabled = true;
          newNode.data.choosenFunction = "linkedin";
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          result.newNode.data.isOnStep = delayAdded.newDelayNode.data.isOnStep;
          createNewNode(result.newNode, "Prospect on Linkedin");
        }
      }
    } else {
      if (edges[3]) {
        edges[3].data.label = "";
        edges[3].type = "";
        setEdges(edges);
      }
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 Only");
        return updatedNodes;
      });
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.filter((node1) => node1.data.label !== "1-1 AutoPilot");
        return updatedNodes;
      });
      const delayAdded = addDelayNode(node, selectedOptionValue);
      node.data.isDropDownDisabled = true;
      const choosenFtn = workflowAutomationsArray.find(
        (item) => item.title === selectedOptionValue
      )?.choosenFunction;
      node.data.choosenFunction = choosenFtn;
      if (selectedOptionValue == "Send Mail") {
        node.data.choosenFunction = "mail";
      }
      // node.data.isOnStep = nodesLength;

      if (delayAdded) {
        delayAdded.newDelayNode.data.isDropDownDisabled = true;
        const prebuiltData: FormData = {
          value: "Delay",
          delayValue: "2",
        };
        const updatedFormData = {
          ...node.data.formData,
          ...prebuiltData,
        };
        delayAdded.newDelayNode.data.formData = updatedFormData;
        const { newDelayNode, newDelayEdge } = delayAdded;
        delayAdded.newDelayNode.data.isOnStep = nodesLength + 1;
        setNodes((prevNodes) => [...prevNodes, newDelayNode]);
        setEdges((prevEdges) => [...prevEdges, newDelayEdge]);
        delayAdded.newDelayNode.data.formData = updatedFormData;
        // arrangeNodes();
        const result = addNewNode(delayAdded.newDelayNode, selectedOptionValue);

        if (result) {
          const { newNode, newEdge } = result;
          // result.newNode.data.isOnStep = nodesLength + 2;
          result.newNode.data.isOnStep = delayAdded.newDelayNode.data.isOnStep + 1;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          result.newNode.data.isOnStep = delayAdded.newDelayNode.data.isOnStep;
          // result.newNode.data.isOnStep = nodesLength + 2;
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
        }
      }
    }
    // console.log("all nodes" + JSON.stringify(nodes));
  };

  const onNodeClick = useCallback(
    (event: any, node: any) => {
      if (node.type === "addActionNode" || node.type === "addAiActionNode") {
        // console.log("nodeClicked" + JSON.stringify(event.target.getAttribute("id")));
        // console.log("Clicked Element:", event.target); // Log the entire event.target object
        // console.log("nodeClicked ID:", event.target.id);
        if (
          // (event.target && event.target.tagName === "OPTION") ||
          (event.target &&
            event.target.id === "nodeSelectId" &&
            event.target.value !== "Add Action") ||
          (event.target &&
            event.target.id === "nodeSelectOption" &&
            event.target.value !== "Add Action")
        ) {
          // const selectedOptionValue = event.target.value;
          // if (node.id === "1") {
          //createNode with Root Options
          // createNewNode(node, selectedOptionValue);
          createNewNode(node, node?.data?.label);
          // } else {
          //   //create sub menu based on parent options
          //   createNewNode(node, selectedOptionValue);
          // }
          node.data.isDropDownDisabled = true;
          // console.log("New Node Added: " + JSON.stringify(nodes));
        }
        // Check if the clicked element is the "Add" button
        if (event.target && event.target.textContent === "Add") {
          // Handle the "Add" button click
          // createNewNode(node);
        }
        if (event.target && event.target.id === "delete" && node.id !== initialNodeUId) {
          onNodesDelete([node]);
        }
      }
      arrangeNodes();
    },
    [nodes, setNodes, setEdges]
  );

  const onSaveWorkflowClick = async () => {
    setIsSaveWorkflowPending(true);
    arrangeNodes();
    const missingNodes = missingFormNodes();
    if (missingNodes && missingNodes.length) {
      const missing = missingNodes?.join(", ");
      toast.warn(`${missing} ${missingNodes?.length === 1 ? "has" : "have"} missing value!`);
      restoreOldNodes();
    } else {
      setIsNextPending(true);
      if (nodes.length < 1 || nodes[0].data.label === "Add Action") {
        toast.warn("No nodes have been added. Please add nodes before saving.");
        setIsNextPending(false);
        setIsSaveWorkflowPending(false);
        restoreOldNodes();
        return false;
      }
      if (newWorkflowTemplate.id != null) {
        try {
          await backupOldNodes();
          await prepareSendingNodes();
          // arrangeNodes();
          await axios(true).post(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${newWorkflowTemplate.id}/update`,
            JSON.stringify(newWorkflowTemplate),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          toast.success("Workflow updated successfully!");
          setIsNextPending(false);
          setIsSaveWorkflowPending(false);
          restoreOldNodes();
          return true;
        } catch (error) {
          toast.error("Failed to save workflow. Please try again.");
          console.error("Failed to save workflow." + error);
          setIsNextPending(false);
          setIsSaveWorkflowPending(false);
          restoreOldNodes();
          return false;
        }
      } else {
        try {
          await backupOldNodes();
          await prepareSendingNodes();
          // arrangeNodes();
          const response = await axios(true).post(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/`,
            JSON.stringify(newWorkflowTemplate),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          toast.success("Workflow saved successfully!");
          if (response) {
            // console.log("response onsave : " + JSON.stringify(response.data.id));
            newWorkflowTemplate.id = response.data.id;
          }
          if (newWorkflowTemplate.status === "created") {
            const toSend = `remove_prospect_on_li_reply=${1}&remove_prospect_on_email_reply=${1}`;
            const response1 = await axios(true).put(
              `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${newWorkflowTemplate?.id}/settings?${toSend}`,
              {}
            );
            const receiveData = response1.status.toString();
            if (receiveData === "success") {
              toast.success("Condition Setting saved successfully!");
            }
          }
          setIsNextPending(false);
          setIsSaveWorkflowPending(false);
          restoreOldNodes();
          return true;
        } catch (error) {
          console.error("Error saving workflow:", error);
          toast.error("Failed to save workflow. Please try again.");
          setIsNextPending(false);
          setIsSaveWorkflowPending(false);
          restoreOldNodes();
          return false;
        }
      }
    }
    setIsNextPending(false);
    setIsSaveWorkflowPending(false);
    return false;
  };

  const loadOldNodes = async (haveWorkflowId: number) => {
    setIsOldNodeLoading(true);
    let jsonData = null;
    try {
      setIsOldNodeLoading(true);
      // arrangeNodes();
      const response = await axios(true).get(
        `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${haveWorkflowId}`,
        {}
      );

      newWorkflowTemplate.id = response.data.id;
      newWorkflowTemplate.userId = response.data.user_id;
      jsonData = response.data;
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
    if (typeof jsonData !== "string") {
      jsonData = JSON.stringify(jsonData);
    }
    jsonData = JSON.parse(jsonData);
    newWorkflowTemplate.name = jsonData.name;
    newWorkflowTemplate.tag = jsonData.tag;
    newWorkflowTemplate.id = jsonData.id;
    newWorkflowTemplate.status = jsonData.status;
    // let oldAddedNode = nodes[nodes.length - 1];
    let oldAddedNode = nodes.find((node) => node.id === initialNodeUId);
    let prevOldAddedNode = oldAddedNode;
    let newAddedNode = null;
    // if (jsonData.flowchart.length > 0) {
    //   const selectedOption = jsonData.flowchart[0].content.value;
    //   if (oldAddedNode) {
    //     oldAddedNode.data.label = selectedOption;
    //     oldAddedNode.data.isDropDownDisabled = true;
    //     setNodes((prevNodes) => [...prevNodes]);
    //     // arrangeNodes();
    //   }
    // }
    newWorkflowTemplate.flowchart = jsonData.flowchart.map((node: any, index: any, array: any) => {
      setIsOldNodeLoading(true);
      const selectedOption = node.content.value;
      // Create a new FlowchartNode and assign values
      const flowchartNode: FlowchartNode = {
        choosenFunction: node.choosenFunction,
        content: {
          value: node.content.value,
          autoStopCondition: node.content.autoStopCondition || undefined,
          schedulesOptions: node.content.schedulesOptions || undefined,
          messageField: node.content.messageField || undefined,
          templateId: node.content.templateId || undefined,
          mailboxId: node.content.mailboxId || undefined,
          isRotating: node.content.isRotating || undefined,
          aiSdrPitchCTAId: node.content.aiSdrPitchCTAId || undefined,
          aiSdrField: node.content.aiSdrField || undefined,
          aiSdrAdditionalInfoField: node.content.aiSdrAdditionalInfoField || undefined,
          aiSdrObjectionsField: node.content.aiSdrObjectionsField || undefined,
          aiSdrCompetitionsField: node.content.aiSdrCompetitionsField || undefined,
          aiSdrAutomated: node.content.aiSdrAutomated || undefined,
          delayValue: node.content.delayValue || undefined,
          delayUnit: node.content.delayUnit || undefined,
          proficiency: node.content.proficiency || undefined,
          relationship: node.content.relationship || undefined,
        },
        id: node.id,
        prevNode: node.prevNode,
        stats: node.stats || undefined,
      };
      if (index === 0 && oldAddedNode) {
        const nodeIndex = nodes.findIndex((nodeByRoot) => nodeByRoot.id === oldAddedNode?.id);

        if (nodeIndex !== -1) {
          // Create a new node object with the updated ID and other properties
          const updatedNode = {
            ...nodes[nodeIndex], // Copy all properties of the old node
            id: node.id, // Update the ID to the new ID
            status: node.status,
            data: {
              ...nodes[nodeIndex].data, // Copy the data object
              label: selectedOption,
              isDropDownDisabled: true,
              choosenFunction: node.choosenFunction,
              isNewNode: false,
              isOnStep: 1,
              ...node.content,
            },
          };

          const updatedNodes = nodes.map((nodebyroot, indexnodebyroot) => {
            if (indexnodebyroot === nodeIndex) {
              return updatedNode; // Replace the old node with the updated one
            }
            return nodebyroot; // Keep other nodes unchanged
          });
          // Set the state to the updatedNodes array, effectively removing the old node
          setNodes(updatedNodes);
          oldAddedNode = updatedNode;
          // console.log("node --------- data:", updatedNode);
        }
        // oldAddedNode.data.label = selectedOption;
        // oldAddedNode.data.isDropDownDisabled = true;
        // setNodes((prevNodes) => [...prevNodes]);
        // arrangeNodes();
      } else if (oldAddedNode && node.choosenFunction === "timer") {
        newAddedNode = addDelayNode(oldAddedNode, selectedOption, node.id);

        if (newAddedNode) {
          const { newDelayNode, newDelayEdge } = newAddedNode;
          newAddedNode.newDelayNode.data = {
            ...newAddedNode.newDelayNode.data, // Copy existing data properties
            ...node.content, // Assign new properties from node.content
            label: selectedOption, // Override the label property
            isDropDownDisabled: true, // Override the isDropDownDisabled property
            isOnStep: oldAddedNode.data.isOnStep + 1,
          };
          // newAddedNode.newDelayNode.data.label = selectedOption;
          // newAddedNode.newDelayNode.data.isDropDownDisabled = true;
          setNodes((prevNodes) => [...prevNodes, newDelayNode]);
          setEdges((prevEdges) => [...prevEdges, newDelayEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          prevOldAddedNode = oldAddedNode;
          oldAddedNode = newAddedNode.newDelayNode;
        }
      } else if (oldAddedNode) {
        newAddedNode = addNewNode(oldAddedNode, selectedOption, node.id);

        if (newAddedNode) {
          const { newNode, newEdge } = newAddedNode;
          newAddedNode.newNode.data = {
            ...newAddedNode.newNode.data, // Copy existing data properties
            ...node.content, // Assign new properties from node.content
            label: selectedOption, // Override the label property
            isDropDownDisabled: true, // Override the isDropDownDisabled property
            isNewNode: false,
            isOnStep: oldAddedNode.data.isOnStep,
          };
          // newAddedNode.newNode.data.label = selectedOption;
          // newAddedNode.newNode.data.isDropDownDisabled = true;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          prevOldAddedNode = oldAddedNode;
          oldAddedNode = newAddedNode.newNode;
        }
      }
      if (array.length - 1 === index) {
        newAddedNode = addNewNode(oldAddedNode, prevOldAddedNode?.data.label);

        if (newAddedNode) {
          const { newNode, newEdge } = newAddedNode;
          newNode.data.isOnStep = oldAddedNode?.data.isOnStep;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          oldAddedNode = newAddedNode.newNode;
        }
      }
      setIsOldNodeLoading(false);
      return flowchartNode;
    });
    // console.log("newWorkflowTemplate After Loading: " + JSON.stringify(newWorkflowTemplate));
  };

  const loadNodesFromTemplates = async (rRecommendedTemplate: any) => {
    setIsOldNodeLoading(true);
    // console.log("template name --------- :", rRecommendedTemplate);

    let jsonData = null;
    jsonData = rRecommendedTemplate;
    newWorkflowTemplate.name = jsonData.name;
    newWorkflowTemplate.tag = jsonData.tag;
    newWorkflowTemplate.id = jsonData.id;
    newWorkflowTemplate.status = jsonData.status;
    // let oldAddedNode = nodes[nodes.length - 1];
    let oldAddedNode = nodes.find((node) => node.id === initialNodeUId);
    let prevOldAddedNode = oldAddedNode;
    let newAddedNode = null;
    // if (jsonData.flowchart.length > 0) {
    //   const selectedOption = jsonData.flowchart[0].content.value;
    //   if (oldAddedNode) {
    //     oldAddedNode.data.label = selectedOption;
    //     oldAddedNode.data.isDropDownDisabled = true;
    //     setNodes((prevNodes) => [...prevNodes]);
    //     // arrangeNodes();
    //   }
    // }
    newWorkflowTemplate.flowchart = jsonData.flowchart.map((node: any, index: any, array: any) => {
      setIsOldNodeLoading(true);
      const selectedOption = node.content.value;
      // Create a new FlowchartNode and assign values
      const flowchartNode: FlowchartNode = {
        choosenFunction: node.choosenFunction,
        content: {
          value: node.content.value,
          autoStopCondition: node.content.autoStopCondition || undefined,
          messageField: node.content.messageField || undefined,
          templateId: node.content.templateId || undefined,
          mailboxId: node.content.mailboxId || undefined,
          isRotating: node.content.isRotating || undefined,
          aiSdrPitchCTAId: node.content.aiSdrPitchCTAId || undefined,
          aiSdrField: node.content.aiSdrField || undefined,
          aiSdrAdditionalInfoField: node.content.aiSdrAdditionalInfoField || undefined,
          aiSdrObjectionsField: node.content.aiSdrObjectionsField || undefined,
          aiSdrCompetitionsField: node.content.aiSdrCompetitionsField || undefined,
          aiSdrAutomated: node.content.aiSdrAutomated || undefined,
          delayValue: node.content.delayValue || undefined,
          delayUnit: node.content.delayUnit || undefined,
          proficiency: node.content.proficiency || undefined,
          relationship: node.content.relationship || undefined,
        },
        id: node.id,
        prevNode: node.prevNode,
        stats: node.stats || undefined,
      };
      if (index === 0 && oldAddedNode) {
        const nodeIndex = nodes.findIndex((nodeByRoot) => nodeByRoot.id === oldAddedNode?.id);

        if (nodeIndex !== -1) {
          // Create a new node object with the updated ID and other properties
          const updatedNode = {
            ...nodes[nodeIndex], // Copy all properties of the old node
            id: node.id, // Update the ID to the new ID
            status: node.status,
            data: {
              ...nodes[nodeIndex].data, // Copy the data object
              label: selectedOption,
              isDropDownDisabled: true,
              choosenFunction: node.choosenFunction,
              isNewNode: false,
              isOnStep: 1,
              ...node.content,
            },
          };

          const updatedNodes = nodes.map((nodebyroot, indexnodebyroot) => {
            if (indexnodebyroot === nodeIndex) {
              return updatedNode; // Replace the old node with the updated one
            }
            return nodebyroot; // Keep other nodes unchanged
          });
          // Set the state to the updatedNodes array, effectively removing the old node
          setNodes(updatedNodes);
          oldAddedNode = updatedNode;
          // console.log("node --------- data:", updatedNode);
        }
        // oldAddedNode.data.label = selectedOption;
        // oldAddedNode.data.isDropDownDisabled = true;
        // setNodes((prevNodes) => [...prevNodes]);
        // arrangeNodes();
      } else if (oldAddedNode && node.choosenFunction === "timer") {
        newAddedNode = addDelayNode(oldAddedNode, selectedOption, node.id);

        if (newAddedNode) {
          const { newDelayNode, newDelayEdge } = newAddedNode;
          newAddedNode.newDelayNode.data = {
            ...newAddedNode.newDelayNode.data, // Copy existing data properties
            ...node.content, // Assign new properties from node.content
            label: selectedOption, // Override the label property
            isDropDownDisabled: true, // Override the isDropDownDisabled property
            isOnStep: oldAddedNode.data.isOnStep + 1,
          };
          // newAddedNode.newDelayNode.data.label = selectedOption;
          // newAddedNode.newDelayNode.data.isDropDownDisabled = true;
          setNodes((prevNodes) => [...prevNodes, newDelayNode]);
          setEdges((prevEdges) => [...prevEdges, newDelayEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          prevOldAddedNode = oldAddedNode;
          oldAddedNode = newAddedNode.newDelayNode;
        }
      } else if (oldAddedNode) {
        newAddedNode = addNewNode(oldAddedNode, selectedOption, node.id);

        if (newAddedNode) {
          const { newNode, newEdge } = newAddedNode;
          newAddedNode.newNode.data = {
            ...newAddedNode.newNode.data, // Copy existing data properties
            ...node.content, // Assign new properties from node.content
            label: selectedOption, // Override the label property
            isDropDownDisabled: true, // Override the isDropDownDisabled property
            isNewNode: false,
            isOnStep: oldAddedNode.data.isOnStep,
          };
          // newAddedNode.newNode.data.label = selectedOption;
          // newAddedNode.newNode.data.isDropDownDisabled = true;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          prevOldAddedNode = oldAddedNode;
          oldAddedNode = newAddedNode.newNode;
        }
      }
      if (array.length - 1 === index) {
        newAddedNode = addNewNode(oldAddedNode, prevOldAddedNode?.data.label);

        if (newAddedNode) {
          const { newNode, newEdge } = newAddedNode;
          newNode.data.isOnStep = oldAddedNode?.data.isOnStep;
          setNodes((prevNodes) => [...prevNodes, newNode]);
          setEdges((prevEdges) => [...prevEdges, newEdge]);
          // const addedNode = nodes.find((n) => n.id === newNode.id);
          // console.log("New Node: " + JSON.stringify(nodes));
          // arrangeNodes();
          oldAddedNode = newAddedNode.newNode;
        }
      }
      setIsOldNodeLoading(false);
      console.log("New Node: " + JSON.stringify(nodes));
      return flowchartNode;
    });
  };

  // const handleIsShowStats = async () => {
  //   setIsShowStats(!isShowStats);
  // };

  const handleNext = async () => {
    reRednerAllNodes();
    backupOldNodes();
    arrangeNodes();
    const missingNodes = missingFormNodes();
    if (missingNodes && missingNodes.length) {
      const missing = missingNodes?.join(", ");
      toast.warn(`${missing} ${missingNodes?.length === 1 ? "has" : "have"} missing value!`);
      // restoreOldNodes();
    } else {
      setIsNextPending(true);
      if (
        newWorkflowTemplate.id &&
        newWorkflowTemplate.status &&
        newWorkflowTemplate.status !== "paused" &&
        newWorkflowTemplate.status !== "created"
      ) {
        try {
          prepareSendingNodes();
          // console.log("before sending server", JSON.stringify(newWorkflowTemplate));
          const response = await axios(true).post(
            `${process.env.REACT_APP_WORKFLOW_API_URL}/workflow/${newWorkflowTemplate?.id}/pause`,
            {}
          );
          const receivedData = response.data.status.toString();
          if (receivedData === "paused") {
            newWorkflowTemplate.status = "paused";
            toast.success("Workflow paused successfully!");
            restoreOldNodes();
          } else {
            // Handle errors
            toast.error("Failed to pause workflow. Please try again.");
            restoreOldNodes();
          }
        } catch (error) {
          // Handle network errors
          console.error("Error pause workflow:", error);
          alert("Failed to pause workflow." + error);
          restoreOldNodes();
          return false;
        }
      } else {
        newWorkflowTemplate.status = "created";
      }

      const savedSuccessfully = await onSaveWorkflowClick();
      if (savedSuccessfully) {
        setIsNextPending(false);
        // console.log("onNextTab");
        // console.log("data before going to summarize" + newWorkflowTemplate.id);
        onNextTab(newWorkflowTemplate);
        restoreOldNodes();
      } else {
        // console.log("NoonNextTab");
        setIsNextPending(false);
        restoreOldNodes();
      }
    }
  };
  const handleBack = async () => {
    workflowId = undefined;
    recommendedTemplate = undefined;
    rWorkflowTemplateToLoad = undefined;
    newWorkflowTemplate = { ...workflowTemplate };
    setNodes(copyOfInitNode);
    // console.log("templt: " + JSON.stringify(initialNodes));
    onBackTab();
  };

  useEffect(() => {
    // console.log("workflowId " + workflowId);
    if (workflowId || summerWorkflowId) {
      // setNodes(copyOfInitNode);
      loadOldNodes(workflowId ? workflowId : summerWorkflowId);
    } else {
      // setIsOldNodeLoading(false);
    }
    if (recommendedTemplate) {
      loadNodesFromTemplates(recommendedTemplate);
    } else {
      // setIsOldNodeLoading(false);
    }
    if (rWorkflowTemplateToLoad) {
      loadNodesFromTemplates(rWorkflowTemplateToLoad);
    } else {
      // setIsOldNodeLoading(false);
    }
    if (!(summerWorkflowId || workflowId || recommendedTemplate || rWorkflowTemplate)) {
      setIsOldNodeLoading(false);
      console.log("non is true: ");
      // setNodes(nodes);
      setNodes(copyOfInitNode);
      workflowId = undefined;
      recommendedTemplate = undefined;
      rWorkflowTemplateToLoad = undefined;
      newWorkflowTemplate = undefined;
      newWorkflowTemplate = { ...workflowTemplate };
      newWorkflowTemplate.name = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true, // Include AM/PM format
      });
      // emailTemplates();
    } else {
      // console.log("some is true: ");
      // console.log("some is true: new workflow template " + JSON.stringify(newWorkflowTemplate));
      // console.log("some is true: wfid " + JSON.stringify(workflowId));
      // console.log("some is true: summer " + JSON.stringify(summerWorkflowId));
      // console.log("some is true: recommended " + JSON.stringify(recommendedTemplate));
      // console.log("some is true: rworkflowtoload " + JSON.stringify(rWorkflowTemplateToLoad));
      // emailTemplates();
    }
    // console.log("start method in abuiler sworkflowid1 " + JSON.stringify(newWorkflowTemplate));
  }, [workflowId, summerWorkflowId, recommendedTemplate, rWorkflowTemplateToLoad]);

  //doing aisdr templ here
  useEffect(() => {
    if (startMethod == "aisdr-setup") {
      loadNodesFromTemplates(handleAisdrSetup(aisdrData, newWorkflowTemplate.name));
    }
  }, []);

  return (
    <div
      className={
        isFullScreen
          ? "fixed inset-0 h-screen pt-30 pb-60 pr-60 w-100vw dark:bg-bodyBgColor-dark bg-bodyBgColor left-120"
          : ""
      }
    >
      {isOldNodeLoading || isNextPending ? (
        <div className='fixed inset-0 z-50'>
          <SplashScreen />
        </div>
      ) : (
        <div
          className={`flex flex-col max-w-100vw ${
            isFullScreen ? "h-[calc(100vh-68px)]" : "h-[calc(100vh-310px)]"
          }`}
        >
          <div className='grid grid-cols-5 pt-10 pb-20'>
            {/* <Button
              buttonClassName='flex items-center'
              onClick={onSaveWorkflowClick}
              className='w-120'
              isPending={isSaveWorkflowPending}
            >
              Save Workflow
            </Button> */}
            <div>
              <p className='text-neutral-800 dark:text-neutral-400 text-16'>
                {newWorkflowTemplate?.name}
              </p>
            </div>
            <div className=' text-neutral-800 dark:text-neutral-400 text-16'>
              {newWorkflowTemplate?.status ? "Status: " + newWorkflowTemplate?.status : ""}
            </div>
            <div className='flex items-center justify-center gap-25'>
              {startMethod !== "aisdr-setup" && (
                <Button className='w-125' buttonStyle='secondary' onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button className='w-145' onClick={handleNext}>
                {newWorkflowTemplate?.id ? "Save" : "Save"}
              </Button>
            </div>
            {/* <div className='flex items-center justify-center text-neutral-800 dark:text-neutral-400 text-16'>
              <span className='pr-8'>Stats:</span>
              <Switch
                // name={name} // name of the field
                // prefixLabel='Stats'
                // control={control}
                checked={isShowStats}
                onChange={(event) => {
                  // setIsShowStats(!isShowStats);
                  handleIsShowStats();
                }}
                className={`relative inline-flex h-18 w-30 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                  isShowStats ? "bg-primary" : "bg-neutral-400"
                }`}
              >
                <span
                  aria-hidden='true'
                  className={`translate-x-0 pointer-events-none inline-block h-14 w-14 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isShowStats ? "translate-x-12" : "translate-x-0"
                  }`}
                />
              </Switch>
            </div> */}
            <div></div>
            <div
              className='flex items-center justify-end pr-10 gap-10 hover:text-neutral-800 hover:dark:text-neutral-300 text-neutral-700 dark:text-neutral-400 duration-200 cursor-pointer transition-colors'
              role='button'
              onClick={() =>
                isFullScreen
                  ? dispatch(setBuilderScreenMode(false))
                  : dispatch(setBuilderScreenMode(true))
              }
            >
              <p className=''>{isFullScreen ? "Small Screen" : "Full Screen"}</p>
              {isFullScreen ? (
                <RiFullscreenExitLine className='w-24 h-24' />
              ) : (
                <RiFullscreenFill className='w-24 h-24 ' />
              )}
            </div>
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodesConnectable={false}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            // zoomOnScroll={false}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      )}
    </div>
  );
};

export default Builder;
