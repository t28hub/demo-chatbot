import { Github } from '@demo-chatbot/ui/components/icons/github';
import { Button } from '@demo-chatbot/ui/components/ui/button';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className='sticky top-0 z-50 flex h-14 items-center gap-2 border-b bg-background px-3'>
      <Button type='button' variant='ghost' size='icon-sm' aria-label='Toggle sidebar'>
        <PanelLeft className='stroke-1' />
      </Button>

      <Link href='/' className='flex items-center gap-2 font-semibold text-foreground' aria-label='Demo Chatbot Home'>
        <span className='hidden sm:inline'>Demo Chatbot</span>
      </Link>

      <Button
        variant='ghost'
        size='icon-sm'
        className='ml-auto'
        nativeButton={false}
        render={
          // biome-ignore lint/a11y/useAnchorContent: icon child is merged into the rendered <a> by Base UI's render prop
          <a
            href='https://github.com/t28hub/demo-chatbot'
            target='_blank'
            rel='noopener noreferrer'
            title='View on GitHub'
            aria-label='View on GitHub'
          />
        }
      >
        <Github />
      </Button>
    </header>
  );
}
