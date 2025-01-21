export interface IIntegration {
  export_types: {
    Account: boolean;
    Contact: boolean;
    Lead: boolean;
  };
  active: boolean;
  id: number;
  is_default: boolean;
  logo_md: string;
  logo_sm: string;
  name: string;
  sequences_sync: boolean;
  slug: string;
  sync_type: boolean;
}

export interface IShowIntegration {
  status: boolean;
  crm_url?: string;
  crm_user_name?: string;
  oauth_url?: string;
  auth_fields?: {
    hint?: string;
    label?: string;
    name: string;
    required?: boolean;
    title?: string;
    type?: string;
    value?: string;
  }[];
  message?: string;
}

export interface TResIntegration {
  default?: boolean;
  integrations: IIntegration[];
}

export interface IIntegrationSetting {
  checked: boolean;
  disabled: boolean;
  hint: string;
  label: string;
  name: string;
  options: any[] | any;
  selected: string;
  title: string;
  type: string;
  value: boolean;
  required: boolean;
}

export interface IResSetting {
  status: boolean;
  settings: IIntegrationSetting[];
}

export interface IResUpdateSetting {
  message: string;
  status: boolean;
}

export interface IFieldData {
  tab_label: string;
  mapping: {
    crm_hash: string;
    crm_label: string;
    st_label: string;
    st_name: string;
  }[];
  selection: {
    crm_fields: { [key: string]: string };
    st_fields: { [key: string]: string };
  };
}

export interface IIntegrationFields {
  Account: IFieldData;
  Contact: IFieldData;
  Lead: IFieldData;
}

export interface IResFields {
  allowed_types: string;
  fields: IIntegrationFields;
  status: boolean;
}
