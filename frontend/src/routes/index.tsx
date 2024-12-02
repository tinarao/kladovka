import { Link, createFileRoute } from '@tanstack/react-router';

import { LayoutDashboard, LogInIcon } from 'lucide-react';
import { useAuth } from '../hooks/auth';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <header className="border-b py-2 bg-neutral-100">
        <div className="flex items-center justify-end container mx-auto">
          <Button variant="outline" asChild>
            <Link to="/login">
              <LogInIcon className="size-2" /> Войти
            </Link>
          </Button>
          {/* {isAuthenticated ? (
            <Button component={Link} to="/login" variant="filled">
              Панель управления
            </Button>
          ) : (
            <Button
              leftSection={<LogInIcon className="size-4" />}
              component={Link}
              to="/login"
              variant="filled"
            >
              Войти
            </Button>
          )} */}
        </div>
      </header>
    </>
  );
}
