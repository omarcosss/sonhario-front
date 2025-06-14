import * as React from 'react';
import Svg, { G, Mask, Path, Rect, SvgProps } from 'react-native-svg';

// Define the possible directions for the chevron
type ChevronDirection = 'up' | 'down' | 'left' | 'right';

interface ChevronProps extends SvgProps {
  iconColor?: string;
  /**
   * Specifies the direction the chevron points.
   * @default 'left'
   */
  direction?: ChevronDirection;
}

function Chevron({ iconColor, direction = 'left', ...props }: ChevronProps) {
  // Determine the rotation angle based on the direction prop
  const getRotation = () => {
    switch (direction) {
      case 'up':
        return 90;
      case 'right':
        return 180;
      case 'down':
        return 270;
      case 'left':
      default:
        return 0;
    }
  };

  return (
    <Svg width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
      <Mask
        id="mask0_955_61"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={24}
        height={25}
      >
        <Rect y={0.5} width={24} height={24} fill="#D9D9D9" />
      </Mask>
      {/* The G element is rotated around its center based on the direction prop */}
      <G
        mask="url(#mask0_955_61)"
        rotation={getRotation()}
        originX="12"
        originY="12.5"
      >
        <Path
          d="M14 18.5L8 12.5L14 6.5L15.4 7.9L10.8 12.5L15.4 17.1L14 18.5Z"
          fill={iconColor || '#CAD9F3'}
        />
      </G>
    </Svg>
  );
}

export default Chevron;