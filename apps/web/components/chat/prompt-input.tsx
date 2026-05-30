'use client';

import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@demo-chatbot/ui/components/ui/input-group';
import { cn } from '@demo-chatbot/ui/lib/utils';
import { type ComponentProps, type KeyboardEvent, useRef, useState } from 'react';

import { ClearButton } from './clear-button';
import { SendButton } from './send-button';
import { StopButton } from './stop-button';

export type PromptInputStatus = 'ready' | 'submitted' | 'streaming' | 'error';

export interface PromptInputProps extends Omit<ComponentProps<'form'>, 'onSubmit' | 'children'> {
  /**
   * Drives the submit button: idle arrow, spinner, stop square, or retry arrow.
   */
  readonly status?: PromptInputStatus;

  /**
   * Placeholder text for the input. Defaults to 'Ask anything...'.
   */
  readonly placeholder?: string;

  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the form is submitted, i.e. when the user clicks the submit button or presses Enter.
   */
  readonly onSend: (text: string) => void;

  /**
   * Invoked when the user clicks the stop button while status is 'streaming'.
   */
  readonly onStop?: () => void;
}

function PromptInput({
  status = 'ready',
  placeholder = 'Ask me anything...',
  disabled = false,
  onSend,
  onStop,
  className,
  ...formProps
}: PromptInputProps) {
  const [input, setInput] = useState('');
  const [composing, setComposing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = status === 'submitted';
  const isStreaming = status === 'streaming';
  const canSubmit = input.trim().length > 0 && !disabled && !isSubmitting && !isStreaming;
  const canClear = input.length > 0 && !disabled;

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setInput('');
  };

  const clear = () => {
    setInput('');
    textAreaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't submit if some other handler has already prevented this event, e.g. to insert a newline on Shift+Enter.
    if (e.defaultPrevented) {
      return;
    }

    if (e.key !== 'Enter') {
      return;
    }
    // Never submit mid-IME-composition (e.g. while choosing a Japanese candidate).
    if (e.nativeEvent.isComposing || composing) {
      return;
    }
    if (e.shiftKey) {
      return;
    }
    e.preventDefault();

    if (canSubmit) {
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      aria-busy={isSubmitting || isStreaming}
      className={cn('w-full', className)}
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      {...formProps}
    >
      <InputGroup className='rounded-xl border-border bg-card/70 drop-shadow-md transition-shadow duration-300 focus-within:drop-shadow-2xl dark:bg-card/70'>
        <InputGroupTextarea
          ref={textAreaRef}
          name='message'
          data-testid='multimodal-input'
          aria-label='Message'
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          value={input}
          className='text max-h-48 min-h-24 text-sm leading-relaxed'
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          onCompositionStart={() => {
            setComposing(true);
          }}
          onCompositionEnd={() => {
            setComposing(false);
          }}
        />
        <InputGroupAddon align='block-end' className='justify-end'>
          {isStreaming ? (
            <StopButton onClick={onStop} />
          ) : (
            <>
              {canClear && <ClearButton onClick={clear} />}
              <SendButton disabled={!canSubmit} pending={isSubmitting} />
            </>
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

export { PromptInput };
