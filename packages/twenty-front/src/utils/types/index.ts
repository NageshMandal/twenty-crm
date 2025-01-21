import { IconType } from "../../components/base/Icon";

export interface IMenuItem {
  icon: IconType;
  label: string;
  link: string;
}

export interface ISelectOption {
  id?: string | undefined;
  icon?: IconType;
  label: string | number;
  name?: string;
  value: any;
  submenus?: ISelectOption[];
  code?: any;
}

export interface IMenuList {
  title?: string;
  menuItems: IMenuItem[];
}

export interface IPlan {
  id: string;
  name: string;
  description: string;
  default_price: string;
  features: string;
  prices: any;
}

export interface IPlanBkp {
  id: string;
  name: string;
  invoice_name: string;
  price: string;
  period: number;
  period_unit: "daily" | "month" | "quarterly" | "semiannual" | "yearly";
  trial_period: number;
  trial_period_unit: string;
  trial_end_action: string;
  pricing_model: string;
  free_quantity: number;
  status: string;
  enabled_in_hosted_pages: boolean;
  enabled_in_portal: boolean;
  addon_applicability: string;
  is_shippable: boolean;
  updated_at: number;
  giftable: boolean;
  resource_version: number;
  object: string;
  charge_model: string;
  taxable: boolean;
  currency_code: string;
  cf_platform: string;
  cf_credit_limit: string;
  cf_set_units_for: string;
  show_description_in_invoices: boolean;
  show_description_in_quotes: boolean;
  channel: string;
  attached_addons: {
    id: string;
    db_plan_id: number;
    title: string;
    tiers: {
      starting_unit: string;
      ending_unit: number;
      price: string;
    }[];
  }[];
}

export interface IShortedPlan {
  daily: IPlan[];
  month: IPlan[];
  quarterly: IPlan[];
  semiannual: IPlan[];
  yearly: IPlan[];
  year: IPlan[];
}

export interface IShortedPlanBkp {
  daily: IPlanBkp[];
  month: IPlanBkp[];
  quarterly: IPlanBkp[];
  semiannual: IPlanBkp[];
  yearly: IPlanBkp[];
  year: IPlanBkp[];
}

export interface ICurrencyAndCountry {
  country: string;
  currency: string;
}

export type TPlanCycle = "daily" | "month" | "quarterly" | "semiannual" | "yearly";

export interface ICycle {
  value: "daily" | "month" | "quarterly" | "semiannual" | "yearly";
  title: string;
}

export interface ICycleTypeList {
  DAILY: "daily";
  MONTHLY: "month";
  QUARTERLY: "quarterly";
  SEMIANNUAL: "semiannual";
  YEARLY: "yearly";
}

export interface ICard {
  billing_id: number;
  created_at: string;
  deleted_at?: string;
  exp_month: number;
  exp_year: number;
  id: number;
  last_four: string;
  main: number;
  status: number;
  updated_at: string;
}

export interface IManager {
  acquire_status: number;
  avatar?: string;
  child_cname?: string;
  cname?: string;
  color: string;
  company: string;
  country: string;
  created_at: string;
  current_account_id: number;
  email: string;
  first_name: string;
  full_name: string;
  has_coupon: number;
  has_coupon_migrated: number;
  has_team_migrated: number;
  has_whitelabel_payment: number;
  id: number;
  industry: string;
  is_installed: number;
  is_payment: number;
  is_trial_user?: string;
  job_title: string;
  last_login_ip: string;
  last_name: string;
  number_of_mailboxes: number;
  payment_intent_id?: string;
  phone: string;
  role: number;
  site_logo?: string;
  site_name: string;
  status?: number;
  storage_type: string;
  team_id: number;
  timezone: string;
  updated_at: string;
  zipcode: string;
}

export interface IBilling {
  account_id: number;
  card: ICard;
  created_at: string;
  deleted_at?: string;
  id: number;
  manager: IManager;
  manager_id: string;
  updated_at: string;
  vat_number: string;
  vat_rate: number;
}

export interface IBillingAddress {
  address_1: string;
  address_2: string;
  city: string;
  country: string;
  created_at: string;
  deleted_at?: string;
  id: number;
  state: string;
  team_id: number;
  updated_at: string;
  user_id: number;
  zipcode: string;
}

export interface ISubscription {
  account_id: number;
  activated_at: string;
  automation_count: number;
  automations_limit: number;
  billing_id: number;
  cancel_at?: string;
  cancel_url?: string;
  created_at: string;
  credit: number;
  credit_email: number;
  credit_email_limit: number;
  credit_limit: number;
  deleted_at: number;
  end_at: string;
  extra_credit: number;
  id: number;
  mailboxes_count: number;
  mobile_numbers?: string;
  mobile_numbers_limit: string;
  addon: {
    addon_plan_id: string;
    addon_plan_title: string;
    cancel_at?: string;
    chargebee_addon_id: string;
    created_at: string;
    deleted_at?: string;
    end_at: string;
    id: number;
    plan_id?: number;
    stair_step_id: number;
    start_at: string;
    status: number;
    team_id: number;
    trial_end_at?: string;
    type: string;
    updated_at: string;
    user_id: number;
    stairstep: {
      created_at: string;
      deleted_at?: string;
      ending_unit: string;
      id: number;
      parent_chargebee_id: string;
      parent_id: number;
      price: string;
      starting_unit: string;
      type: string;
      updated_at: string;
    }[];
  };
  plan_id: number;
  renew_at: string;
  source_type: string;
  stair_step_id?: string;
  start_at: string;
  status: number;
  total_credit: number;
  trial_end_at?: string;
  trial_end_email_sent_at?: string;
  update_subscription_notified_at?: string;
  update_url?: string;
  updated_at: string;
  used_automation_count: number;
  user_id: number;
  plan: {
    automations_limit: number;
    batch_id?: string;
    created_at: string;
    credit_limit: number;
    deleted_at?: string;
    email_credit_limit?: string;
    features?: string;
    header?: string;
    id: number;
    interval: string;
    is_active: number;
    is_most_popular: number;
    is_old: number;
    mailboxes_limit: number;
    mobile_number_limit?: string;
    price: string;
    restricted: number;
    source_type: string;
    subscription_id: string;
    title: string;
    trial_period: number;
    updated_at: string;
    visitors_limit: 0;
  };
}

export interface IUser {
  acquire_status: number;
  avatar?: string;
  billing: IBilling;
  billing_address: IBillingAddress;
  child_cname?: string;
  cname?: string;
  color: string;
  company: string;
  sub_manager: {
    first_name: string;
    last_name: string;
  };
  config: {
    config: {
      autofind: boolean;
      history: {
        id: number;
        type: number;
      }[];
      created_at: string;
      deleted_at?: string;
      plugin_config: {
        duplicate_control: string;
        show_balloon: boolean;
      };
      updated_at?: string;
    };
  };
  country: string;
  created_at: string;
  current_account_id: number;
  email: string;
  first_name: string;
  full_name: string;
  has_coupon: number;
  has_coupon_migrated: number;
  has_team_migrated: number;
  has_whitelabel_payment: number;
  id: number;
  industry: string;
  is_installed: number;
  is_payment: number;
  is_trial_user: number;
  job_title: string;
  last_login_ip: string;
  last_name: string;
  number_of_mailboxes: number;
  payment_intent_id?: string;
  phone: string;
  role: number;
  site_logo?: string;
  site_name?: string;
  status: number;
  storage_type: string;
  team_id: number;
  timezone: string;
  updated_at: string;
  used_coupons: number;
  zipcode: string;
  subscription: ISubscription;
}

export interface ISelectMenu {
  name: string;
  value: string;
  id: number;
}

export interface IGroupSelectMenu {
  groupName: string;
  options: ISelectMenu[];
}

export interface ICookieInfo {
  cookie_invalid: boolean | null;
  cookie_last_updated_at: string;
}

export interface ILinkedinConnectionStatus {
  connected: boolean | null;
  last_updated_at: string;
}
