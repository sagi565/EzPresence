import React from 'react';
import { PlanningGlow, PlanningOrbitRing, PlanningOrbitDot, PlanningRing } from './styles';

const VisionPlanningBackground: React.FC = () => {
  return (
    <>
      <PlanningGlow/>
      <PlanningOrbitRing $size={240}  $dur="12s"  $delay="0s"   $op={.10}/>
      <PlanningOrbitRing $size={380}  $dur="20s"  $delay="-3s"  $op={.08}/>
      <PlanningOrbitRing $size={520}  $dur="32s"  $delay="-8s"  $op={.06}/>
      <PlanningOrbitRing $size={660}  $dur="46s"  $delay="-12s" $op={.04}/>
      <PlanningOrbitRing $size={800}  $dur="60s"  $delay="-5s"  $op={.025}/>
      <PlanningOrbitRing $size={940}  $dur="78s"  $delay="-22s" $op={.015}/>
      <PlanningOrbitDot $r={120} $dur="6s"  $delay="0s"/>
      <PlanningOrbitDot $r={120} $dur="9s"  $delay="-3s"/>
      <PlanningOrbitDot $r={190} $dur="10s" $delay="0s"/>
      <PlanningOrbitDot $r={190} $dur="20s" $delay="-10s"/>
      <PlanningOrbitDot $r={260} $dur="14s" $delay="0s"/>
      <PlanningOrbitDot $r={260} $dur="32s" $delay="-16s"/>
      <PlanningOrbitDot $r={330} $dur="8s"  $delay="0s"/>
      <PlanningOrbitDot $r={330} $dur="46s" $delay="-23s"/>
      <PlanningRing $size={90} $delay="0s"/><PlanningRing $size={90} $delay="1.2s"/>
    </>
  );
};

export default VisionPlanningBackground;
