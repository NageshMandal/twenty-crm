export const autoEmailList: {
  label: string;
  value: "opened" | "replied" | "clicked" | "forwarded" | "bounced";
}[] = [
  {
    label: "Opened",
    value: "opened",
  },
  {
    label: "Replied",
    value: "replied",
  },
  {
    label: "Clicked by link",
    value: "clicked",
  },
  {
    label: "Forwarded",
    value: "forwarded",
  },
  {
    label: "Bounced",
    value: "bounced",
  },
];

export const manualEmailList: {
  label: string;
  value: "completed" | "waiting" | "cancelled" | "expired";
}[] = [
  {
    label: "Сompleted",
    value: "completed",
  },
  {
    label: "Waiting",
    value: "waiting",
  },
  {
    label: "Expired",
    value: "expired",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export const customList: {
  label: string;
  value: "completed" | "waiting" | "cancelled" | "expired";
}[] = [
  {
    label: "Сompleted",
    value: "completed",
  },
  {
    label: "Waiting",
    value: "waiting",
  },
  {
    label: "Expired",
    value: "expired",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export const linkedInList: {
  label: string;
  value: "messages" | "connections";
}[] = [
  {
    label: "Messages",
    value: "messages",
  },
  {
    label: "Connections",
    value: "connections",
  },
];

export const objectTypes = {
  PROSPECTS: "prospects",
  COMPANIES: "companies",
  INBOUNDS: "inbounds",
};

export const OBJECT_TYPES = {
  [objectTypes.PROSPECTS]: 1,
  [objectTypes.COMPANIES]: 2,
  [objectTypes.INBOUNDS]: 11,
};

export const SINGLE_MAP = {
  [objectTypes.PROSPECTS]: "prospect",
  [objectTypes.COMPANIES]: "company",
  [objectTypes.INBOUNDS]: "view",
};

export const CSV_FILE_TYPE = 1;
