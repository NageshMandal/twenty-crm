import { NavigationDrawerItemForObjectMetadataItem } from '@/object-metadata/components/NavigationDrawerItemForObjectMetadataItem';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

const ORDERED_STANDARD_OBJECTS = [
  'person',
  'company',
  'opportunity',
  'task',
  'note',
  'ai-sdr', // New menu option
  'automation', // New menu option
];

const StyledObjectsMetaDataItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.betweenSiblingsGap};
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

export const NavigationDrawerSectionForObjectMetadataItems = ({
  sectionTitle,
  isRemote,
  objectMetadataItems,
}: {
  sectionTitle: string;
  isRemote: boolean;
  objectMetadataItems: ObjectMetadataItem[];
}) => {
  const { toggleNavigationSection, isNavigationSectionOpenState } =
    useNavigationSection('Objects' + (isRemote ? 'Remote' : 'Workspace'));
  const isNavigationSectionOpen = useRecoilValue(isNavigationSectionOpenState);

  const sortedStandardObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      const indexA = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemA.nameSingular,
      );
      const indexB = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemB.nameSingular,
      );
      if (indexA === -1 || indexB === -1) {
        return objectMetadataItemA.nameSingular.localeCompare(
          objectMetadataItemB.nameSingular,
        );
      }
      return indexA - indexB;
    });

  const sortedCustomObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => !ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      return new Date(objectMetadataItemA.createdAt) <
        new Date(objectMetadataItemB.createdAt)
        ? 1
        : -1;
    });

  const objectMetadataItemsForNavigationItems = [
    ...sortedStandardObjectMetadataItems,
    ...sortedCustomObjectMetadataItems,
  ];

  return (
    objectMetadataItems.length > 0 && (
      <NavigationDrawerSection>
        <NavigationDrawerAnimatedCollapseWrapper>
          <NavigationDrawerSectionTitle
            label={sectionTitle}
            onClick={() => toggleNavigationSection()}
          />
        </NavigationDrawerAnimatedCollapseWrapper>
        <StyledObjectsMetaDataItemsWrapper>
          {isNavigationSectionOpen &&
            objectMetadataItemsForNavigationItems.map((objectMetadataItem) => (
              <NavigationDrawerItemForObjectMetadataItem
                key={`navigation-drawer-item-${objectMetadataItem.id}`}
                objectMetadataItem={objectMetadataItem}
              />
            ))}

          {/* Additional Section for AI SDR */}
          {isNavigationSectionOpen && (
            <NavigationDrawerItemForObjectMetadataItem
              key="navigation-drawer-item-ai-sdr"
              objectMetadataItem={{
                id: 'ai-sdr',
                nameSingular: 'AISDR',
                namePlural: 'AISDRs',
                labelSingular: 'AISDR',
                labelPlural: 'AISDRs',
                icon: 'IconBrain', // Icon name from react-icons
                createdAt: new Date().toISOString(),
                isActive: true,
                isCustom: true,
                isLabelSyncedWithName: false,
                isRemote: false,
                isSystem: false,
                fields: [],
                indexMetadatas: [],
                updatedAt: new Date().toISOString(),
              }}
            />
          )}

          {/* Additional Section for Automation */}
          {isNavigationSectionOpen && (
            <NavigationDrawerItemForObjectMetadataItem
              key="navigation-drawer-item-automation"
              objectMetadataItem={{
                id: 'automation',
                nameSingular: 'Automation',
                namePlural: 'Automations',
                labelSingular: 'Automation',
                labelPlural: 'Automations',
                icon: 'Icon360View', // Icon name from react-icons
                createdAt: new Date().toISOString(),
                isActive: true,
                isCustom: true,
                isLabelSyncedWithName: false,
                isRemote: false,
                isSystem: false,
                fields: [],
                indexMetadatas: [],
                updatedAt: new Date().toISOString(),
              }}
            />
          )}
        </StyledObjectsMetaDataItemsWrapper>
      </NavigationDrawerSection>
    )
  );
};
