import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { LayoutIcon } from 'lucide-react';

const SidebarToggleButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" onClick={() => toggleSidebar()} size="icon">
      <LayoutIcon className="size-2" />
    </Button>
  );
};

export default SidebarToggleButton;
