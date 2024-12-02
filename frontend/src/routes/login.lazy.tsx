import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { createLazyFileRoute } from '@tanstack/react-router';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password');

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Авторизация</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="font-medium">Электронная почта</Label>
            <Input placeholder="Электронная почта" />
          </div>
          <div>
            <Label className="font-medium">Пароль</Label>
            <div className="flex items-center gap-x-1">
              <Input type={passwordInputType} placeholder="Электронная почта" />
              <Button
                onClick={() => {
                  if (passwordInputType === 'password') {
                    setPasswordInputType('text');
                    return;
                  }

                  setPasswordInputType('password');
                }}
                size="icon"
                variant="ghost"
              >
                {passwordInputType === 'password' ? (
                  <EyeClosed className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button>Войти</Button>
          <Button variant="link">Зарегистрироваться</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
