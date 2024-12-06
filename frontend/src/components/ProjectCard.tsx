import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Project } from '@/lib/validators/projects';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

const ProjectCard = ({
  project,
  className = '',
}: {
  project: Project;
  className?: string;
}) => {
  return (
    <Link
      className={cn('group', className)}
      to="/dashboard/$projectId"
      params={{ projectId: project.id.toString() }}
    >
      <Card className="transition group-hover:shadow-md">
        <CardContent className="p-0">
          <img
            src="/pattern.jpg"
            alt={project.name}
            className="h-32 w-full rounded-t-md object-cover"
          />
        </CardContent>
        <CardHeader className="p-3">
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            {project.mbOccupied} Мб. / {project.mbSizeLimit / 1024} Гб.
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default ProjectCard;
