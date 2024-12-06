import DashboardTopPanel from '@/components/DashboardTopPanel';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Link, createFileRoute, useRouteContext } from '@tanstack/react-router';
import { FolderPlus, FolderX } from 'lucide-react';
import { useEffect } from 'react';

export const Route = createFileRoute('/_protected/_dashboard/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projects, projectsCount } = useRouteContext({
    from: '/_protected/_dashboard',
  });

  useEffect(() => {
    document.title = 'Проекты | КлаудКладовка.рф';
  }, []);

  return (
    <div className="flex-1 p-2">
      <DashboardTopPanel title="Проекты" />
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Всего: {projectsCount}
        </p>
      </div>
      {projectsCount === 0 ? (
        <div className="h-32 space-y-2 py-4">
          <p className="flex items-center gap-x-2">
            <FolderX className="size-6" /> Проекты не найдены!
          </p>
          <Button variant="outline" asChild>
            <Link to="/dashboard/create-project">
              <FolderPlus className="size-2" /> Создать проект
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 py-4">
          {projects.map((p) => (
            <ProjectCard project={p} className="col-span-1" />
          ))}
        </div>
      )}
    </div>
  );
}
