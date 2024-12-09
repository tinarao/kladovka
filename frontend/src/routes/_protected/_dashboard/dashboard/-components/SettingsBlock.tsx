import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ClipboardPlus, ClipboardX, Key } from 'lucide-react';
import { useEffect, useState } from 'react';

const SettingsBlock = ({
  token,
  publicKey,
}: {
  token: string;
  publicKey: string;
}) => {
  const [isTokenCopied, setIsTokenCopied] = useState(false);

  const copyToken = async () => {
    await navigator.clipboard.writeText(token).then((v) => {
      toast({ title: 'Скопировано!' });
      setIsTokenCopied(true);

      setTimeout(() => {
        setIsTokenCopied(false);
      }, 5000);
    });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h3 className="text-2xl font-medium">Ключи</h3>
        <Button
          className={
            isTokenCopied
              ? 'bg-green-500 text-white hover:bg-green-500 hover:text-white'
              : ''
          }
          onClick={copyToken}
          variant="ghost"
        >
          {isTokenCopied ? <ClipboardPlus /> : <Key />}
          Скопировано!
        </Button>
      </div>
      <div>
        <h3 className="text-2xl font-medium">Опасные действия</h3>
        <div className="flex justify-between rounded-md bg-red-50 px-4 py-2">
          <div>
            <h6 className="font-medium text-red-500">Удаление проекта</h6>
            <p className="text-xs font-medium text-red-700">
              Удалить проект и все связанные с ним файлы. Это действие нельзя
              отменить!
            </p>
          </div>
          <Button variant="destructive">Удалить</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsBlock;
