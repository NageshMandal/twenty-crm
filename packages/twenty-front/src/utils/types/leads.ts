export interface IProspectReq {
  limit: number;
  offset: number;
  order: string;
  query: string;
  sort: string;
}

export interface IOverview {
  auto_emails: {
    bounced: number;
    clicked: number;
    count: number;
    forwarded: number;
    opened: number;
    replied: number;
  };
  calls: {
    count: number;
    negative: number;
    neutral: number;
    positive: number;
  };
  customs: {
    cancelled: number;
    completed: number;
    count: number;
    expired: number;
    waiting: number;
  };
  linkedin: {
    connections: 1;
    messages: number;
  };
  manual_emails: {
    cancelled: number;
    completed: number;
    count: number;
    expired: number;
    waiting: number;
  };
}

export interface IProspect {
  activities?: string[];
  company: { domain: string; name: string; position: string; company_logo?: string };
  created_at: string;
  custom_field_1?: string;
  custom_field_2?: string;
  custom_field_3?: string;
  data_tracking_id?: string;
  domain?: string;
  email_search_in_progress: boolean;
  first_name: string;
  last_name: string;
  gender?: string;
  id: string;
  image_url?: string;
  industry?: string;
  emails: {
    email: string;
    is_verified: boolean;
  }[];
  locations: {
    address_string: string;
    city?: string;
    country?: string;
    postal_code?: string;
    state?: string;
    street?: string;
    street_number?: string;
  }[];
  name: string;
  phones: { phone: string }[];
  relations: {
    company?: string;
  };
  social_profiles: {
    image_url: string;
    network_type: number;
    url: string;
  }[];
  type: string;
  source_id?: string;
  source_type: string;
  stage: string;
  status: number;
  tags: string[];
  team_id: number;
  timezone?: string;
  updated_at: string;
  user_id: number;
  overview?: IOverview;
}

export interface IActivity {
  created: string;
  text: string;
  type: number;
  user: {
    [key: string]: string;
  };
  x: {
    [key: string]: string;
  };
}

export interface IAutomationActivity {
  action: string;
  created_at: string;
  data: string;
  id: number;
  prospect_id: string;
  relation_id: null;
  request_id: string;
  status: string;
  team_id: number;
  updated_at: string;
  user_id: number;
  workflow_id: number;
  workflow_name: string;
}

export interface IActivityData {
  action_type: string;
  cookie: string;
  message: string;
  request_uuid: string;
  step_id: string;
  team_id: number;
  user_id: number;
  relationship: number;
  proficiency: string;
  workflow_id: string;
  subject: string;
  profile_urls: string[];
  profiles: {
    company_name: string;
    domain: string;
    email: string;
    first_name: string;
    last_name: string;
    location: string;
    name: string;
    profile_url: string;
    prospect_id: string;
    title: string;
  };
  prospect_ids: string[];
}

export interface ISortedAutomationActivity {
  action: string;
  created_at: string;
  id: number;
  prospect_id: string;
  relation_id?: string;
  request_id: string;
  status: string;
  team_id: number;
  updated_at: string;
  user_id: number;
  workflow_id: number;
  workflow_name: string;
  data: IActivityData;
}

export interface IReqLead {
  all: boolean;
  wid?: string;
  ids: string[];
  query: string;
}

export interface IResAddAutomation {
  added: number;
  existing: string[];
  status: string;
}

export interface ITemplate {
  columns: string[];
  file_type: number;
  created_at: string;
  object_type: number;
  sort: string;
  id: number;
  position: number;
  title: string;
  updated_at: string;
  user_id: number;
  name: string;
  labels: string[];
}

export interface IStringObject {
  [key: string]: string;
}

export interface ITempSettingRes {
  file_types: IStringObject;
  fields: {
    company: IStringObject;
    prospect: IStringObject;
    view: IStringObject;
  };
}

export interface IExportCSV {
  columns: string[];
  file_type: number;
  filter: {
    all: boolean;
    ids: string[];
    query: string;
  };
  object_type: number;
  optional_name?: string;
}

export interface ILeadTag {
  [x: string]: any;
  color: string;
  created_at: string;
  id: number;
  name: string;
  team_id: number;
  updated_at: string;
}

export interface ITechnology {
  category_key: string;
  image_url: string;
  key: string;
  name: string;
  subcategory_key: string;
}

export interface ISubCategory {
  category_key: string;
  key: string;
  name: string;
  technologies: ITechnology[];
}

export interface ICategory {
  key: string;
  name: string;
  sub_categories: ISubCategory[];
}

export type ITechAll = ISubCategory | ICategory | ITechnology;

export interface ILocation {
  country: string;
  display_name: string;
  relations: [];
  weight: number;
}

export interface IStage {
  created_at: string;
  deleted_at: string;
  field_type: number;
  id: number;
  order: number;
  team_id: number;
  updated_at: string;
  value: string;
}

export interface ICustomSearch {
  q: string;
  types: string[];
  dataTrackingId?: string;
}
