import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ClipboardPlus, ClipboardX, Key } from 'lucide-react';
import { useEffect, useState } from 'react';

const SettingsBlock = ({ token }: { token: string }) => {
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
  );
};

export default SettingsBlock;
