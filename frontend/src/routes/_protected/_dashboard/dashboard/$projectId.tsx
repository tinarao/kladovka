import DashboardTopPanel from '@/components/DashboardTopPanel';
import { projectSchema } from '@/lib/validators/projects';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import axios from 'axios';

export const Route = createFileRoute(
  '/_protected/_dashboard/dashboard/$projectId',
)({
  component: RouteComponent,
  async beforeLoad(ctx) {
    const res = await axios(`/api/v/projects/${ctx.params.projectId}`);
    if (res.status !== 200) {
      throw redirect({ to: '/dashboard' });
    }

    const { data, error, success } = projectSchema.safeParse(res.data.project);
    if (!success) {
      console.error(error);
      throw redirect({ to: '/dashboard' });
    }

    return {
      project: data,
    };
  },
});

function RouteComponent() {
  const { project } = Route.useRouteContext();

  return (
    <div className="flex-1 p-2">
      <DashboardTopPanel title={project.name} />
    </div>
  );
}
