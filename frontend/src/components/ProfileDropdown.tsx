import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { User } from 'lucide-react';

const ProfileDropdown = ({ user }: { user: UserStore }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User className="size-2" />
          {user.firstName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="gap-0 space-y-0 px-2 py-2 font-medium">
          <p className="m-0">
            {user.firstName} {user.lastName}
          </p>
          <span className="m-0 text-sm text-neutral-500">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
