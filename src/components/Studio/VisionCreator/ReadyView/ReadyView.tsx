import React from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import PlanEditor from '@pages/Studio/components/PlanEditor';
import { Banner } from '@pages/Studio/VisionPage/styles';
import { ReadyWrapper, FloatingBar, FloatingInner } from './styles';

interface ReadyViewProps {
  plan: VisionPlan;
  updatePlan: (uuid: string, props: Record<string, any>) => Promise<boolean>;
  executePlan: (uuid: string, version?: number) => Promise<boolean>;
  isUpdating: boolean;
  isExecuting: boolean;
  apiError: string | null;
  promptBoxSlot: React.ReactNode;
  onRequestDelete: () => void;
}

const ReadyView: React.FC<ReadyViewProps> = ({
  plan, updatePlan, executePlan, isUpdating, isExecuting, apiError,
  promptBoxSlot, onRequestDelete,
}) => {
  return (
    <>
      <ReadyWrapper>
        <PlanEditor
          originalPlan={plan}
          onUpdate={updatePlan}
          onExecute={executePlan}
          isUpdating={isUpdating}
          isExecuting={isExecuting}
          onRequestDelete={onRequestDelete}
        />
        {apiError && (
          <Banner $ok={false} style={{ marginTop: 12 }}>⚠️ {apiError}</Banner>
        )}
      </ReadyWrapper>

      <FloatingBar>
        <FloatingInner>
          {promptBoxSlot}
        </FloatingInner>
      </FloatingBar>
    </>
  );
};

export default ReadyView;
