import { useAuth } from '@/hooks/auth';
import {
  Link,
  Outlet,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod';
import { projectSchema } from '@/lib/validators/projects';
import ProfileDropdown from '../../components/ProfileDropdown';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_protected/_dashboard')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await axios('/api/v/projects');
    const { success, error, data } = z
      .array(projectSchema)
      .safeParse(res.data.projects);
    if (!success) {
      console.error('Ошибка валидации списка проектов');
      console.error(error.errors);
      return {
        projects: [],
      };
    }

    return {
      projects: data,
      projectsCount: data.length,
    };
  },
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto flex h-screen flex-col">
      <header className="flex items-center justify-between border-b py-2 text-xl font-medium">
        Кладовка
        <div className="flex">
          <nav>
            <Button variant="link">
              <Link to="/dashboard">Проекты</Link>
            </Button>
          </nav>
          <div className="ml-2 border-l pl-2">
            <ProfileDropdown user={user!} />
          </div>
        </div>
      </header>
      <main className="flex-1 py-2">
        <Outlet />
      </main>
    </div>
  );
}
