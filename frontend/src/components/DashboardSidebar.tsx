import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import ProfileDropdown from './ProfileDropdown';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function DashboardSidebar({ user }: { user: UserStore }) {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center bg-stone-100">
        <h5 className="text-xl font-bold">КлаудКладовка.рф</h5>
      </SidebarHeader>
      <SidebarContent className="bg-stone-100">
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard">Проекты</Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard/create-project">
                    <Plus className="size-2" />
                    <span>Создать</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-stone-100">
        <ProfileDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
