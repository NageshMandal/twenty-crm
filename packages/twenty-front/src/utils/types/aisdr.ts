import { IMessage } from "./personalization";

export interface IWorkflow {
  connection_request_count?: string;
  copied_from_template: boolean;
  created_at: string;
  ecosystem_event_daily_limit_reached?: string;
  ecosystem_event_id?: string;
  ecosystem_event_last_ran_at?: string;
  ecosystem_event_name?: string;
  ecosystem_event_run_till?: string;
  ecosystem_event_type?: string;
  ended_at?: string;
  es_scroll_time_pointer?: string;
  executed_at?: string;
  failed_times?: string;
  hubspot_export_company_count: number;
  hubspot_export_prospect_count: number;
  id: number;
  is_fav: number;
  manual_prospect_count: number;
  message_request_count?: string;
  name: string;
  node_count: number;
  pipedrive_export_company_count: number;
  pipedrive_export_prospect_count: number;
  sn_denied: null;
  social_selling_count: number;
  status: string;
  step_count: number;
  tag?: string;
  team_id: number;
  updated_at: string;
  user_id: number;
  log?: string;
  leads_count?: string;
  cat?: string;
  today_comments?: string;
  today_posts?: string;
  total_comments?: string;
  total_posts?: string;
  remaining_comment_count?: string;
  last_ss_run?: string;
  automated?: boolean;
}

export interface IProspect {
  company: string;
  company_name: string;
  company_url: string;
  created_at: string;
  domain: string;
  id: number;
  profile_url: string;
  prospect_id: number;
  technology_count: number;
  visitor_count: number;
  workflow_id: number;
  messages: IMessage[];
  profile: {
    about: string;
    fullname: string;
    location: string;
    login_user: string;
    profile_image_url: string;
    title: string;
  };
}

export interface ICommentsInfo {
  comment_id: number;
  message: string;
  name: string;
  node_id: string;
  parent_node_id: string;
  post_id: number;
  prospect_id: string;
  step_id: number;
  type: string;
}

export interface ICommentRequest {
  wid: string;
  pid?: number;
  sid?: number;
  cid?: number;
  message?: string;
  postId?: number;
  promptId?: number;
  langId?: number;
  toAuto?: any;
  toAutoId?: any;
}

export interface IContent {
  comment?: string;
  language?: string;
  tone?: string;
  to_auto?: any;
  to_auto_id?: any;
  value?: string;
  searchURL?: string;
  limit?: number;
  profiles?: string;
  profileNumber?: number;
  numberOfMembers?: number;
  from_page?: number;
  link?: string;
  cookie?: string;
  post_urls?: {
    post_url?: string;
    comment?: string;
  }[];
}

export interface IFlowChart {
  choosenFunction: string;
  content: IContent;
  id: string;
  prevNode?: any;
}

export interface IWorkflowTemplate {
  id: number;
  name: string;
  tag: string;
  flowchart: IFlowChart[];
  data: any;
  status: string;
}
