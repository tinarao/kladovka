import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Link, createLazyFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectFields } from '@/lib/validators/projects';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Save } from 'lucide-react';
import axios from 'axios';

export const Route = createLazyFileRoute(
  '/_protected/_dashboard/dashboard/create-project',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      const { data, success, error } = ProjectFields.name.safeParse(value.name);
      if (!success) {
        toast({
          title: 'Ошибка формы',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }

      const res = await axios.post('/api/v/projects', { name: data });
      if (res.status !== 201) {
        toast({
          title: 'Ошибка при создании формы',
          description: res.data.message,
          variant: 'destructive',
        });

        return;
      }

      toast({
        title: 'Успешно!',
        description: `Проект ${value.name} успешно создан!`,
        variant: 'good',
      });
      redirect({ to: '/dashboard' });
    },
  });

  return (
    <div className="flex h-full items-center justify-center">
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
            <Button
              type="button"
              disabled={form.state.isSubmitting}
              variant="destructive"
            >
              <Link to="/dashboard">Отмена</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
