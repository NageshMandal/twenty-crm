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

export const RecordIndexPageAI_SDR = () => {
  // Define AI SDR-specific metadata explicitly
  const objectMetadataItem = {
    id: 'ai-sdr',
    nameSingular: 'AI SDR',
    namePlural: 'AI SDRs',
    labelSingular: 'AI SDR',
    labelPlural: 'AI SDRs',
    icon: 'IconBrain', // Replace with your actual icon
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isCustom: true,
    fields: [
      { name: 'Name', type: 'String', required: true },
      { name: 'Description', type: 'String', required: false },
      {
        name: 'Status',
        type: 'Enum',
        options: ['Active', 'Inactive'],
        required: true,
      },
      { name: 'Created Date', type: 'Date', required: false },
    ],
  };

  return (
    <PageContainer>
      <RecordIndexContextProvider
        value={{
          recordIndexId: 'ai-sdr',
          objectNamePlural: 'AI SDRs',
          objectNameSingular: 'AI SDR',
          objectMetadataItem,
          onIndexRecordsLoaded: () => {
            console.log('AI SDR records loaded');
          },
          indexIdentifierUrl: '/objects/ai-sdrs',
        }}
      >
        <PageTitle title="AI SDRs" />
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
