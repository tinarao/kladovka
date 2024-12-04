import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import DashboardTopPanel from '@/components/DashboardTopPanel';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserFields } from '@/lib/validators/user';
import { ProjectFields } from '@/lib/validators/projects';
import { ZodError } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Save } from 'lucide-react';

export const Route = createLazyFileRoute(
  '/_protected/_dashboard/dashboard/create-project',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { setOpen } = useSidebar();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: ({ value }) => {
      try {
        ProjectFields.name.parse(value.name);
        toast({
          title: 'Успешно!',
          description: `Проект ${value.name} успешно создан!`,
          variant: 'good',
        });
      } catch (error) {
        const err = error as ZodError;
        toast({
          title: 'Ошибка формы',
          description: err.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    },
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Создать проект</CardTitle>
          <CardDescription>
            Создайте проект, чтобы начать загружать файлы. Изменить лимит и
            прочие настройки проекта можно будет после создания.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent>
            <form.Field name="name">
              {(field) => (
                <div>
                  <Label>Название проекта</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="клауд-кладовка"
                    disabled={form.state.isSubmitting}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
          <CardFooter className="justify-between">
            <Button disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? (
                <LoaderCircle className="size-2 animate-spin" />
              ) : (
                <Save className="size-2" />
              )}
              Создать
            </Button>
            <Button disabled={form.state.isSubmitting} variant="destructive">
              Отмена
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
