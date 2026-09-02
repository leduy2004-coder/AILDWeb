import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { AlertDialog, AlertDialogProps } from '@/modules/shared/components';

export const ConfirmModal = NiceModal.create<AlertDialogProps>(
  ({ title, description, onAgree, isHide }) => {
    const modal = useModal();

    function handleCloseModal() {
      modal.remove();
    }

    function handleAgree() {
      modal.remove();
      onAgree?.();
    }

    return (
      <AlertDialog
        title={title}
        description={description}
        onDisagree={handleCloseModal}
        onAgree={handleAgree}
        isHide={isHide}
      />
    );
  },
);
