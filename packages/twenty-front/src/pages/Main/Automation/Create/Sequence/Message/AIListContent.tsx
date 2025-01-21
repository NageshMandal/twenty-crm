import React from "react";
import Button from "src/components/base/Button";
import ReactSelect from "src/components/base/ReactSelect";

// Define a type for the template object
type AIConnectionRequestTemplate = {
  status: any;
  //   template: number;
  id: number;
  name: string;
  pretty_name: string;
  headline: string;
  value: string;
  example: string;
  // Add other properties as needed
};

type AIListContentProps = {
  templates: AIConnectionRequestTemplate[];
  onSelect: (template: AIConnectionRequestTemplate) => void;
  selectedTemplate: AIConnectionRequestTemplate | null;
  onMgptPromptSave?: any;
  onLangChange?: any;
};

const AIConnectionRequestListContent: React.FC<AIListContentProps> = ({
  templates,
  onSelect,
  selectedTemplate,
  onMgptPromptSave,
  onLangChange,
}) => {
  return (
    <div className='flex w-1000 m-30 nowheel scrollbar-1'>
      <div className='w-1/2 pr-10'>
        <div>
          <h2 className='text-2xl font-bold text-center mb-4 text-white dark:text-gray-100'>
            Select AI Templates
          </h2>
          <div
            className='grid grid-cols-1 gap-4 nowheel scrollbar-1'
            style={{ overflow: "auto", maxHeight: "70vh" }}
          >
            {templates
              .filter((template) => template.status === 1)
              .map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className={`p-8 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer ${
                    selectedTemplate && selectedTemplate.id === template.id
                      ? "bg-black-200 dark:bg-black-800"
                      : ""
                  }`}
                >
                  <h3 className='text-lg font-semibold text-black dark:text-white'>
                    {template.headline}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>{template.pretty_name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      {selectedTemplate && (
        <div className='w-1/2 pl-10'>
          <div>
            <h2 className='text-2xl font-bold text-center text-white dark:text-gray-100'>
              Selected Template
            </h2>
            <h3 className='text-lg font-semibold text-black dark:text-white'>
              {selectedTemplate.headline}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300 pb-8'>
              {selectedTemplate.pretty_name}
            </p>
            {/* <p className='text-sm text-gray-600 dark:text-gray-300 pb-8'>
              Example:
              <br />
              {selectedTemplate.example}
            </p> */}
            <div className='relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
              <div className='absolute w-3 h-3 bg-white rotate-45 top-0 left-6 -mt-1'></div>
              <div className='text-md text-gray-600 dark:text-gray-300 pb-8'>Example:</div>
              <p className='text-sm text-gray-600 dark:text-gray-300 pb-8'>
                {selectedTemplate.example}
              </p>
            </div>

            <div className='py-8'>
              <ReactSelect
                label='Language'
                placeholder='English'
                options={[
                  { label: "English", value: "English" },
                  { label: "German", value: "German" },
                  { label: "Swiss German", value: "Swiss German" },
                  { label: "French", value: "French" },
                  { label: "Spanish", value: "Spanish" },
                  { label: "Portuguese", value: "Portuguese" },
                  { label: "Danish", value: "Danish" },
                  { label: "Dutch", value: "Dutch" },
                  { label: "Swedish", value: "Swedish" },
                  { label: "Norwegian", value: "Norwegian" },
                  { label: "Hebrew", value: "Hebrew" },
                  { label: "Italian", value: "Italian" },
                  { label: "Arabic", value: "Arabic" },
                ]}
                value={undefined}
                onChange={(val: any) => {
                  // console.log("val c: " + JSON.stringify(val));
                  onLangChange(val);
                }}
              ></ReactSelect>
            </div>
            <p className='text-sm text-green-600 dark:text-green-300 pb-4'>
              (Choose language the AI model writes (make sure to use language filters on LinkedIn to
              sort by profile language, for better reply rate)
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-300 pb-4'>
              (If we have insufficient data such as Missing Post, About, Company Info etc the model
              will return a default AI generated request)
            </p>
            <div className='pt-8'>
              <Button
                prefix='MessageBox'
                buttonClassName=' px-4'
                onClick={() => {
                  // handleUpdateEmailTemplate();
                  onMgptPromptSave();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConnectionRequestListContent;
