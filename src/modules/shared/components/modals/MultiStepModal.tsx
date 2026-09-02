import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useMemo, useState } from 'react';
import { AlertDialog } from '@/modules/shared/components';

interface ConfirmStep {
  title: string;
  description: string;
}

interface MultiStepModalProps {
  steps: ConfirmStep[];
  buttonAgree?: string;
  buttonDisagree?: string;
  onAgree?: () => void;
}

export const MultiStepModal = NiceModal.create<MultiStepModalProps>(
  ({ steps, onAgree: onAgree }) => {

    const modal = useModal();
    const validSteps = useMemo(
      () =>
        steps.filter(
          step =>
            step.title?.trim() !== '' ||
            step.description?.trim() !== ''
        ),
      [steps]
    );

    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = currentStep === validSteps.length - 1;

    function handleAgree() {
      if (!isLastStep) {
        setCurrentStep(prev => prev + 1);
        return;
      }

      modal.remove();
      onAgree?.();
    }

    function handleCloseModal() {
      modal.remove();
    }

    const { title, description } = validSteps[currentStep];

    return (
      <AlertDialog
        title={title}
        isBreakClose={true}
        description={description}
        onDisagree={handleCloseModal}
        onAgree={handleAgree}
      />
    );
  }
);