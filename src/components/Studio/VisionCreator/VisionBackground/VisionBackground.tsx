import React from 'react';
import { useAppTheme } from '@theme/ThemeContext';
import { BgOrb, OrbitsWrap, OrbitRing, OrbitDot } from './styles';

const VisionBackground: React.FC = () => {
  const { isDarkMode } = useAppTheme();

  return (
    <>
      <BgOrb $s={600} $x="-12%" $y="-20%" $c="rgba(139,92,246,1)" $op={isDarkMode ? .08 : .04}/>
      <BgOrb $s={420} $x="68%"  $y="48%"  $c="rgba(109,40,217,1)" $op={isDarkMode ? .06 : .03} $delay="3s"/>
      {isDarkMode && (
        <BgOrb $s={340} $x="30%" $y="75%" $c="rgba(59,130,246,1)" $op={.04} $delay="6s"/>
      )}
      {!isDarkMode && (
        <OrbitsWrap>
          <OrbitRing $size={300}/><OrbitRing $size={450}/><OrbitRing $size={600}/><OrbitRing $size={750}/>
          <OrbitDot $r={150} $dur="20s" $delay="0s"   $size={5}/>
          <OrbitDot $r={225} $dur="22s" $delay="-5s"  $size={4}/>
          <OrbitDot $r={225} $dur="28s" $delay="-15s" $size={3}/>
          <OrbitDot $r={300} $dur="35s" $delay="-12s" $size={6}/>
          <OrbitDot $r={375} $dur="28s" $delay="-15s" $size={3}/>
          <OrbitDot $r={375} $dur="18s" $delay="-15s" $size={4}/>
        </OrbitsWrap>
      )}
    </>
  );
};

export default VisionBackground;
