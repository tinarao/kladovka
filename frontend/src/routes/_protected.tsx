import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
