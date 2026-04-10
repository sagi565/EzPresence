import React from 'react';
import { BgOrb, OrbitsWrap, OrbitRing, OrbitDot } from './styles';

const VisionBackground: React.FC = () => {
  return (
    <>
      <BgOrb $s={550} $x="-10%" $y="-18%" $c="rgba(139,92,246,1)" $op={.04}/>
      <BgOrb $s={380} $x="70%"  $y="50%"  $c="rgba(109,40,217,1)" $op={.03} $delay="3s"/>
      <OrbitsWrap>
        <OrbitRing $size={300}/><OrbitRing $size={450}/><OrbitRing $size={600}/><OrbitRing $size={750}/>
        <OrbitDot $r={150} $dur="20s" $delay="0s"   $size={5}/>
        <OrbitDot $r={225} $dur="22s" $delay="-5s"  $size={4}/>
        <OrbitDot $r={225} $dur="28s" $delay="-15s" $size={3}/>
        <OrbitDot $r={300} $dur="35s" $delay="-12s" $size={6}/>
        <OrbitDot $r={375} $dur="28s" $delay="-15s" $size={3}/>
        <OrbitDot $r={375} $dur="18s" $delay="-15s" $size={4}/>
      </OrbitsWrap>
    </>
  );
};

export default VisionBackground;
