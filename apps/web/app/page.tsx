'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { MessageList } from '@/components/chat/message-list';
import { PromptInput } from '@/components/chat/prompt-input';

export default function HomePage() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <main className='flex min-h-0 flex-1 flex-col'>
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto bg-background [scrollbar-gutter:stable]'>
        <div className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-2 py-4'>
          <MessageList messages={messages} />
        </div>

        <div className='sticky bottom-0 z-1 bg-background/80 backdrop-blur-lg backdrop-saturate-180 supports-backdrop-filter:bg-background/60'>
          <div className='mx-auto flex w-full max-w-3xl px-2 py-3'>
            <PromptInput
              status={status}
              onSend={(text) => sendMessage({ text })}
              onStop={stop}
              placeholder='Ask anything to start the conversation.'
            />
          </div>
        </div>
      </div>
    </main>
  );
}
