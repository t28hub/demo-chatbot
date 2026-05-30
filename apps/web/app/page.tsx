'use client';

import { cn } from '@demo-chatbot/ui/lib/utils';
import { useRef, useState } from 'react';

import { PromptInput, type PromptInputStatus } from '@/components/chat/prompt-input';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<PromptInputStatus>('ready');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  };

  // Stand-in for a real chat backend: echoes the message and walks the prompt input
  // through submitted -> streaming -> ready so the send/stop states are demoable.
  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }]);
    setStatus('submitted');
    timers.current.push(
      setTimeout(() => {
        setStatus('streaming');
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: 'This is a simulated reply.' },
        ]);
        timers.current.push(setTimeout(() => setStatus('ready'), 1000));
      }, 500),
    );
  };

  const handleStop = () => {
    clearTimers();
    setStatus('ready');
  };

  return (
    <main className='flex min-h-0 flex-1 flex-col'>
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto bg-background [scrollbar-gutter:stable]'>
        <div className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-2 py-4'>
          {messages.length === 0 ? (
            <p className='text-center text-muted-foreground text-sm'>Ask anything to start the conversation.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                  message.role === 'user'
                    ? 'self-end bg-primary text-primary-foreground'
                    : 'self-start bg-muted text-foreground',
                )}
              >
                {message.text}
              </div>
            ))
          )}
        </div>

        <div className='sticky bottom-0 z-1 bg-background/80 backdrop-blur-lg backdrop-saturate-180 supports-backdrop-filter:bg-background/60'>
          <div className='mx-auto flex w-full max-w-3xl px-2 py-3'>
            <PromptInput
              status={status}
              onSend={handleSend}
              onStop={handleStop}
              placeholder={'Ask anything to start the conversation.'}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
