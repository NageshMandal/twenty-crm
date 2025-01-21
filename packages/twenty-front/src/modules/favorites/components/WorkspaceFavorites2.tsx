import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { IconSearch, IconSettings } from 'twenty-ui';

export const WorkspaceFavorites2 = () => {
  const handleItemClick = (itemName: string) => {
    console.log(`${itemName} clicked!`);
  };

  return (
    <NavigationDrawerSection>
      <NavigationDrawerItem
        label="Automation"
        Icon={IconSearch}
        onClick={() => handleItemClick('Automation')}
      />
      <NavigationDrawerItem
        label="AI SDR"
        Icon={IconSettings}
        onClick={() => handleItemClick('AI SDR')}
      />
    </NavigationDrawerSection>
  );
};
