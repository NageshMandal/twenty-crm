import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { Select } from '@/ui/input/components/Select';
import styled from '@emotion/styled';
import { size } from '@floating-ui/react';
import placeholder from '@tiptap/extension-placeholder';
import e from 'express';
import { type } from 'os';
import { title } from 'process';
import { useState } from 'react';
import input from 'react-imask/esm/input';
// Adjust the path based on your directory structure

import {
  Button,
  Checkbox,
  CheckboxShape,
  CheckboxSize,
  CheckboxVariant,
  H2Title,
  IconSettings,
  H3Title,
} from 'twenty-ui';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const StyledFormWrapper = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  box-sizing: border-box;
  display: flex; /* Allow for a side-by-side layout */
  flex-direction: row;
  height: 100vh;
  padding: 30px 20px;
`;

const StyledFormContainer = styled.form`
  flex: 2; /* Main form occupies most of the space */
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const StyledRightFormContainer = styled.div`
  flex: 1; /* Right-side form occupies the remaining space */
  background-color: ${({ theme }) => theme.background.secondary};
  padding: 20px;
  box-shadow: ${({ theme }) =>
    theme.shadow?.box || '0px 4px 10px rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  margin-left: 20px;
`;

const StyledManagementLevelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledCheckboxButton = styled.div<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
      onChange(value.filter((item) => item !== newSelection));
    } else {
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
        options={[{ label: 'Select Member', value: '' }, ...options]}
        onChange={handleChange}
      />
    </div>
  );
};

export const PersonalisationSetupAccountBasedSales = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null); // State for selected form
  const [activeOption, setActiveOption] = useState<string | null>(null); // State for active management level option
  const [formData, setFormData] = useState({
    managementLevels: [] as string[],
    selectedTeamMembers: [] as string[],
    isToggleEnabledForFeatureOne: false,
    isToggleEnabledForFeatureTwo: false,
  });

  const managementLevels = [
    'Latest LinkedIn Post',
    'News about company',
    'Article about person',
    'Company Hiring by role',
    'Blog post about company',
    'Job Trends',
    'Customer Stories',
    'Events',
  ];

  const handleCheckboxChange = (level: string) => {
    setFormData((prevData) => {
      const isSelected = prevData.managementLevels.includes(level);
      const updatedManagementLevels = isSelected
        ? prevData.managementLevels.filter((item) => item !== level)
        : [...prevData.managementLevels, level];

      // If the deselected option is the active one, close the right form
      if (!isSelected && activeOption === level) {
        setActiveOption(null);
      }

      return {
        ...prevData,
        managementLevels: updatedManagementLevels,
      };
    });

    // Set the active option only if it's being selected
    if (!formData.managementLevels.includes(level)) {
      setActiveOption(level);
    }
  };

  const handleRightFormInputChange = (field: string, value: string) => {
    console.log(`Input for ${field} updated to: ${value}`);
    // Handle input data logic as required
  };

  const handleRightFormSave = () => {
    console.log(`Saved data for ${activeOption}`);
    setActiveOption(null); // Close the right form
  };

  return (
    <StyledFormWrapper>
      <StyledFormContainer>
        <H3Title title="Personalisation Setup" />
        <H2Title
          title="Personalisation Types and Signals"
          description="Personalisation Types and Signals (optional, choose multiple for better reach by selecting the categories and edit setup by clicking pencil)"
        />
        <StyledManagementLevelContainer>
          {managementLevels.map((level: any) => (
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

        <StyledToggleWrapper>
          <SettingsOptionCardContentToggle
            title="Enable Feature"
            description="Only include recently hires from the last 90 days (optional)"
            checked={formData.isToggleEnabledForFeatureOne}
            onChange={(checked) =>
              setFormData((prevData: any) => ({
                ...prevData,
                isToggleEnabledForFeatureOne: checked,
              }))
            }
            Icon={IconSettings}
            advancedMode
          />
        </StyledToggleWrapper>

        <StyledToggleWrapper>
          <SettingsOptionCardContentToggle
            title="Enable Feature"
            description="(optional: will check the team for the best path to prospects in accounts and reach out)"
            checked={formData.isToggleEnabledForFeatureTwo}
            onChange={(checked) =>
              setFormData((prevData: any) => ({
                ...prevData,
                isToggleEnabledForFeatureTwo: checked,
              }))
            }
            Icon={IconSettings}
            advancedMode
          />
        </StyledToggleWrapper>
      </StyledFormContainer>
      {activeOption && (
        <StyledRightFormContainer>
          <H2Title title={`Customize: ${activeOption}`} />
          <label>
            <span>Field 1</span>
            <input
              type="text"
              placeholder={`Enter details for ${activeOption}`}
              onChange={(e) =>
                handleRightFormInputChange('field1', e.target.value)
              }
            />
          </label>
          <label>
            <span>Field 2</span>
            <input
              type="text"
              placeholder={`More details for ${activeOption}`}
              onChange={(e) =>
                handleRightFormInputChange('field2', e.target.value)
              }
            />
          </label>
          <Button
            title="Save"
            variant="primary"
            onClick={handleRightFormSave}
          />
        </StyledRightFormContainer>
      )}
    </StyledFormWrapper>
  );
};
