import {
  Outlet,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import axios from 'axios';

interface KladowkaContext {
  auth?: UserStore;
}

export const Route = createRootRouteWithContext<KladowkaContext>()({
  component: RootComponent,
});

axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;

function RootComponent() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}
