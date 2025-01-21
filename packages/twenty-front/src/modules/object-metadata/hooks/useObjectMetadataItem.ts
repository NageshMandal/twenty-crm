import { useRecoilValue } from 'recoil';

import { ObjectMetadataItemNotFoundError } from '@/object-metadata/errors/ObjectMetadataNotFoundError';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { isDefined } from '~/utils/isDefined';

import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { ObjectMetadataItemIdentifier } from '../types/ObjectMetadataItemIdentifier';

const FALLBACK_METADATA_ITEMS: ObjectMetadataItem[] = [
  {
    id: 'automation',
    nameSingular: 'Automation',
    namePlural: 'Automations',
    labelSingular: 'Automation',
    labelPlural: 'Automations',
    icon: 'Icon360View',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isCustom: true,
    isLabelSyncedWithName: false,
    isRemote: false,
    isSystem: false,
    fields: [],
    indexMetadatas: [],
  },
  {
    id: 'ai-sdr',
    nameSingular: 'AISDR',
    namePlural: 'AISDRs',
    labelSingular: 'AISDR',
    labelPlural: 'AISDRs',
    icon: 'IconBrain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isCustom: true,
    isLabelSyncedWithName: false,
    isRemote: false,
    isSystem: false,
    fields: [],
    indexMetadatas: [],
  },
];

export const useObjectMetadataItem = ({
  objectNameSingular,
}: ObjectMetadataItemIdentifier) => {
  let objectMetadataItem = useRecoilValue(
    objectMetadataItemFamilySelector({
      objectName: objectNameSingular,
      objectNameType: 'singular',
    }),
  );

  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);

  // Fallback to predefined metadata for custom objects
  if (!isDefined(objectMetadataItem)) {
    objectMetadataItem =
      FALLBACK_METADATA_ITEMS.find(
        (item) => item.nameSingular === objectNameSingular,
      ) ?? null;

    if (!objectMetadataItem) {
      throw new ObjectMetadataItemNotFoundError(
        objectNameSingular,
        objectMetadataItems,
      );
    }
  }

  return {
    objectMetadataItem,
  };
};
