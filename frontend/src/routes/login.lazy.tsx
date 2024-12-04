import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@tanstack/react-form';

import { Link, createLazyFileRoute, redirect } from '@tanstack/react-router';
import { Eye, EyeClosed, LoaderCircle, LogIn } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { UserFields } from '@/lib/validators/user';

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const schema = z.object({
        email: UserFields.email,
        password: UserFields.password,
      });
      const { error, success, data } = schema.safeParse(value);
      if (!success) {
        toast({
          title: 'Форма заполнена неправильно!',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }

      const res = await axios.post('/api/auth/login', data);

      if (res.status !== 200) {
        toast({
          title: 'Ошибка!',
          description: res.data.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Вы успешно авторизованы!',
        variant: 'good',
      });

      redirect({
        to: '/dashboard',
      });
    },
  });

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-stone-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Авторизация</CardTitle>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent>
            <form.Field name="email">
              {(field) => (
                <div>
                  <Label className="font-medium">Электронная почта</Label>
                  <Input
                    required
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    placeholder="Электронная почта"
                    disabled={form.state.isSubmitting}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <div>
                  <Label className="font-medium">Пароль</Label>
                  <div className="flex items-center gap-x-1">
                    <Input
                      required
                      name={field.name}
                      placeholder="Пароль"
                      type={passwordInputType}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      disabled={form.state.isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Button
                      type="button"
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
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Войти
            </Button>
            <Button
              disabled={form.state.isSubmitting}
              type="button"
              variant="link"
              asChild
            >
              <Link to="/register">У меня нет аккаунта</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
