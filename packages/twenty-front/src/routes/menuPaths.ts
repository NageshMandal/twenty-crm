import { IMenuList } from "../utils/types";

export const menuPaths: IMenuList[] = [
  {
    menuItems: [
      {
        icon: "Automation",
        label: "Automations",
        link: "/automation",
      },
      // {
      //   icon: "Dashboard",
      //   label: "Dashboard",
      //   link: "/dashboard",
      // },
      {
        icon: "Users",
        label: "Visitors",
        link: "/visitor",
      },
      {
        icon: "Lead",
        label: "Leads",
        link: "/lead",
      },
      {
        icon: "LogoBuilder",
        label: "AI SDR Setup",
        link: "/setup-aisdr",
      },
    ],
  },
  {
    title: "OUTBOUND FLOWS",
    menuItems: [
      {
        icon: "Chip",
        label: "1-1 Automations",
        link: "/1-1-automation",
      },
      {
        icon: "Selling",
        label: "Social Selling",
        link: "/social-selling",
      },
      {
        icon: "LogoBuilder",
        label: "AI SDR",
        link: "/aisdr",
      },
      {
        icon: "Inbox",
        label: "Unified Inbox",
        link: "/inbox",
      },
    ],
  },
  {
    title: "SETTINGS",
    menuItems: [
      {
        icon: "Setting",
        label: "Settings",
        link: "/setting",
      },
      {
        icon: "Users",
        label: "Integration",
        link: "/integration",
      },
      {
        icon: "Envelop",
        label: "MailBoxes",
        link: "/mailboxes",
      },
      {
        icon: "Linkedin",
        label: "Linkedin",
        link: "/linkedin",
      },
      {
        icon: "Team",
        label: "Team",
        link: "/team",
      },
      {
        icon: "Question",
        label: "Knowledge Base",
        link: "/knowledge-base",
      },
    ],
  },
];
