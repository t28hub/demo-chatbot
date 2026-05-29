import { Button } from '@demo-chatbot/ui/components/ui/button';

export default function HomePage() {
  return (
    <main className='flex flex-1 flex-col items-center justify-center gap-6 p-8'>
      <h1 className='font-bold text-3xl'>demo chatbot</h1>
      <p className='text-muted-foreground'>Welcome to the demo chatbot app.</p>
      <div className='flex flex-wrap items-center gap-3'>
        <Button>Default</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='destructive'>Destructive</Button>
        <Button variant='link'>Link</Button>
      </div>
    </main>
  );
}
