import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
