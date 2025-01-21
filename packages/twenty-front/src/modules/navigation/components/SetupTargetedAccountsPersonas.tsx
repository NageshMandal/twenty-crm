import { AISDRForm } from '@/navigation/components/AISDRForm';
import { PersonalisationSetup } from '@/navigation/components/PersonalisationSetup';
import { SettingsOptionCardContentCounter } from '@/settings/components/SettingsOptions/SettingsOptionCardContentCounter';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import styled from '@emotion/styled';
import { size } from '@floating-ui/react';
import placeholder from '@tiptap/extension-placeholder';
import { title } from 'process';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
  H2Title,
  IconSettings,
  IconTrash,
  IconUsers,
} from 'twenty-ui';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Adjust spacing between buttons */
  align-items: center;
  gap: 10px; /* Add spacing between buttons if needed */
  margin-top: 20px; /* Add some top margin to separate from other elements */
`;

const StyledFormWrapper = styled.div`
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px;
  box-sizing: border-box;
  overflow-y: auto; /* Enable vertical scrolling */
  background-color: ${({ theme }) => theme.background.primary};
`;

const StyledFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 800px;
  width: 100%;
`;

const StyledComboInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const StyledManagementLevelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledFunctionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledCheckboxButton = styled.div<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, isChecked }) =>
      isChecked ? theme.color.blue : theme.border.color.medium};
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.background.transparent.blue : theme.background.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background.transparent.light};
  }
`;

const StyledDropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const StyledSelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const StyledItem = styled.div`
  border-radius: 4px;
  font-size: 14px;
  padding: 6px 12px;
`;

const StyledRemoveButton = styled.span`
  cursor: pointer;
  margin-left: 8px;
  font-size: 16px;
`;

const StyledToggleWrapper = styled.div`
  margin-top: 20px;
`;

const MultiSelect = ({
  options,
  label,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  const handleChange = (newSelection: string) => {
    if (value.includes(newSelection)) {
      // Remove the item if already selected
      onChange(value.filter((item) => item !== newSelection));
    } else {
      // Add the new item
      onChange([...value, newSelection]);
    }
  };

  return (
    <div>
      <Select
        dropdownId="team-members-select"
        dropdownWidth={300}
        label={label}
        dropdownWidthAuto
        fullWidth
        value=""
        options={[
          { label: 'Select Member', value: '' }, // Placeholder
          ...options,
        ]}
        onChange={handleChange}
      />
      <StyledSelectedItems>
        {value.map((selectedItem) => (
          <StyledItem key={selectedItem}>
            {selectedItem}
            <StyledRemoveButton onClick={() => handleChange(selectedItem)}>
              &times;
            </StyledRemoveButton>
          </StyledItem>
        ))}
      </StyledSelectedItems>
    </div>
  );
};

export const SetupTargetedAccountsPersonas = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null); // State for selected form
  const [formData, setFormData] = useState({
    actionName: '',
    trigger: 'time',
    details: '',
    managementLevels: [] as string[],
    functions: [] as string[],
    selectedTeamMembers: [] as string[],
    isToggleEnabledForFeatureOne: false,
    isToggleEnabledForFeatureTwo: false,
    companiesPerDay: 0,
    prospectsPerCompany: 0,
  });

  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  // Handle card click
  const handleCardClick = (formType: string) => {
    setSelectedForm(formType);
  };

  // Render the selected form or default content
  if (selectedForm === 'reverse') {
    return <AISDRForm />; // Render for "By Persona"
  }

  if (selectedForm === 'Next') {
    return <PersonalisationSetup />; // Render for "By Persona"
  }

  const managementLevels = [
    'Owner',
    'Founder',
    'C-Suite',
    'Partner',
    'VP',
    'Head',
    'Director',
    'Manager',
    'Senior',
    'Entry',
    'Intern',
  ];

  const functions = [
    'Accounting',
    'Engineering',
    'Administration',
    'Education',
    'Finance',
    'Healthcare',
    'HR',
    'Legal',
    'Sales',
    'Real Estate',
    'IT',
    'Military',
    'Marketing',
    'Quality Assurance',
    'Consulting',
    'Research',
    'Writing / Editing',
    'Training',
    'Supply Chain',
    'Strategy / Planning',
    'Science',
    'Production',
    'Project Management',
    'Product Management',
    'Purchasing',
    'Public Relations',
    'Other',
    'Management',
    'Information Technology',
    'Healthcare Provider',
    'Distribution',
    'Business Development',
    'Advertising',
    'Analyst',
  ];

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (level: string) => {
    setFormData((prevData) => ({
      ...prevData,
      managementLevels: prevData.managementLevels.includes(level)
        ? prevData.managementLevels.filter((item) => item !== level)
        : [...prevData.managementLevels, level],
    }));
  };

  const handleFunctionChange = (func: string) => {
    setFormData((prevData) => ({
      ...prevData,
      functions: prevData.functions.includes(func)
        ? prevData.functions.filter((item) => item !== func)
        : [...prevData.functions, func],
    }));
  };

  const teamMembers = [
    { label: 'Jesper Qvist', value: 'Jesper Qvist' },
    { label: 'Carlos Llorens', value: 'Carlos Llorens' },
    { label: 'Salestools User', value: 'Salestools User' },
    { label: 'Another Member', value: 'Another Member' },
  ];

  const handleSelectChange = (nextValue: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedTeamMembers: nextValue,
    }));
  };

  const handleRemoveMember = (member: string) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedTeamMembers: prevData.selectedTeamMembers.filter(
        (item) => item !== member,
      ),
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('Automation Form Submitted:', formData);
  };

  const toggleFeature = () => {
    setIsFeatureEnabled((prev) => !prev);
    console.log('Feature Toggled:', !isFeatureEnabled);
  };

  const handleCounterChange = (value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      counterValue: value,
    }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      isToggleEnabled: checked,
    }));
  };

  return (
    <StyledFormWrapper>
      <StyledFormContainer onSubmit={handleSubmit}>
        <H2Title
          title="Define ICP + PERSONA"
          description="Setup Targeted Accounts + their Personas"
        />
        <TextInput
          label="Company HQ Location (required)"
          placeholder="Select Location"
          fullWidth
        />
        <TextInput
          label="Industry (required)"
          placeholder="Select an industry"
          fullWidth
        />
        <TextInput
          label="Technology (optional)"
          placeholder="Select Location"
          fullWidth
        />
        <TextInput
          label="Job Title (required)"
          placeholder="Select Job Title"
          fullWidth
        />
        <StyledComboInputContainer>
          <TextInput
            label="Company Headcount (optional)"
            placeholder="0"
            fullWidth
          />
          <TextInput label="To" placeholder="0" fullWidth />
        </StyledComboInputContainer>
        <TextInput
          label="Department Headcount (optional)"
          placeholder="Select Job Title"
          fullWidth
        />
        <H2Title title="Management level (optional)" />
        <StyledManagementLevelContainer>
          {managementLevels.map((level) => (
            <StyledCheckboxButton
              key={level}
              isChecked={formData.managementLevels.includes(level)}
              onClick={() => handleCheckboxChange(level)}
            >
              <Checkbox
                checked={formData.managementLevels.includes(level)}
                onCheckedChange={() => handleCheckboxChange(level)}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Rounded}
                hoverable
              />
              <span style={{ marginLeft: '8px' }}>{level}</span>
            </StyledCheckboxButton>
          ))}
        </StyledManagementLevelContainer>
        <H2Title title="Function (optional)" />
        <StyledFunctionContainer>
          {functions.map((func) => (
            <StyledCheckboxButton
              key={func}
              isChecked={formData.functions.includes(func)}
              onClick={() => handleFunctionChange(func)}
            >
              <Checkbox
                checked={formData.functions.includes(func)}
                onCheckedChange={() => handleFunctionChange(func)}
                variant={CheckboxVariant.Primary}
                size={CheckboxSize.Small}
                shape={CheckboxShape.Rounded}
                hoverable
              />
              <span style={{ marginLeft: '8px' }}>{func}</span>
            </StyledCheckboxButton>
          ))}
        </StyledFunctionContainer>
        <TextInput
          label="Personas (ideal)"
          placeholder="Select Personas"
          fullWidth
        />
        <StyledToggleWrapper>
          <SettingsOptionCardContentToggle
            title="Enable Feature"
            description="Only include recently hires from the last 90 days (optional)"
            checked={formData.isToggleEnabledForFeatureOne}
            onChange={(checked) =>
              setFormData((prevData) => ({
                ...prevData,
                isToggleEnabledForFeatureOne: checked,
              }))
            }
            Icon={IconSettings}
            advancedMode
          />
        </StyledToggleWrapper>
        <TextInput
          label="Person Location (optional)"
          placeholder="Select Location"
          fullWidth
        />
        <SettingsOptionCardContentCounter
          title="Companies to prospect per day per user"
          description="(required maximum 40 per day)"
          value={formData.companiesPerDay}
          onChange={(value) =>
            setFormData((prevData) => ({
              ...prevData,
              companiesPerDay: value,
            }))
          }
          minValue={0}
          maxValue={40}
          Icon={IconUsers}
        />

        <SettingsOptionCardContentCounter
          title="Prospects per company per user"
          description="(required maximum 30 per day)"
          value={formData.prospectsPerCompany}
          onChange={(value) =>
            setFormData((prevData) => ({
              ...prevData,
              prospectsPerCompany: value,
            }))
          }
          minValue={0}
          maxValue={30}
          Icon={IconUsers}
        />
        <StyledToggleWrapper>
          <SettingsOptionCardContentToggle
            title="Enable Feature"
            description="(optional: will check the team for the best path to prospects in accounts and reach out)"
            checked={formData.isToggleEnabledForFeatureTwo}
            onChange={(checked) =>
              setFormData((prevData) => ({
                ...prevData,
                isToggleEnabledForFeatureTwo: checked,
              }))
            }
            Icon={IconSettings}
            advancedMode
          />
        </StyledToggleWrapper>

        <StyledDropdownWrapper>
          <H2Title title="Select Team Members for Campaign" />
          <MultiSelect
            options={teamMembers}
            label="Team Members"
            value={formData.selectedTeamMembers}
            onChange={handleSelectChange}
          />
        </StyledDropdownWrapper>
        <StyledButtonContainer>
          <Button
            accent="default"
            variant="secondary"
            title="Back"
            Icon={IconTrash}
            onClick={() => handleCardClick('reverse')}
          />
          <Button
            accent="blue"
            variant="primary"
            title="Next"
            Icon={IconTrash}
            onClick={() => handleCardClick('Next')}
          />
        </StyledButtonContainer>
        <br />
        <br />
      </StyledFormContainer>
    </StyledFormWrapper>
  );
};
