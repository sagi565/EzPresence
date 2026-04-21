import React from 'react';

interface PolicyRepeatIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PolicyRepeatIcon: React.FC<PolicyRepeatIconProps> = ({ 
  size = 14, 
  color = "black", 
  className,
  style 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, display: 'block' }}
    >
      {/* Upper arrow */}
      <path 
        d="M17 2L21 6L17 10" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3 12V10C3 7.79086 4.79086 6 7 6H21" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Lower arrow */}
      <path 
        d="M7 22L3 18L7 14" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M21 12V14C21 16.2091 19.2091 18 17 18H3" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PolicyRepeatIcon;
