import { useAuth } from '@/hooks/auth';
import {
  Outlet,
  createFileRoute,
  useRouteContext,
} from '@tanstack/react-router';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import axios from 'axios';
import { z } from 'zod';
import { projectSchema } from '@/lib/validators/projects';

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
    <SidebarProvider>
      <DashboardSidebar user={user!} />
      <main className="container mx-auto flex h-screen flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
