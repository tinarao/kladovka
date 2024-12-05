import { useAuth } from '@/hooks/auth';
import { UserFields } from '@/lib/validators/user';
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouteContext,
} from '@tanstack/react-router';
import axios from 'axios';
import { useEffect } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async (ctx) => {
    const res = await axios('/api/auth/verify');
    if (res.status !== 200) {
      throw redirect({ to: '/login' });
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
      throw redirect({ to: '/login' });
    }

    ctx.context.auth = data;

    return {
      user: ctx.context.auth,
    };
  },
});

function RouteComponent() {
  const { setUser } = useAuth();
  const { user } = useRouteContext({
    from: '/_protected',
  });

  useEffect(() => {
    setUser(user);
  }, [user]);

  return <Outlet />;
}
