import { FileFields, FileKl } from '@/lib/validators/files';

const FilesBlock = ({ files }: { files: Array<FileKl> }) => {
  return <div>{files.length}</div>;
};

export default FilesBlock;
