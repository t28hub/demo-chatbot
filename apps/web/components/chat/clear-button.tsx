import { Button } from '@demo-chatbot/ui/components/ui/button';
import { cn } from '@demo-chatbot/ui/lib/utils';
import { X } from 'lucide-react';

export interface ClearButtonProps {
  /**
   * Additional classes merged into the button, e.g. to adjust margin or layout.
   */
  readonly className?: string;

  /**
   * Whether the button is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Invoked when the button is clicked to clear the input.
   */
  readonly onClick: () => void;
}

export function ClearButton({ className, disabled, onClick }: ClearButtonProps) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon-sm'
      aria-label='Clear message'
      data-testid='clear-button'
      disabled={disabled}
      className={cn('size-7 rounded-full text-muted-foreground', className)}
      onClick={onClick}
    >
      <X className='size-4 stroke-1.5' />
    </Button>
  );
}
