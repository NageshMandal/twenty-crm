export interface IAutomation {
  id: number;
  name: string;
  status: any;
}

export interface IBuilderMessage {
  id: string;
  message: string;
  imgurl: string;
  // [key: string]: string | { value: string; label: string };
  label: string;
}
export interface IBuilderAiSdr {
  id: any;
  aiSdrPitchCTAId?: any;
  aiSdrField?: any;
  aiSdrAdditionalInfoField?: any;
  aiSdrObjectionsField?: any;
  aiSdrCompetitionsField?: any;
  aiSdrAutomated?: any;
}

export interface IBuilderEmail {
  id: any;
  templateId: any;
  mailboxId: any;
  isRotating: any;
}

export interface IBuilderAiSdrSetup {
  id: any;
  aiSdrSetupSystemPrompt?: any;
  aiSdrSetupPrompt?: any;
}
