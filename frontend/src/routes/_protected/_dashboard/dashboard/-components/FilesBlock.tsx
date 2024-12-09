import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileKl } from '@/lib/validators/files';

const FilesBlock = ({ files }: { files: Array<FileKl> }) => {
  return (
    <>
      <h3>Всего: {files.length}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead className="text-right">Дата создания</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.id}</TableCell>
              <TableCell>{f.name}</TableCell>
              <TableCell className="text-right">
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
