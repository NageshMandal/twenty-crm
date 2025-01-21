// utils/builderUtils.js
import { v4 as uuidv4 } from "uuid";
const node1UId = uuidv4();
const node2UId = uuidv4();
const node3UId = uuidv4();
const node4UId = uuidv4();
const node5UId = uuidv4();
const node6UId = uuidv4();
const node7UId = uuidv4();
const node8UId = uuidv4();
const node9UId = uuidv4();
const node10UId = uuidv4();
const node11UId = uuidv4();
const node12UId = uuidv4();
const node13UId = uuidv4();
const node14UId = uuidv4();
const node15UId = uuidv4();
const node16UId = uuidv4();
const node17UId = uuidv4();
const node18UId = uuidv4();

export function handleAisdrSetup(aisdrData, newWorkflowName) {
  // Some logic here
  const workflow = {
    name: newWorkflowName,
    tag: "",
    id: null,
    flowchart: [],
  };
  if (
    aisdrData.defineIcpAndPersona &&
    aisdrData.defineIcpAndPersona.landingPageUrl &&
    aisdrData.defineIcpAndPersona.landingPageUrl !== ""
  ) {
    workflow.flowchart.push({
      choosenFunction: "linkedin",
      content: {
        value: "Visited Website",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node2UId, // Unique ID for the node
      prevNode: node1UId, // No previous node
    });
  } else {
    const location = aisdrData.defineIcpAndPersona.location || "";
    const industry = aisdrData.defineIcpAndPersona.industry || "";
    const technology = aisdrData.defineIcpAndPersona.technology || "";
    const headCountGrowth = aisdrData.defineIcpAndPersona.headCountGrowth || "";
    const departmentHeadCount = aisdrData.defineIcpAndPersona.departmentHeadCount || "";
    const managementLevel = aisdrData.defineIcpAndPersona.managementLevel || "";
    const functionInCompany = aisdrData.defineIcpAndPersona.function || "";
    const personas = aisdrData.defineIcpAndPersona.personas || [];
    const includeRecentlyHired = aisdrData.defineIcpAndPersona.includeRecentlyHired || false;
    const contactLocation = aisdrData.defineIcpAndPersona.contactLocation || [];
    const companiesToProspect = aisdrData.defineIcpAndPersona.companiesToProspect || 0;
    const prospectsPerCompanyPerUser =
      aisdrData.defineIcpAndPersona.prospectsPerCompanyPerUser || 0;
    const useDirectPathToProspect = aisdrData.defineIcpAndPersona.useDirectPathToProspect || false;
    const visitorIdentified = aisdrData.defineIcpAndPersona.visitorIdentified || false;
    const directPathBySeniorityLevel =
      aisdrData.defineIcpAndPersona.directPathBySeniorityLevel || false;
    const autopilotOutboundTurnedOn =
      aisdrData.defineIcpAndPersona.autopilotOutboundTurnedOn || false;
    const autopilotRepliesTurnedOn =
      aisdrData.defineIcpAndPersona.autopilotRepliesTurnedOn || false;
    const jobTitle = aisdrData.defineIcpAndPersona.jobTitle || "";
    const companySizeByEmployee = aisdrData.defineIcpAndPersona.companySizeByEmployee || 0;
    const firstSystemPrompt =
      aisdrData.personalisationOptions.typesAndSignals[0].data.systemPrompt.value || "";
    const firstPrompt =
      aisdrData.personalisationOptions.typesAndSignals[0].data.promptForSpecificTask || "";

    workflow.flowchart.push({
      choosenFunction: "linkedin",
      content: {
        value: "AISDR Linkedin Sales Navigator Search Extractor",
        profileNumber: "100",
        searchURL: "https://www.linkedin.com/sales/search/",
        defineIcpAndPersona: aisdrData.defineIcpAndPersona,
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "1",
      },
      id: node2UId, // Unique ID for the node
      prevNode: node1UId, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "other",
      content: {
        value: "1-1",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "1",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "linkedin",
      content: {
        value: "Automated AI",
      },
      id: node5UId, // Unique ID for the node
      prevNode: node4UId,
    });
    workflow.flowchart.push({
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Minutes",
          label: "Minutes",
        },
        delayValue: "1",
      },
      id: node6UId, // Unique ID for the node
      prevNode: node5UId, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "other",
      content: {
        value: "AISDR Types and Signals",
        typesAndSignals: aisdrData.personalisationOptions.typesAndSignals,
      },
      id: node7UId, // Unique ID for the node
      prevNode: node6UId, // No previous node
    });
    workflow.flowchart.push({
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "1",
      },
      id: node8UId, // Unique ID for the node
      prevNode: node7UId, // No previous node
    });
    if (
      aisdrData.personalisationOptions.outboundOnLinkedIn &&
      aisdrData.personalisationOptions.outboundOnLinkedIn == true
    ) {
      workflow.flowchart.push({
        choosenFunction: "linkedin",
        content: {
          value: "Linkedin Connection Request",
          messageField: " #Language_English_#Prompt_MPGPTCRPrompt1",
        },
        id: node9UId, // Unique ID for the node
        prevNode: node8UId,
      });
      workflow.flowchart.push({
        choosenFunction: "timer",
        content: {
          value: "Delay",
          delayUnit: {
            value: "Days",
            label: "Days",
          },
          delayValue: "1",
        },
        id: node10UId, // Unique ID for the node
        prevNode: node9UId, // No previous node
      });
      workflow.flowchart.push({
        choosenFunction: "linkedin",
        content: {
          value: "Linkedin Message Sender",
          messageField: " #Language_English_#Prompt_MPGPTMSPrompt1",
        },
        id: node11UId, // Unique ID for the node
        prevNode: node10UId,
      });
      workflow.flowchart.push({
        choosenFunction: "timer",
        content: {
          value: "Delay",
          delayUnit: {
            value: "Minutes",
            label: "Minutes",
          },
          delayValue: "1",
        },
        id: node12UId, // Unique ID for the node
        prevNode: node11UId, // No previous node
      });
      workflow.flowchart.push({
        choosenFunction: "other",
        content: {
          // value: "AISDR Linkedin",
          value: "AI SDR Linkedin",
          // aiSdrSetupSystemPrompt: firstSystemPrompt,
          // aiSdrSetupPrompt: firstPrompt,
          aiSdrPitchCTAId: "0",
          aiSdrField: "We are offering best services",
        },
        id: node13UId, // Unique ID for the node
        prevNode: node12UId,
      });
      workflow.flowchart.push({
        choosenFunction: "timer",
        content: {
          value: "Delay",
          delayUnit: {
            value: "Minutes",
            label: "Minutes",
          },
          delayValue: "1",
        },
        id: node14UId, // Unique ID for the node
        prevNode: node13UId, // No previous node
      });
    }
    if (
      aisdrData.personalisationOptions.outboundOnEmail &&
      aisdrData.personalisationOptions.outboundOnEmail == true
    ) {
      //#Language_English_#Prompt_MGPTPrompt30
      workflow.flowchart.push({
        choosenFunction: "mail",
        content: {
          value: "Send Mail",
          messageField: "#Language_English_#Prompt_MGPTPrompt30",
          templateId: null,
          mailboxId: null,
        },
        id: node15UId, // Unique ID for the node
        prevNode: aisdrData.personalisationOptions.outboundOnLinkedIn ? node14UId : node8UId,
      });
      workflow.flowchart.push({
        choosenFunction: "timer",
        content: {
          value: "Delay",
          delayUnit: {
            value: "Minutes",
            label: "Minutes",
          },
          delayValue: "1",
        },
        id: node16UId, // Unique ID for the node
        prevNode: node15UId, // No previous node
      });
      workflow.flowchart.push({
        choosenFunction: "other",
        content: {
          // value: "AISDR Mail",
          value: "AI SDR",
          // aiSdrSetupSystemPrompt: firstSystemPrompt,
          // aiSdrSetupPrompt: firstPrompt,
          aiSdrPitchCTAId: "0",
          aiSdrField: "We are offering best services",
        },
        id: node17UId, // Unique ID for the node
        prevNode: node16UId,
      });
      workflow.flowchart.push({
        choosenFunction: "timer",
        content: {
          value: "Delay",
          delayUnit: {
            value: "Days",
            label: "Days",
          },
          delayValue: "2",
        },
        id: node18UId, // Unique ID for the node
        prevNode: node17UId, // No previous node
      });
    }
  }
  return workflow;
}
