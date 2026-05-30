import { Button } from '@demo-chatbot/ui/components/ui/button';
import { cn } from '@demo-chatbot/ui/lib/utils';
import { ArrowUp, LoaderCircle } from 'lucide-react';

export interface SendButtonProps {
  /**
   * Additional classes merged into the button, e.g. to adjust margin or layout.
   */
  readonly className?: string;

  /**
   * Whether the button is disabled, e.g. when the input is empty.
   */
  readonly disabled?: boolean;

  /**
   * Whether a submission is in flight; shows a spinner instead of the send icon.
   */
  readonly pending?: boolean;
}

export function SendButton({ className, disabled, pending }: SendButtonProps) {
  return (
    <Button
      type={pending ? 'button' : 'submit'}
      size='icon-sm'
      aria-label='Send message'
      data-testid='send-button'
      disabled={disabled || pending}
      className={cn(
        'size-7 rounded-full hover:bg-primary/80',
        // Pending is a busy state, not an inactive one: keep the button fully opaque
        // (primary bg + foreground spinner) so the loader stays clearly visible. It is
        // still disabled to block re-submit. Only the empty/disabled state is muted.
        pending
          ? 'disabled:opacity-100'
          : 'disabled:pointer-events-auto disabled:bg-muted disabled:text-muted-foreground/25 disabled:opacity-100',
        className,
      )}
    >
      {pending ? <LoaderCircle className='size-4 animate-spin stroke-2' /> : <ArrowUp className='size-4 stroke-2' />}
    </Button>
  );
}
