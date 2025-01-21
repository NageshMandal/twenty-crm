import { v4 as uuidv4 } from "uuid";

const node1UId = uuidv4();
const node2UId = uuidv4();
const node3UId = uuidv4();
const node4UId = uuidv4();
const node5UId = uuidv4();
const node6UId = uuidv4();
const node7UId = uuidv4();
const node8UId = uuidv4();

export const invitationPlus2MessagesTemplate = {
  name: "Invitation + 2 Messages",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Sales Navigator List",
        profileNumber: "100",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
    // Connection Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Connection Request",
        messageField: "#Language_English_#Prompt_MPGPTCRPrompt1",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId,
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    },
    // First Message Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Message Sender",
        messageField: "#Language_English_#Prompt_MPGPTMSPrompt1",
      },
      id: node5UId, // Unique ID for the node
      prevNode: node4UId, // Previous node is Connection Node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node6UId, // Unique ID for the node
      prevNode: node5UId, // No previous node
    },
    // Second Message Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Message Sender",
        messageField: "#Language_English_#Prompt_MPGPTMSPrompt1",
      },
      id: node7UId, // Unique ID for the node
      prevNode: node6UId, // Previous node is First Message Node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node8UId, // Unique ID for the node
      prevNode: node7UId, // No previous node
    },
  ],
};

export const messageFirstRelationTemplate = {
  name: "Message First Relation",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Sales Navigator List",
        profileNumber: "100",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
    // First Message Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Message Sender",
        messageField: "#Language_English_#Prompt_MPGPTMSPrompt1",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId, // Previous node is Connection Node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    },
  ],
};

export const invitationPlusMessagesTemplate = {
  name: "Invitation + Message",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Sales Navigator List",
        profileNumber: "100",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Connection Request",
        messageField: "#Language_English_#Prompt_MPGPTCRPrompt1",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId,
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    },
    // First Message Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Message Sender",
        messageField: "#Language_English_#Prompt_MPGPTMSPrompt1",
      },
      id: node5UId, // Unique ID for the node
      prevNode: node4UId, // Previous node is Connection Node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node6UId, // Unique ID for the node
      prevNode: node5UId, // No previous node
    },
  ],
};

export const visitOnlyTemplate = {
  name: "Visit",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Sales Navigator List",
        profileNumber: "100",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
    // First Message Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Auto Visit",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId, // Previous node is Connection Node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    },
  ],
};

export const myContacts = {
  name: "My Contacts",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "other",
      content: {
        value: "My Contacts",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
  ],
};

export const myVisitedWebsite = {
  name: "Visited Website",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Visited Website",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
    {
      choosenFunction: "linkedin",
      content: {
        value: "Prospect on Linkedin",
      },
      id: node3UId, // Unique ID for the node
      prevNode: node2UId, // No previous node
    },
    {
      choosenFunction: "timer",
      content: {
        value: "Delay",
        delayUnit: {
          value: "Days",
          label: "Days",
        },
        delayValue: "2",
      },
      id: node4UId, // Unique ID for the node
      prevNode: node3UId, // No previous node
    },
  ],
};

export const myLinkedinCommenters = {
  name: "Linkedin Post Commenters",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Post Commenters",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
  ],
};

export const myLinkedinLikes = {
  name: "Linkedin Post Likes",
  tag: "",
  id: null,
  flowchart: [
    // LinkedIn Sales Navigator List Node
    {
      choosenFunction: "linkedin",
      content: {
        value: "Linkedin Post Likes",
      },
      id: node1UId, // Unique ID for the node
      prevNode: null, // No previous node
    },
    {
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
    },
  ],
};

// export const preBuiltTemplateList = {
//   "Invitation + 2 Messages": invitationPlus2MessagesTemplate,
//   "Message First Relation": invitationPlus2MessagesTemplate,
//   "Invitation + Message": invitationPlus2MessagesTemplate,
//   Visit: invitationPlus2MessagesTemplate,
//   "My Contacts": invitationPlus2MessagesTemplate,
// };

export const preBuiltTemplateList = [
  invitationPlus2MessagesTemplate,
  messageFirstRelationTemplate,
  invitationPlusMessagesTemplate,
  visitOnlyTemplate,
  myContacts,
  myVisitedWebsite,
  myLinkedinCommenters,
  myLinkedinLikes,
];
