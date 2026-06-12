'use client';

import { type UUID, uuid } from '@demo-chatbot/core';
import { useState } from 'react';

import { MessageList } from '@/components/chat/message-list';
import { PromptInput } from '@/components/chat/prompt-input';
import { useChatSession } from '@/hooks/use-chat-session';

export interface PanelProps {
  /**
   * Identifies the conversation. Omitted for a fresh chat, in which case a new
   * id is minted client-side.
   */
  readonly id?: UUID;
}

function Panel({ id }: PanelProps) {
  // Mint an id up front for a fresh chat so persistence and the eventual
  // /chat/[id] URL agree on the same key. useState keeps it stable across renders.
  const [mintedId] = useState(uuid);
  const chatId = id ?? mintedId;
  const isNewChat = id === undefined;

  const { messages, sendMessage, status, stop } = useChatSession({ id: chatId });

  const handleSend = (text: string) => {
    // Reflect a fresh chat in the URL without a remount, so a reload restores it.
    // replaceState (vs. router navigation) keeps the useChat state intact.
    if (isNewChat) {
      window.history.replaceState(null, '', `/chat/${chatId}`);
    }
    sendMessage({ text });
  };

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
              onSend={handleSend}
              onStop={stop}
              placeholder='Ask anything to start the conversation.'
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export { Panel };
