export interface IThread {
  company_name: string;
  created_at: string;
  first_prospected_at: string;
  id: number;
  is_dismissed: number;
  is_enrollable: boolean;
  is_snoozed: boolean;
  last_calculated_msgs_count: number;
  li_profile_img_url: string;
  li_profile_url: string;
  message_last: string;
  message_type: string;
  prospect_id: string;
  received_last_at: string;
  snoozed_till: any;
  source_type: string;
  st_profile_url: string;
  tag: string;
  team_id: number;
  thread_url: string;
  updated_at: string;
  user_id: number;
  user_name: string;
  workflow_id: number;
  workflow_name: string;
}

export interface IResThreads {
  current_page: number;
  data: IThread[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null | string;
  to: number;
  total: number;
}

export interface IInboxMessage {
  created_at: string;
  event_at: string;
  id: number;
  is_owner: number;
  is_replied_confirmed: null | boolean;
  is_reply: number;
  message: string;
  order: number;
  team_id: number;
  type: string;
  updated_at: string;
  user_id: number;
  workflow_id: number;
  workflows_combined_inbox_id: number;
  preparedReply?: string;
}

export interface IPaymentIntent {
  amount: number;
  created_at: number;
  currency_code: string;
  expires_at: number;
  gateway: string;
  gateway_account_id: number;
  id: number;
  modified_at: number;
  object: string;
  payment_method_type: string;
  status: string;
}
