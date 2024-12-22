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
import { kladowka } from '@/lib/uploads';
import { FileKl } from '@/lib/validators/files';
import { useParams } from '@tanstack/react-router';
import { Download, Upload } from 'lucide-react';

const FilesBlock = ({ files }: { files: Array<FileKl> }) => {
  const { projectId } = useParams({
    from: '/_protected/_dashboard/dashboard/$projectId',
  });

  const handleFileRequest = async (fileId: number) => {
    const res = await kladowka.getSignedUrl(fileId);
    if (res.ok) {
      const url = `http://localhost:8080/api/signed/${res.alias}`;
      window.location.href = url;
    }
  };

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
            <TableHead>Дата создания</TableHead>
            <TableHead className="text-right">Скачать</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.id}</TableCell>
              <TableCell>{f.name}</TableCell>
              <TableCell className="w-32">{f.mb} Мб.</TableCell>
              <TableCell className="w-48">
                {Intl.DateTimeFormat('ru-RU').format(new Date(f.createdAt))}
              </TableCell>
              <TableCell className="w-16 justify-end text-right">
                <Button
                  size="icon"
                  onClick={() => handleFileRequest(f.id)}
                  variant="ghost"
                  className="size-8 rounded-full hover:bg-neutral-400 hover:text-white"
                >
                  <Download />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FilesBlock;
