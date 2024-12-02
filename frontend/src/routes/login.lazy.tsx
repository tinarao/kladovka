import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Авторизация</CardTitle>
          <CardDescription>
            Всего два поля отделяют Вас от возможности быстро и просто хранить
            файлы.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button>Войти</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
