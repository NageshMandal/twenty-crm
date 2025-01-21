import { useRecoilValue } from 'recoil';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { WorkspaceActivationStatus } from '~/generated/graphql';
import { generatedMockObjectMetadataItems } from '~/testing/mock-data/generatedMockObjectMetadataItems';
import { isDefined } from '~/utils/isDefined';

const FALLBACK_SINGULAR_PLURAL_MAP: Record<string, string> = {
  Automations: 'Automation',
  AISDRs: 'AISDR',
};

export const useObjectNameSingularFromPlural = ({
  objectNamePlural,
}: {
  objectNamePlural: string;
}) => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  let objectMetadataItem = useRecoilValue(
    objectMetadataItemFamilySelector({
      objectName: objectNamePlural,
      objectNameType: 'plural',
    }),
  );

  // Fallback to mock data if workspace is inactive
  if (currentWorkspace?.activationStatus !== WorkspaceActivationStatus.Active) {
    objectMetadataItem =
      generatedMockObjectMetadataItems.find(
        (objectMetadataItem) =>
          objectMetadataItem.namePlural === objectNamePlural,
      ) ?? null;
  }

  // Use fallback mapping if objectMetadataItem is not found
  if (!isDefined(objectMetadataItem)) {
    const fallbackSingular = FALLBACK_SINGULAR_PLURAL_MAP[objectNamePlural];
    if (!fallbackSingular) {
      throw new Error(
        `Object metadata item not found for ${objectNamePlural} object`,
      );
    }
    return { objectNameSingular: fallbackSingular };
  }

  return { objectNameSingular: objectMetadataItem.nameSingular };
};
