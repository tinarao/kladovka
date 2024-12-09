import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { useState } from 'react';
import { ClipboardPlus, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTCBProps {
  children: React.ReactNode;
  dataToCopy: string;
}

const ClickToCopyButton = ({ children, dataToCopy }: CTCBProps) => {
  const [isTokenCopied, setIsTokenCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dataToCopy).then((v) => {
      toast({ title: 'Скопировано!' });
      setIsTokenCopied(true);

      setTimeout(() => {
        setIsTokenCopied(false);
      }, 5000);
    });
  };

  return (
    <Button
      variant="outline"
      className={cn(
        'w-56 justify-start',
        isTokenCopied
          ? 'bg-green-500 text-white hover:bg-green-500 hover:text-white'
          : '',
      )}
      onClick={handleCopy}
    >
      {isTokenCopied ? (
        <>
          <ClipboardPlus /> Скопировано!
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default ClickToCopyButton;
