// PlanEditorV2 — thin wrapper for standalone embedding.
// The full Director's Console experience lives in ReadyViewV2.
import React from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import ReadyViewV2 from '@/components/Studio/VisionCreator/ReadyView/ReadyView';
import { Wrap } from './styles';

interface Props {
  originalPlan: VisionPlan;
  onUpdate: (uuid: string, props: Record<string, any>) => Promise<boolean>;
  onExecute: (uuid: string, version?: number) => Promise<boolean>;
  isUpdating: boolean;
  isExecuting: boolean;
}

const PlanEditorV2: React.FC<Props> = ({ originalPlan, onUpdate, onExecute, isUpdating, isExecuting }) => {
  return (
    <Wrap>
      <ReadyViewV2
        plan={originalPlan}
        updatePlan={onUpdate}
        executePlan={onExecute}
        isUpdating={isUpdating}
        isExecuting={isExecuting}
        apiError={null}
        promptBoxSlot={null}
        onRequestDelete={() => {}}
      />
    </Wrap>
  );
};

export default PlanEditorV2;
