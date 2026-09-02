import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { AlertDialog, AlertDialogProps } from '@/modules/shared/components';
import { t } from 'i18next';

interface DeleteConfirmModalProps extends AlertDialogProps {
  moduleName?: string;
}

export const DeleteConfirmModal = NiceModal.create<DeleteConfirmModalProps>(
  ({ onAgree, moduleName }) => {
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
        title={`${t('common.popup_confirm.delete.title')}`}
        description={`${t('common.popup_confirm.delete.content', { moduleName: moduleName || '' })}`}
        onDisagree={handleCloseModal}
        onAgree={handleAgree}
      />
    );
  },
);
