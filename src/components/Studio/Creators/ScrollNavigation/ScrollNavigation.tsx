import React, { useState } from 'react';
import { 
  NavContainer, 
  NavItem, 
  DotContainer, 
  Dot, 
  Icon, 
  NavLine, 
  Label 
} from './styles';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Creator {
  id: string;
  name: string;
  icon: string;
}

interface ScrollNavigationProps {
  creators: Creator[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  creators,
  currentIndex,
  onNavigate,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  return (
    <NavContainer $isMobile={isMobile}>
      {creators.map((creator, index) => {
        const isActive = index === currentIndex;
        const isHovered = hoveredIndex === index;

        return (
          <NavItem key={creator.id}>
            {isHovered && !isMobile && (
              <Label $isMobile={isMobile}>{creator.name}</Label>
            )}

            <DotContainer
              onClick={() => onNavigate(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Dot
                $isActive={isActive}
                $isHovered={isHovered}
                $isMobile={isMobile}
              >
                <Icon 
                  $visible={isHovered || isActive}
                  $isMobile={isMobile}
                >
                  {creator.icon}
                </Icon>
              </Dot>
            </DotContainer>

            {index < creators.length - 1 && <NavLine />}
          </NavItem>
        );
      })}
    </NavContainer>
  );
};

export default ScrollNavigation;