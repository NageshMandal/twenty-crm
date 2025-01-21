export interface IMessage {
  message: string;
  name: string;
  node_id: string;
  parent_node_id: string;
  prospect_id: number;
  step_id: number;
  type: string;
}

export interface IManualReq {
  wid: string;
  pid?: number;
  page?: number;
}

export interface IEditMessage {
  wid: string;
  pid: number;
  sid: number;
  mid: number;
  message: string;
  promptId: number;
}

export interface IResMessage {
  messages: string;
}
