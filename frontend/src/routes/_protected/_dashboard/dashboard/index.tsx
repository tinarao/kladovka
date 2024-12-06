import DashboardTopPanel from '@/components/DashboardTopPanel';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Link, createFileRoute, useRouteContext } from '@tanstack/react-router';
import { FolderPlus, FolderX, Plus } from 'lucide-react';
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
    <>
      <DashboardTopPanel title="Проекты" />
      <div className="flex items-center gap-x-2">
        <Button
          asChild
          title="Создать новый проект"
          variant="outline"
          size="icon"
          className="size-5"
        >
          <Link to="/dashboard/create-project">
            <Plus className="size-2" />
          </Link>
        </Button>
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
            <ProjectCard key={p.id} project={p} className="col-span-1" />
          ))}
        </div>
      )}
    </>
  );
}
