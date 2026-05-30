import { Button } from '@demo-chatbot/ui/components/ui/button';
import { cn } from '@demo-chatbot/ui/lib/utils';
import { Square } from 'lucide-react';

export interface StopButtonProps {
  /**
   * Additional classes merged into the button, e.g. to adjust margin or layout.
   */
  readonly className?: string;

  /**
   * Whether the button is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the button is clicked, e.g. to stop a streaming response.
   */
  readonly onClick?: (() => void) | undefined;
}

export function StopButton({ className, disabled, onClick }: StopButtonProps) {
  return (
    <Button
      type='button'
      size='icon-sm'
      aria-label='Stop'
      data-testid='stop-button'
      disabled={disabled}
      className={cn('size-7 rounded-full hover:bg-primary/80', className)}
      onClick={onClick}
    >
      <Square className='size-4 fill-current' />
    </Button>
  );
}
