import DashboardTopPanel from '@/components/DashboardTopPanel';
import { Button } from '@/components/ui/button';
import { projectSchema } from '@/lib/validators/projects';
import { Link } from '@tanstack/react-router';
import { createFileRoute, redirect } from '@tanstack/react-router';
import axios from 'axios';
import { Cog, Files } from 'lucide-react';
import { z } from 'zod';
import SettingsBlock from './-components/SettingsBlock';
import FilesBlock from './-components/FilesBlock';

export const Route = createFileRoute(
  '/_protected/_dashboard/dashboard/$projectId',
)({
  component: RouteComponent,

  validateSearch: (search: Record<string, unknown>): { b: string } => {
    const { data, success, error } = z
      .object({
        b: z.enum(['files', 'settings']),
      })
      .safeParse(search);
    if (!success) {
      return {
        b: 'files',
      };
    }

    return { b: data?.b };
  },
  async loader(ctx) {
    const [projectRes, tokenRes] = await Promise.all([
      axios(`/api/v/projects/${ctx.params.projectId}`),
      axios(`/api/v/tokens/${ctx.params.projectId}`),
    ]);

    if (projectRes.status !== 200 || tokenRes.status !== 200) {
      throw redirect({ to: '/dashboard' });
    }

    const { data, error, success } = projectSchema.safeParse(
      projectRes.data.project,
    );
    if (!success) {
      console.error(error);
      throw redirect({ to: '/dashboard' });
    }

    return {
      project: data,
      filesCount: projectRes.data.filesCount,
      token: tokenRes.data.token,
    };
  },
});

type Blocks = 'settings' | 'files';

const sidebarNavLinks = [
  {
    id: 0,
    label: 'Файлы',
    icon: Files,
    search: {
      b: 'files',
    },
  },
  {
    id: 1,
    label: 'Настройки',
    icon: Cog,
    search: {
      b: 'settings',
    },
  },
];

function RouteComponent() {
  const { b } = Route.useSearch();
  const { project, token } = Route.useLoaderData();

  const blocks: Record<string, JSX.Element> = {
    settings: <SettingsBlock token={token} />,
    files: <FilesBlock />,
  };

  return (
    <div className="flex h-full flex-col">
      <DashboardTopPanel title={project.name} />
      <div className="grid flex-1 grid-cols-6">
        <div className="col-span-1 h-full border-r pr-2">
          <nav className="grid gap-y-1">
            {sidebarNavLinks.map((l) => (
              <Button
                variant="ghost"
                asChild
                className="justify-start"
                key={l.id}
              >
                <Link
                  search={{ b: l.search.b as Blocks }}
                  to="/dashboard/$projectId"
                  params={{ projectId: String(project.id) }}
                >
                  <l.icon />
                  {l.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="col-span-5 pl-2">{blocks[b]}</div>
      </div>
    </div>
  );
}
