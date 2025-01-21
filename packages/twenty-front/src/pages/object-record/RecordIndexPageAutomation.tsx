import styled from '@emotion/styled';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { PageBody } from '@/ui/layout/page/components/PageBody';
import { RecordIndexContainer } from '@/object-record/record-index/components/RecordIndexContainer';
import { RecordIndexContextProvider } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordIndexContainerContextStoreObjectMetadataEffect } from '@/object-record/record-index/components/RecordIndexContainerContextStoreObjectMetadataEffect';
import { RecordIndexContainerContextStoreNumberOfSelectedRecordsEffect } from '@/object-record/record-index/components/RecordIndexContainerContextStoreNumberOfSelectedRecordsEffect';
import { MainContextStoreComponentInstanceIdSetterEffect } from '@/context-store/components/MainContextStoreComponentInstanceIdSetterEffect';
import { RecordIndexPageHeader } from '@/object-record/record-index/components/RecordIndexPageHeader';

const StyledIndexContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const RecordIndexPageAutomation = () => {
  // Define Automation-specific metadata explicitly
  const objectMetadataItem = {
    id: 'automation',
    nameSingular: 'Automation',
    namePlural: 'Automations',
    labelSingular: 'Automation',
    labelPlural: 'Automations',
    icon: 'Icon360View', // Replace with your actual icon
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isCustom: true,
    fields: [
      { name: 'Workflow Name', type: 'String', required: true },
      { name: 'Trigger', type: 'String', required: true },
      {
        name: 'Execution Status',
        type: 'Enum',
        options: ['Pending', 'Completed'],
        required: true,
      },
      { name: 'Last Run', type: 'Date', required: false },
    ],
  };

  return (
    <PageContainer>
      <RecordIndexContextProvider
        value={{
          recordIndexId: 'automation',
          objectNamePlural: 'Automations',
          objectNameSingular: 'Automation',
          objectMetadataItem,
          onIndexRecordsLoaded: () => {
            console.log('Automation records loaded');
          },
          indexIdentifierUrl: '/objects/automations',
        }}
      >
        <PageTitle title="Automations" />
        <RecordIndexPageHeader />
        <PageBody>
          <StyledIndexContainer>
            <RecordIndexContainerContextStoreObjectMetadataEffect />
            <RecordIndexContainerContextStoreNumberOfSelectedRecordsEffect />
            <MainContextStoreComponentInstanceIdSetterEffect />
            <RecordIndexContainer />
          </StyledIndexContainer>
        </PageBody>
      </RecordIndexContextProvider>
    </PageContainer>
  );
};
