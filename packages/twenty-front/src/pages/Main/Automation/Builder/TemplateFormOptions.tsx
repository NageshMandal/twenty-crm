import { title } from "process";

export const delayUnit = [
  { value: "Minutes", label: "Minutes" },
  { value: "Hours", label: "Hours" },
  { value: "Days", label: "Days" },
];
export const mailUnit = [];
export const delayItemArray = [
  {
    title: "Delay Duration",
    tip: "",
    placeholder: "Input URL",
    selectId: "delayUnit",
    selectOptions: delayUnit,
  },
  {
    title: "Delay Value",
    tip: "",
    placeholder: "Enter Value",
    inputId: "delayValue",
    type: "number",
  },
];
export const messageSenderItemArray = [
  {
    title: "Embed Image URL",
    tip: "(Optional)",
    placeholder: "Input URL",
    inputId: "imageUrl",
    type: "text",
  },
];
export const withdrawalRequesterItemArray = [
  {
    title: "How Many to Withdraw",
    tip: "",
    placeholder: "Input how many to withdraw",
    inputId: "withdrawal",
    type: "number",
  },
];
export const salesNavigatorItemArray = [
  {
    title: "SEARCH URL",
    tip: "(From Linkedin)",
    placeholder: "Input URL",
    inputId: "searchURL",
    type: "text",
  },
  {
    title: "Number of Profiles to download",
    tip: "(max 2,500)",
    placeholder: "Input profile number",
    inputId: "profileNumber",
    type: "number",
  },
];
export const commentsUsageArray = [
  { label: "Most recent", value: "Most recent" },
  { label: "Most relevant", value: "Most relevant" },
];
export const commentsItemArray = [
  {
    title: "Link",
    tip: "(From Linkedin)",
    placeholder: "Input Link",
    inputId: "link",
    type: "text",
  },
  {
    title: "Number of Members",
    tip: "(max 2,500)",
    placeholder: "Input Number of Members",
    inputId: "numberOfMembers",
    type: "number",
  },
  {
    title: "Commenters Usage",
    tip: "(Optional)",
    placeholder: "Input Commenters Usage",
    selectId: "commentersUsage",
    selectOptions: commentsUsageArray,
  },
];
export const likedPostsUsageArray = [
  { label: "ALL", value: "ALL" },
  { label: "LIKE", value: "LIKE" },
  { label: "PRAISE", value: "PRAISE" },
  { label: "EMPATHY", value: "EMPATHY" },
  { label: "APPRECIATION", value: "APPRECIATION" },
  { label: "ENTERTAINMENT", value: "ENTERTAINMENT" },
  { label: "INTEREST", value: "INTEREST" },
];
export const likedPostsItemArray = [
  {
    title: "Link",
    tip: "(Post Link From Linkedin)",
    placeholder: "Input Link",
    inputId: "link",
    type: "text",
  },
  {
    title: "Number of Members",
    tip: "(max 2,500)",
    placeholder: "Input Number of Members",
    inputId: "numberOfMembers",
    type: "number",
  },
  {
    title: "Post Likes Usage",
    tip: "(Optional)",
    placeholder: "Input Post Likes Usage",
    selectId: "reactionType",
    selectOptions: likedPostsUsageArray,
  },
];
export const autoEndorseArray = [
  {
    title: "Proficiency",
    tip: "",
    placeholder: "Input Proficiency",
    inputId: "proficiency",
    type: "text",
  },
  {
    title: "Relationship",
    tip: "",
    placeholder: "Input Relationship",
    inputId: "relationship",
    type: "text",
  },
];
export const searchExtractorItemArray = [
  { title: "Link", tip: "", placeholder: "Input Link", inputId: "link", type: "text" },
  {
    title: "Number of Profiles to extract",
    tip: "(max 1,000)",
    placeholder: "Input number of profiles",
    inputId: "extractProfileNumber",
    type: "number",
  },
];
export const visitedWebsiteItemArray = [
  {
    title: "Complete Landing Page URL",
    tip: "(Optional)",
    placeholder: "Input URL",
    inputId: "websiteSearchURL",
    type: "text",
  },
  {
    title: "Location",
    tip: "(Optional)",
    placeholder: "Input Location",
    inputId: "location",
    type: "text",
  },
  {
    title: "Industry",
    tip: "(Optional)",
    placeholder: "Input Industry",
    inputId: "industry",
    type: "text",
  },
  {
    title: "Company Size",
    tip: "(Optional)",
    placeholder: "Input Company Size",
    inputId: "companySize",
    type: "text",
  },
  {
    title: "Technology Usage",
    tip: "(Optional)",
    placeholder: "Input Technology Usage",
    inputId: "technologyUsage",
    type: "text",
  },
];
export const mailItemArray = [
  {
    title: "Choose Mailbox",
    tip: "",
    selectId: "mailboxId",
    selectOptions: mailUnit,
  },
];
export const connectionRequestVariables = [
  // { value: "#AI_connection_request", label: "AI Connection Request" },
  // { value: "#AI_linkedIn_msg1", label: "AI LinkedIn Msg1" },
  // { value: "#AI_german_connection_request", label: "AI Connection Request German" },
  // { value: "#AI_german_linkedIn_msg1", label: "AI LinkedIn Msg1 German" },
  // { value: "#AI_spanish_connection_request", label: "AI Connection Request Spanish" },
  // { value: "#AI_spanish_linkedIn_msg1", label: "AI LinkedIn Msg1 Spanish" },
  // { value: "#AI_french_connection_request", label: "AI Connection Request French" },
  // { value: "#AI_french_linkedIn_msg1", label: "AI LinkedIn Msg1 French" },
  // { value: "#AI_portugese_connection_request", label: "AI Connection Request Portugese" },
  // { value: "#AI_portugese_linkedIn_msg1", label: "AI LinkedIn Msg1 Portugese" },

  // { value: "#AI_italian_connection_request", label: "AI Connection Request Italian" },
  // { value: "#AI_italian_linkedIn_msg1", label: "AI LinkedIn Msg1 Italian" },

  // { value: "#AI_hebrew_connection_request", label: "AI Connection Request Hebrew" },
  // { value: "#AI_hebrew_linkedIn_msg1", label: "AI LinkedIn Msg1 Hebrew" },

  // { value: "#AI_arabic_connection_request", label: "AI Connection Request Arabic" },
  // { value: "#AI_arabic_linkedIn_msg1", label: "AI LinkedIn Msg1 Arabic" },

  // { value: "#AI_dutch_connection_request", label: "AI Connection Request Dutch" },
  // { value: "#AI_dutch_linkedIn_msg1", label: "AI LinkedIn Msg1 Dutch" },

  // { value: "#AI_danish_connection_request", label: "AI Connection Request Danish" },
  // { value: "#AI_danish_linkedIn_msg1", label: "AI LinkedIn Msg1 Danish" },

  // { value: "#AI_swedish_connection_request", label: "AI Connection Request Swedish" },
  // { value: "#AI_swedish_linkedIn_msg1", label: "AI LinkedIn Msg1 Swedish" },

  // { value: "#AI_norwegian_connection_request", label: "AI Connection Request Norwegian" },
  // { value: "#AI_norwegian_linkedIn_msg1", label: "AI LinkedIn Msg1 Norwegian" },

  // {
  //   value: "#AI_britishenglish_connection_request",
  //   label: "AI Connection Request British English",
  // },
  // { value: "#AI_britishenglish_linkedIn_msg1", label: "AI LinkedIn Msg1 British English" },

  { value: "#icebreaker", label: "Icebreaker" },
  { value: "#name", label: "Name" },
  { value: "#first_name", label: "First Name" },
  { value: "#last_name", label: "Last Name" },
  { value: "#title", label: "Title" },
  { value: "#company_name", label: "Company Name" },
  { value: "#email", label: "Email" },
  { value: "#location", label: "Location" },
  { value: "#on_1_business_days_from_now", label: "On 1 business days from now" },
  { value: "#on_2_business_days_from_now", label: "On 2 business days from now" },
  { value: "#on_3_business_days_from_now", label: "On 3 business days from now" },
  { value: "#on_4_business_days_from_now", label: "On 4 business days from now" },
  { value: "#on_5_business_days_from_now", label: "On 5 business days from now" },
  { value: "#domain", label: "Domain" },
  { value: "#custom_field_1", label: "Custom Field 1" },
  { value: "#custom_field_2", label: "Custom Field 2" },
  { value: "#custom_field_3", label: "Custom Field 3" },
];
export const aiSdrVariables = [
  { value: "0", label: "Book a meeting" },
  { value: "1", label: "Whitepaper" },
  { value: "2", label: "More Details" },
];
export const linkedinConnectionRequestArray = [
  {
    title: "Text of Message",
    tip: "",
    placeholder: "",
    selectId: "connectionMessageID",
    selectOptions: connectionRequestVariables,
    textAreaId: "messageField",
  },
  {
    title: "Embed Image URL",
    tip: "(Optional)",
    placeholder: "Input URL",
    inputId: "imageUrl",
    type: "text",
  },
  // { textAreaId: "messageField" },
];

export const aiSdrArray = [
  {
    title: "CTA",
    tip: "",
    placeholder: "",
    selectId: "aiSdrPitchCTAId",
    selectOptions: aiSdrVariables,
  },
  {
    title: "Pitch",
    tip: "",
    placeholder: "",
    textAreaId: "aiSdrField",
  },
  {
    title: "Additional Info",
    tip: "",
    placeholder: "",
    textAreaId: "aiSdrAdditionalInfoField",
  },
];

export const prospectOnLinkedinItemArray = [
  {
    title: "Company Name",
    tip: "",
    placeholder: "Input Company Name",
    inputId: "companyName",
    type: "text",
  },
  {
    title: "Job Title",
    tip: "",
    placeholder: "Input one or more Job Titles separated by commas",
    inputId: "jobTitle",
    type: "text",
  },
  {
    title: "Number of Members",
    tip: "(max 2,500)",
    placeholder: "Input Number of Members",
    inputId: "numberOfMembers",
    type: "text",
  },
  // {
  //   title: "Location",
  //   tip: "(Optional)",
  //   placeholder: "Input Location",
  //   inputId: "location",
  //   type: "text",
  // },
];
export const linkedinGroupExtractorItemArray = [
  {
    title: "Group URL",
    tip: "",
    placeholder: "Input Group URL",
    inputId: "groupUrl",
    type: "text",
  },
  {
    title: "Number of Members",
    tip: "(max 2,500)",
    placeholder: "Input Number of Members",
    inputId: "numberOfMembers",
    type: "text",
  },
];
export const extensionUrl =
  "https://chrome.google.com/webstore/detail/salestools-insight/hpdonlnaehfbmhaeajlppcfkngapiofj";
export const withdrawalRequesterInputs = [
  { label: "HOW MANY TO WITHDRAW", name: "withdrawal", placeholder: "Input how many to withdraw" },
];
export const visitedWebsiteInputs = [
  { label: "SEARCH URL", name: "websiteSearchURL", placeholder: "URL" },
  { label: "LOCATION", name: "location", placeholder: "Location" },
  { label: "INDUSTRY", name: "industry", placeholder: "Industry" },
  { label: "COMPANY SIZE", name: "companySize", placeholder: "Company Size" },
  { label: "TECHNOLOGY USAGE", name: "technologyUsage", placeholder: "Technology Usage" },
];
export const linkedinProspectorInputs = [
  { label: "COMPANY NAME", name: "companyName", placeholder: "Company Name" },
  { label: "JOB TITLE", name: "jobTitle", placeholder: "Job Title" },
  { label: "MEMBERS TO DOWNLOAD", name: "numberOfMembers", placeholder: "Number of Members" },
  { label: "TAG", name: "tag", placeholder: "Tag" },
  { label: "LOCATION", name: "location", placeholder: "Location" },
];
export const linkedinGroupExtractorInputs = [
  { label: "GROUP URL", name: "groupUrl", placeholder: "Group URL" },
  {
    label: "NUMBER OF MEMBERS",
    name: "numberOfMembers",
    placeholder: "Number of Members (max 2,500)",
  },
];
export const technologyInputs = [
  { label: "TECHNOLOGY NAME", name: "nameTechnology", placeholder: "Technology" },
  { label: "EMPLOYEES", name: "numberEmployees", placeholder: "Number employees" },
  { label: "INDUSTRY", name: "industry", placeholder: "Industry" },
  { label: "LOCATION", name: "location", placeholder: "Location" },
];
export const searchExtractorInputs = [
  { label: "LINK", name: "link", placeholder: "Link" },
  { label: "NUMBER OF PROFILES", name: "extractProfileNumber", placeholder: "1000" },
  { label: "TAG", name: "tag", placeholder: "" },
];
export const workflowAutomationsArray = [
  {
    title: "Linkedin Sales Navigator Search Extractor",
    info: "Extract result from search url on Linkedin sales navigator",
    choosenFunction: "linkedin",
    formOptions: salesNavigatorItemArray, //have same options
    icon: "LinkedinCircle",
  },
  {
    title: "AISDR Linkedin Sales Navigator Search Extractor",
    info: "Extract result from search url on Linkedin sales navigator",
    choosenFunction: "linkedin",
    formOptions: salesNavigatorItemArray, //have same options
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Search Extractor",
    info: "Extract result from search url on Linkedin Searches",
    choosenFunction: "linkedin",
    formOptions: searchExtractorItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Visited Website",
    info: "Prospect visitors by automation",
    choosenFunction: "linkedin",
  },
  {
    title: "Prospect on Linkedin",
    info: "Choose Job Title, Company Size etc needs Sales Navigator",
    choosenFunction: "linkedin",
    formOptions: prospectOnLinkedinItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Find Sales Navigator LinkedIn Url",
    info: "Used to find the linkedin URL of a sales navigator search typically used inside growth flows",
    choosenFunction: "linkedin",
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Group Extractor",
    info: "Input URL from group",
    choosenFunction: "linkedin",
    formOptions: linkedinGroupExtractorItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Connection Request",
    info: "Automatically connect to a list of Linkedin accounts",
    choosenFunction: "linkedin",
    formOptions: linkedinConnectionRequestArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Message Sender",
    info: "Automatically send messages to a list of  Linkedin connections",
    choosenFunction: "linkedin",
    formOptions: linkedinConnectionRequestArray,
    icon: "LinkedinCircle",
  },
  {
    title: "AI SDR",
    info: "Personalize your automation with an AI SDR",
    choosenFunction: "other",
    formOptions: aiSdrArray,
    icon: "LogoBuilder",
  },
  {
    title: "AI SDR Linkedin",
    info: "Personalize your automation with an AI SDR Linkedin",
    choosenFunction: "other",
    formOptions: aiSdrArray,
    icon: "LogoBuilder",
  },
  {
    title: "Delay",
    info: "Delay",
    choosenFunction: "timer",
    formOptions: delayItemArray,
  },
  {
    // title: "LinkedIn auto withdraw connection request",
    title: "Linkedin Withdrawal Requester",
    info: "Auto withdraw connection request on LinkedIn",
    choosenFunction: "linkedin",
  },
  {
    title: "Linkedin Sales Navigator List",
    info: "Extract a saved list from Linkedin Sales Navigator",
    choosenFunction: "linkedin",
    formOptions: salesNavigatorItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Post Commenters",
    info: "Download each person that commented on a Linkedin Post",
    choosenFunction: "linkedin",
    formOptions: commentsItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Post Likes",
    info: "Download each person that Liked a Linkedin Post",
    choosenFunction: "linkedin",
    formOptions: likedPostsItemArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Auto Endorse",
    info: "Need a Linkedin Search Starting point, as the first step",
    choosenFunction: "linkedin",
    formOptions: autoEndorseArray,
    icon: "LinkedinCircle",
  },
  {
    title: "Linkedin Auto Visit",
    info: "Need a Linkedin Search Starting point, as the first step",
    choosenFunction: "linkedin",
    icon: "LinkedinCircle",
  },
  {
    title: "My Contacts",
    info: "Start an automation from My Contacts at anytime you like, this is the starting point for an automation taking place from my Contacts.",
    choosenFunction: "other",
    icon: "People",
  },
  {
    title: "My Companies",
    info: "Start an automation from My Companies at anytime you like, this is the starting point for an automation taking place from my Companies.",
    choosenFunction: "other",
    icon: "Industry",
  },
  {
    title: "1-1",
    choosenFunction: "other",
    icon: "LogoBuilder",
  },
  {
    title: "Automated AI",
    choosenFunction: "other",
    icon: "LogoBuilder",
  },
  {
    title: "Email Template",
    choosenFunction: "mail",
    formOptions: delayItemArray,
  },
  {
    title: "Send Mail",
    choosenFunction: "mail",
    formOptions: mailItemArray,
  },
  {
    title: "AISDR Types and Signals",
    choosenFunction: "other",
  },
  {
    title: "AISDR Linkedin",
    choosenFunction: "other",
  },
  {
    title: "AISDR Mail",
    choosenFunction: "other",
  },
];

export const autoStopOptions = [
  { value: "linkedin", label: "Remove prospect on Linkedin reply" },
  { value: "email", label: "Remove prospect on email reply" },
  { value: "bothCounts", label: "Remove prospect on Linkedin or email reply" },
  { value: "nothing", label: "Nothing" },
];

export const scheduleRoot = [
  { value: "", label: "No Schedule" },
  { value: 6112, label: "Uk Time" },
];

export const emailTemplateVariables = [
  { value: "#icebreaker", label: "Icebreaker" },
  { value: "#name", label: "Name" },
  { value: "#first_name", label: "First Name" },
  { value: "#last_name", label: "Last Name" },
  { value: "#title", label: "Title" },
  { value: "#company", label: "Company Name" },
  { value: "#email", label: "Email" },
  { value: "#location", label: "Location" },
  { value: "#on_1_business_days_from_now", label: "On 1 business days from now" },
  { value: "#on_2_business_days_from_now", label: "On 2 business days from now" },
  { value: "#on_3_business_days_from_now", label: "On 3 business days from now" },
  { value: "#on_4_business_days_from_now", label: "On 4 business days from now" },
  { value: "#on_5_business_days_from_now", label: "On 5 business days from now" },
  { value: "#domain", label: "Domain" },
  { value: "#custom_field_1", label: "Custom Field 1" },
  { value: "#custom_field_2", label: "Custom Field 2" },
  { value: "#custom_field_3", label: "Custom Field 3" },
];
