interface AutoStopCondition {
  label: string;
  value: string;
}

export interface FlowchartNode {
  choosenFunction: string;
  content: {
    value: string;
    autoStopCondition?: AutoStopCondition;
    schedulesOptions?: AutoStopCondition;
    searchURL?: string;
    messageField?: string;
    templateId?: any;
    mailboxId?: any;
    isRotating?: any;
    aiSdrPitchCTAId?: any;
    aiSdrField?: any;
    aiSdrAdditionalInfoField?: any;
    aiSdrObjectionsField?: any;
    aiSdrCompetitionsField?: any;
    aiSdrAutomated?: any;
    delayValue?: string;
    delayUnit?: {
      value: string;
      label: string;
    };
    proficiency?: {
      label: string;
      value: string;
    };
    relationship?: {
      label: string;
      value: string;
    };
  };
  id: string;
  prevNode: string | null;
  stats?: {
    pending?: number | 0;
    completed?: number | 0;
    failed?: number | 0;
  };
}

interface WorkflowData {
  name: string;
  tag: string | "";
  id: number | null;
  userId: number | null;
  flowchart: FlowchartNode[];
  status: string | "";
}

const workflowTemplate: WorkflowData = {
  name: "",
  tag: "",
  id: null,
  userId: null,
  flowchart: [],
  status: "",
};

export default workflowTemplate;
