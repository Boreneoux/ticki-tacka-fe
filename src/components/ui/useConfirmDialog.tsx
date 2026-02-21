import * as React from 'react';

import ConfirmDialog from './ConfirmDialog';
import type { ConfirmDialogVariant } from './ConfirmDialog';

function useConfirmDialog() {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm: () => void | Promise<void>;
    variant?: ConfirmDialogVariant;
  }>({
    isOpen: false,
    title: '',
    onConfirm: () => {}
  });

  const confirm = React.useCallback((options: Omit<typeof state, 'isOpen'>) => {
    return new Promise<boolean>(resolve => {
      setState({
        ...options,
        isOpen: true,
        onConfirm: async () => {
          await options.onConfirm();
          resolve(true);
        }
      });
    });
  }, []);

  const dialog = (
    <ConfirmDialog
      open={state.isOpen}
      onOpenChange={open => setState(prev => ({ ...prev, isOpen: open }))}
      title={state.title}
      description={state.description}
      variant={state.variant}
      onConfirm={state.onConfirm}
      onCancel={() => setState(prev => ({ ...prev, isOpen: false }))}
    />
  );

  return { confirm, dialog };
}

export { useConfirmDialog };
