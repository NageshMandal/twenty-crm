import Button from "../../../../../components/base/Button";
import Textarea from "../../../../../components/base/Textarea";
import { SystemPrompt } from "./index";

interface Props {
  type: SystemPrompt["type"];
  onTypeChange: (value: SystemPrompt["type"]) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

const SystemPromptStandardisation = ({
  type,
  onTypeChange,
  systemPrompt,
  onSystemPromptChange,
}: Props) => {
  return (
    <div className='flex flex-col'>
      <div className='w-full flex px-5 mb-4 gap-3'>
        <span className={`text-neutral-800 dark:text-neutral-200 text-xs`}>
          System Prompt for standardisation
        </span>
        <span className={`dark:text-neutral-200 text-xs text-[#94A3B8]`}>- Optional</span>
      </div>
      <div className='flex gap-12 py-15 overflow-x-auto scrollbar-hide'>
        <Button
          buttonStyle={type === "Custom" ? "primary" : "white"}
          className='h-28 rounded-sm'
          onClick={() => onTypeChange("Custom")}
        >
          Custom
        </Button>
        <Button
          buttonStyle={type === "Salestools Trained Prompt" ? "primary" : "white"}
          className='h-28 rounded-sm'
          onClick={() => onTypeChange("Salestools Trained Prompt")}
        >
          Salestools Trained Prompt
        </Button>
        <Button
          buttonStyle={type === "Import emails to design your style" ? "primary" : "white"}
          className='h-28 rounded-sm'
          onClick={() => onTypeChange("Import emails to design your style")}
        >
          Import emails to design your style
        </Button>
      </div>
      <div className='mt-12'>
        <Textarea
          rows={10}
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SystemPromptStandardisation;
