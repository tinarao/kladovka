import { Link, createFileRoute } from '@tanstack/react-router';

import { LayoutDashboardIcon, LogInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { user } = useAuth();

  return (
    <>
      <header className="border-b bg-neutral-100 py-2">
        <div className="container mx-auto flex items-center justify-end">
          {user ? (
            <Button size="sm" variant="outline" asChild>
              <Link to="/dashboard">
                <LayoutDashboardIcon className="size-2" /> Панель управления
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/login">
                <LogInIcon className="size-2" /> Войти
              </Link>
            </Button>
          )}
        </div>
      </header>
    </>
  );
}
