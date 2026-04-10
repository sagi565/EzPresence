import React, { useState, useEffect } from 'react';
import PlanningCanvas from '../PlanningCanvas/PlanningCanvas';
import {
  PlanningOverlay, PlanningInner, PlanningTitle, PlanningTextWrap,
  PlanningTextLine, PlanningDots, PlanningDot,
  ElapsedLabel,
} from './styles';

const PLANNING_MESSAGES = [
  'Analyzing your prompt…',
  'Crafting scene structure…',
  'Planning visual sequences…',
  'Defining music & voice…',
  'Building your vision plan…',
];

const MSG_DURATION  = 3000; // ms each message is fully visible
const FADE_DURATION =  400; // ms fade out / fade in

interface PlanningViewProps {
  isLoading: boolean;
  planElapsed: number;
  planLeaving: boolean;
}

const PlanningView: React.FC<PlanningViewProps> = ({ isLoading, planElapsed, planLeaving }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % PLANNING_MESSAGES.length);
        setVisible(true);
      }, FADE_DURATION);
    }, MSG_DURATION + FADE_DURATION);

    return () => clearInterval(cycle);
  }, []);

  return (
    <PlanningOverlay $leaving={planLeaving}>
      <PlanningCanvas />

      <PlanningInner>
        <PlanningTitle>{isLoading ? 'Sending your vision…' : 'Building your Vision'}</PlanningTitle>
        <PlanningTextWrap>
          <PlanningTextLine $visible={visible}>
            {PLANNING_MESSAGES[msgIndex]}
          </PlanningTextLine>
        </PlanningTextWrap>
        <PlanningDots>
          <PlanningDot $delay="0s" />
          <PlanningDot $delay=".25s" />
          <PlanningDot $delay=".5s" />
        </PlanningDots>
        <ElapsedLabel>
          {isLoading ? 'contacting server…' : `${planElapsed}s elapsed`}
        </ElapsedLabel>
      </PlanningInner>
    </PlanningOverlay>
  );
};

export default PlanningView;
