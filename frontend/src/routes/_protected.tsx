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
});

function RouteComponent() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      throw redirect({ to: '/login' });
    }
  }, []);
  return <Outlet />;
}
