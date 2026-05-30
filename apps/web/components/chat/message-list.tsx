'use client';

import { cn } from '@demo-chatbot/ui/lib/utils';
import type { UIMessage } from 'ai';

export interface MessageListProps {
  readonly messages: UIMessage[];
}

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <p className='text-center text-muted-foreground text-sm'>Ask anything to start the conversation.</p>;
  }

  return messages.map((message) => (
    <div
      key={message.id}
      className={cn(
        'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm',
        message.role === 'user' ? 'self-end bg-primary text-primary-foreground' : 'self-start bg-muted text-foreground',
      )}
    >
      {message.parts.map((part, index) =>
        part.type === 'text' ? <span key={`${message.id}-${index}`}>{part.text}</span> : null,
      )}
    </div>
  ));
}

export { MessageList };
