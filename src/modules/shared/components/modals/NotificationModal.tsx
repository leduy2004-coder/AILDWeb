import NiceModal, { useModal } from '@ebay/nice-modal-react';

import {
  NotificationDialog,
  NotificationDialogProps,
} from '@/modules/shared/components';

export const NotificationModal = NiceModal.create<NotificationDialogProps>(
  ({ title, description, onAgree }) => {
    const modal = useModal();

    function handleAgree() {
      modal.remove();
      onAgree?.();
    }

    return (
      <NotificationDialog
        title={title}
        description={description}
        onAgree={handleAgree}
      />
    );
  },
);
