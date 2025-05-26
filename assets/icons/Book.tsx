import * as React from 'react';
import Svg, { Path, G, Rect, Mask, SvgProps } from 'react-native-svg';

interface BookProps extends SvgProps {
  iconColor?: string;
}

function Book({ iconColor, ...props }: BookProps) {
  return (
    <Svg width={33} height={32} viewBox="0 0 33 32" fill="none" {...props}>
      <Mask
        id="mask0_282_582"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={33}
        height={32}
      >
        <Rect x={0.666748} width={32} height={32} fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0_282_582)">
        <Path
          d="M8.82083 28.6666C7.85216 28.6666 7.02872 28.3301 6.3505 27.657C5.6725 26.9839 5.3335 26.1665 5.3335 25.205V6.82065C5.3335 5.85198 5.6725 5.02854 6.3505 4.35031C7.02872 3.67231 7.85216 3.33331 8.82083 3.33331H23.0772V23.7436H8.82083C8.40883 23.7436 8.05794 23.8834 7.76816 24.163C7.47838 24.4428 7.3335 24.7894 7.3335 25.203C7.3335 25.6163 7.47838 25.9636 7.76816 26.245C8.05794 26.5261 8.40883 26.6666 8.82083 26.6666H26.0002V5.99998H28.0002V28.6666H8.82083ZM12.2565 21.7436H21.0772V5.33331H12.2565V21.7436ZM10.2565 21.7436V5.33331H8.82083C8.39927 5.33331 8.04605 5.4782 7.76116 5.76798C7.47605 6.05776 7.3335 6.40865 7.3335 6.82065V22.1306C7.56416 22.0213 7.79994 21.9294 8.04083 21.855C8.28172 21.7808 8.54172 21.7436 8.82083 21.7436H10.2565Z"
          fill={iconColor || '#fff'}
        />
      </G>
    </Svg>
  );
}

export default Book;