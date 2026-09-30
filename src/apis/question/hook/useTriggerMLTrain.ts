import { useMutation } from '@tanstack/react-query';
import { triggerMLTrain } from '../question.api';

export const useTriggerMLTrain = () => {
  return useMutation({
    mutationFn: () => triggerMLTrain(),
  });
};
