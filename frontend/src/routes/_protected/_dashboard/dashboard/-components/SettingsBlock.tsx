import ClickToCopyButton from '@/components/ClickToCopyButton';
import { Button } from '@/components/ui/button';
import { GlobeLock, Key } from 'lucide-react';

const SettingsBlock = ({
  token,
  publicKey,
}: {
  token: string;
  publicKey: string;
}) => {
  const code = `import { KL_TOKEN, KL_KEY } from "@/lib/kladovka"

export async function handleUpload(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload', {
    body: formData,
    headers: {
      kl_token: 'KL_TOKEN',
      kl_key: 'KL_KEY',
    },
  });
}`;

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-2xl font-medium">Ключи</h3>
          <div className="grid gap-y-1">
            <ClickToCopyButton dataToCopy={token}>
              <Key /> Токен
            </ClickToCopyButton>
            <ClickToCopyButton dataToCopy={publicKey}>
              <GlobeLock /> Ключ
            </ClickToCopyButton>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-medium">Пример использования</h3>
          <div>
            <span>Upload.ts</span>
            <pre className="code rounded-sm bg-neutral-800 p-2 text-white">
              {code}
            </pre>
          </div>
        </div>
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
