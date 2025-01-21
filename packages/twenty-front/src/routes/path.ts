export const paths = {
  auth: {
    login: "/auth/login",
    forgotPass: "/auth/forgot-pass",
    restorePass: "/auth/restore-pass",
    singUp: "/auth/signup",
    createAccount: "/auth/create-account",
  },
  main: {
    automation: {
      index: "/automation",
      create: "/automation/create",
    },
    dashboard: {
      index: "/dashboard",
    },
    lead: {
      index: "/lead",
      detail: "/lead/:leadId",
    },
    personalization: {
      index: "/1-1-automation",
      detail: "/1-1-automation/:wid",
    },
    socialSelling: {
      index: "/social-selling",
      detail: "/social-selling/:wid",
    },
    aiSdr: {
      index: "/aisdr",
      detail: "/aisdr/:wid",
    },
    inbox: {
      index: "/inbox",
    },
    setting: {
      index: "/setting",
    },
    integration: {
      index: "/integration",
      detail: "/integration/:integrationId",
    },
    team: {
      index: "/team",
    },
    demand: {
      index: "/demand",
    },
    knowledge: {
      index: "/knowledge-base",
    },
    linkedin: {
      index: "/linkedin",
    },
    visitor: {
      index: "/visitor",
    },
    template: {
      index: "/template",
    },
  },
};
