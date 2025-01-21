import { MentionsInput, Mention } from "react-mentions";

const predefinedWords = [
  { id: 1, display: "/company_name", value: "Salestools" },
  { id: 2, display: "/first_name", value: "John" },
  { id: 3, display: "/last_name", value: "Doe" },
  { id: 4, display: "/title", value: "CEO" },
  { id: 5, display: "/location", value: "United States" },
  {
    id: 6,
    display: "/linkedin_post",
    value:
      "I'm thrilled to announce that Salestools has been named one of the top 10 sales automation tools #Salestools",
  },
  {
    id: 7,
    display: "/company_blog",
    value: "Why we changed our pricing model to better serve our customers",
  },
  { id: 8, display: "/tech_last_installed", value: "Last installed technology: Salesforce" },
  { id: 9, display: "/domain", value: "Salestools" },
  { id: 10, display: "/top_page", value: "Homepage" },
];

interface PromptForSpecificTaskProps {
  value: string;
  onChange: (value: string) => void;
}

const PromptForSpecificTask = ({ value, onChange }: PromptForSpecificTaskProps) => {
  const dark = localStorage.getItem("darkMode") === "true";
  return (
    <MentionsInput
      onChange={(_, newValue) => onChange(newValue)}
      value={value}
      style={{
        border: "1px solid #e0e0e0",
        control: {
          backgroundColor: dark ? "#1e1e1e" : "#fff",
          fontSize: 14,
        },
        "&multiLine": {
          control: {
            minHeight: 63,
          },
          highlighter: {
            padding: 9,
          },
          input: {
            padding: 9,
          },
        },
      }}
    >
      <Mention trigger='/' data={predefinedWords} style={{ backgroundColor: "#daf4fa" }} />
    </MentionsInput>
  );
};

export default PromptForSpecificTask;
