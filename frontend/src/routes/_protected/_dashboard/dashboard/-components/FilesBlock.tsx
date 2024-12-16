import UploadDialog from '@/components/UploadDialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileKl } from '@/lib/validators/files';
import { useParams } from '@tanstack/react-router';
import { Upload } from 'lucide-react';

const FilesBlock = ({ files }: { files: Array<FileKl> }) => {
  const { projectId } = useParams({
    from: '/_protected/_dashboard/dashboard/$projectId',
  });

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl">Загруженные файлы</h3>
          <p className="text-sm font-medium text-neutral-500">
            Всего: {files.length}
          </p>
        </div>
        <UploadDialog projectId={parseInt(projectId)}>
          <Button variant="ghost" className="rounded-full" size="icon">
            <Upload />
          </Button>
        </UploadDialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Размер</TableHead>
            <TableHead className="text-right">Дата создания</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.id}</TableCell>
              <TableCell>{f.name}</TableCell>
              <TableCell className="w-32">{f.mb} Мб.</TableCell>
              <TableCell className="w-48 text-right">
                {Intl.DateTimeFormat('ru-RU').format(new Date(f.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FilesBlock;
