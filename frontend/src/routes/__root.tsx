import {
  Outlet,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import axios from 'axios';
import { UserFields } from '@/lib/validators/user';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth';
import { useEffect } from 'react';

interface KladowkaContext {
  auth?: UserStore;
}

axios.defaults.withCredentials = true;
axios.defaults.validateStatus = () => true;

export const Route = createRootRouteWithContext<KladowkaContext>()({
  component: RootComponent,
  beforeLoad: async (ctx) => {
    const res = await axios('/api/auth/verify');
    if (res.status !== 200) {
      return {
        user: undefined,
      };
    }

    const { error, data, success } = z
      .object({
        id: UserFields.id,
        firstName: UserFields.firstName,
        lastName: UserFields.lastName,
        email: UserFields.email,
      })
      .safeParse(res.data.user);
    if (!success) {
      console.error('Validation error', error);
      return {
        user: undefined,
      };
    }

    ctx.context.auth = data;

    return {
      user: ctx.context.auth,
    };
  },
});

function RootComponent() {
  const { setUser, clear: clearUser } = useAuth();
  const { user } = Route.useRouteContext();

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      clearUser();
    }
  }, [user]);

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}
