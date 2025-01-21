import { SettingsCard } from '@/settings/components/SettingsCard';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import {
  H2Title,
  IconBuildingSkyscraper,
  MOBILE_VIEWPORT,
  Section,
} from 'twenty-ui';
import { SetupTargetedAccountsPersonas } from './SetupTargetedAccountsPersonas'; // Import AutomationForm
// eslint-disable-next-line no-restricted-imports
import { SetupTargetedAccounts } from '@/navigation/components/SetupTargetedAccounts';
// eslint-disable-next-line no-restricted-imports
import { WebsiteVisitors } from '@/navigation/components/WebsiteVisitors';
// eslint-disable-next-line no-restricted-imports
import {
  IconBrandSuperhuman,
  IconBrandWebflow,
  IconSwipe,
} from '@tabler/icons-react';

// Styled components
const StyledCardsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    flex-direction: column;
  }
`;

const StyledSection = styled(Section)`
  padding: 30px 20px;
`;

const StyledLinkButton = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

// Component
export const AutomationForm = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null); // State for selected form
  const theme = useTheme();

  // Handle card click
  const handleCardClick = (formType: string) => {
    setSelectedForm(formType);
  };

  // Render the selected form or default content
  if (selectedForm === 'persona') {
    return <SetupTargetedAccountsPersonas />; // Render AutomationForm for "By Persona"
  }

  // Render the selected form or default content
  if (selectedForm === 'account') {
    return <SetupTargetedAccounts />; // Render AutomationForm for "By Persona"
  }

  // Render the selected form or default content
  if (selectedForm === 'website') {
    return <WebsiteVisitors />; // Render AutomationForm for "By Persona"
  }

  // Render the selected form or default content
  if (selectedForm === 'reverse') {
    return <AutomationForm />; // Render AutomationForm for "By Persona"
  }

  return (
    <StyledSection>
      <H2Title
        title="Create Automation"
        description="How do you want to add your prospects?"
      />
      <StyledCardsContainer>
        <StyledLinkButton onClick={() => handleCardClick('persona')}>
          <SettingsCard
            Icon={
              <IconBrandSuperhuman
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From Scratch"
            description="Target your Lead From Scratch"
          />
        </StyledLinkButton>
        <StyledLinkButton onClick={() => handleCardClick('account')}>
          <SettingsCard
            Icon={
              <IconBuildingSkyscraper
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From Template"
            description="Target your Lead From Template"
          />
        </StyledLinkButton>
        <StyledLinkButton onClick={() => handleCardClick('website')}>
          <SettingsCard
            Icon={
              <IconBrandWebflow
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From My Lead"
            description="Target your Lead From Lead"
          />
        </StyledLinkButton>
        <StyledLinkButton onClick={() => handleCardClick('reverse')}>
          <SettingsCard
            Icon={
              <IconSwipe
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From LinkedIn Search or List"
            description="Target From LinkedIn Search"
          />
        </StyledLinkButton>
      </StyledCardsContainer>
      <StyledCardsContainer>
        <StyledLinkButton onClick={() => handleCardClick('persona')}>
          <SettingsCard
            Icon={
              <IconBrandSuperhuman
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From Linkedin Post Commenters"
            description="Target Lead From Linkedin Post"
          />
        </StyledLinkButton>
        <StyledLinkButton onClick={() => handleCardClick('account')}>
          <SettingsCard
            Icon={
              <IconBuildingSkyscraper
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From Linkedin Post Likes"
            description="Target From Linkedin Post Likes"
          />
        </StyledLinkButton>
        <StyledLinkButton onClick={() => handleCardClick('website')}>
          <SettingsCard
            Icon={
              <IconBrandWebflow
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="From Website Visitor"
            description="Target From Website Visitor"
          />
        </StyledLinkButton>
      </StyledCardsContainer>
    </StyledSection>
  );
};
