import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { kladowka } from '@/lib/uploads';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const UploadDialog = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: number;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = async () => {
    if (!fileInputRef) return;
    if (!fileInputRef.current) return;
    if (!fileInputRef.current.files) return;

    const file = fileInputRef.current.files[0];
    const res = await kladowka.upload(projectId, file);

    if (!res.ok) {
      toast({
        title: res.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Успешно загружено!',
    });
    return;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить файл вручную</DialogTitle>
          <DialogDescription>
            Выберите файл для загрузки. Максимальный размер файла - 1 Гб.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Button onClick={handleUpload}>Загрузить</Button>
          <Input type="file" ref={fileInputRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
