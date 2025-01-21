// AutomationMenu.ts

export interface Submenu {
  name: string;
  icon?: string;
  submenus?: (Submenu | MenuOption)[];
}

export interface MenuOption {
  name: string;
  submenus: Submenu[];
}

export interface AutomationMenu {
  // options: MenuOption[];
  options: (MenuOption & { icon?: string })[];
}

export const commonLinkedinSubmenus: Submenu[] = [
  // { name: "Delay" },
  { name: "1-1", icon: "LogoBuilder" },
  { name: "Automated AI", icon: "LogoBuilder" },
  { name: "Find Sales Navigator LinkedIn Url", icon: "LinkedinCircle" },
  { name: "Linkedin Connection Request", icon: "LinkedinCircle" },
  { name: "Linkedin Message Sender", icon: "LinkedinCircle" },
  { name: "Linkedin Withdrawal Requester", icon: "LinkedinCircle" },
  // { name: "Linkedin Profile Screenshot", icon: "LinkedinCircle" },
  { name: "Linkedin When Connected", icon: "LinkedinCircle" },
  // { name: "Linkedin Auto Endorse", icon: "LinkedinCircle" },
  { name: "Linkedin Auto Visit", icon: "LinkedinCircle" },
  { name: "Prospect on Linkedin", icon: "LinkedinCircle" },
  { name: "Send Mail", icon: "MessageBox" },
  { name: "AI SDR", icon: "LogoBuilder" },
  { name: "AI SDR Linkedin", icon: "LogoBuilder" },
  // { name: "AISDR Linkedin", icon: "LogoBuilder" },
  // { name: "AISDR Mail", icon: "LogoBuilder" },
  // {
  //   name: "Email Template",
  //   icon: "MessageBox",
  //   submenus: [{ name: "Loading", icon: "MessageBox" }],
  // },
];

export const automationMenu: AutomationMenu = {
  options: [
    {
      name: "Linkedin Sales Navigator Search Extractor",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "Linkedin Search Extractor",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "Linkedin Group Extractor",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "Linkedin Sales Navigator List",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    // {
    //   name: "Prospect on Linkedin",
    //   icon: "LinkedinCircle",
    //   submenus: [...commonLinkedinSubmenus],
    // },
    {
      name: "Linkedin Post Likes",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "Linkedin Post Commenters",
      icon: "LinkedinCircle",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "My Contacts",
      icon: "People",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "My Companies",
      icon: "Industry",
      submenus: [...commonLinkedinSubmenus],
    },
    {
      name: "Visited Website",
      icon: "Visitor",
      submenus: [...commonLinkedinSubmenus],
    },

    // Add more top-level options as needed
  ],
};
