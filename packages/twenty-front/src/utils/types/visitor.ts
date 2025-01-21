export interface IVisitorSession {
  query: any;
  location: string;
  referrer: string;
  source: any;
  source_1: any;
  source_2: any;
  source_type: string;
  tracking_id: string;
  utm_term: number;
  visited_from_hq: boolean;
  created_at: string;
  ip: string;
  pages: {
    time: number;
    title: string;
    url: string;
  }[];
}

export interface IVisitor {
  city: string;
  country: string;
  internet_service_provider: number;
  time: number;
  tracking_id: string;
  user_agent: string;
  sessions: IVisitorSession[];
}

export interface ICompanyVisitor {
  alerts_matched: any[];
  company: {
    domain: string;
    employees_count: any;
    employees_range: any;
    funding: any;
    id: string;
    image_url: string;
    industry: any;
    name: string;
    locations: {
      city: string;
      country: string;
      display_name: string;
    }[];
    ranks: any[];
    tech: any[];
  };
  company_id: null;
  company_uuid: string;
  created_at: string;
  first_visit: string;
  id: string;
  last_visit: string;
  pages_viewed: number;
  prospects_count: number;
  team_id: number;
  time: number;
  times_visited: number;
  updated_at: string;
  user_id: number;
  visit_score: number;
  prospectors_matched: any[];
  relations: any[];
  visitors: IVisitor[];
}

export interface ICompanyProspect {
  companies: {
    revenue: number;
    type: any;
    website: string;
    year_established: number;
    domain: string;
    employees_range: string;
    id: string;
    industry: string;
    department: any[];
    location: any[];
    phones: {
      number: string;
    }[];
    rank: any[];
    social_profiles: any[];
    tech: {
      added_at: string;
      category: string;
      category_key: string;
      image_url: string;
      key: string;
      last_detected_at: string;
      name: string;
      subcategory: string;
      subcategory_key: string;
    }[];
  }[];
  data_tracking_id: string;
  domain: any;
  first_name: string;
  gender: any;
  id: string;
  image_url: any;
  industry: any;
  is_duplicate: boolean;
  last_name: string;
  name: string;
  position: any;
  status: number;
  emails: {
    email: string;
    is_verified: boolean;
  };
  locations: {
    city: string;
    country: string;
    county: string;
    display_name: string;
    region: string;
    state: string;
    street: string;
  };
  phones: any[];
  relations: any[];
  social_profiles: any[];
  tracking_ids: any[];
}

export interface IPeopleVisitor {
  cities_visits_arrived_from: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  company: {
    departments: any[];
    description: string;
    domain: string;
    employees_count: any;
    employees_range: string;
    function: string;
    funding_amount: string;
    id: string;
    im: any[];
    image_url: string;
    industry: string;
    locations: {
      city: string;
      country: string;
      display_name: string;
    };
    name: string;
    person_count: any;
    phones: any[];
    position: string;
    ranks: any[];
    revenue: any;
    seniority_level: string;
    social_profiles: any[];
    tech: any[];
    tech_history: any[];
    type: any;
    website: any;
    year_established: any;
  };
  data_tracking_id: string;
  emails: {
    email: string;
    is_verified: boolean;
  }[];
  first_name: string;
  gender: any;
  id: string;
  is_duplicate: boolean;
  last_name: string;
  last_visit: string;
  name: string;
  locations: {
    city: string;
    country: string;
    display_name: string;
  };
  phone: any[];
  relation: any[];
  sessions: IVisitorSession[];
}

export interface IVisitorAccount {
  token: "5a97071a-8c4a-4462-916f-fc8df1ae91e4";
  updated_at: "2023-11-08 14:33:04";
  user_id: 5;
  is_active: 1;
  is_master_account: 1;
  id: 2;
  origins: string[];
  account_id: 1;
  account_type: "voogy";
  created_at: "2018-08-09 19:10:22";
  deleted_at: null;
  includes: any[];
  excludes: {
    domains: string[];
    pages: string[];
    ips: string[];
  };
}

export interface IEmailDeveloper {
  email: string;
  subject: string;
  body: string;
}

export interface ICompanyInsight {
  totalCompany: number;
  companyPerDay: number;
  countryInfo: {
    country: string;
    percent: number;
  }[];
  industryInfo: {
    industry: string;
    percent: number;
  }[];
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

export interface IReqVisitor {
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
