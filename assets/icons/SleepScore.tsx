import * as React from 'react';
import Svg, { Path, G, Rect, Mask, Defs, Filter, FeGaussianBlur, FeOffset, FeFlood, FeComposite, FeMerge, FeMergeNode, SvgProps } from 'react-native-svg';

interface SleepScoreProps extends SvgProps {
  iconColor?: string; // Optional prop to set the fill color
  // Shadow properties based on the CSS box-shadow
  shadowColor?: string;
  shadowRadius?: number;
}

function SleepScore({
  iconColor,
  shadowColor = '#4767C9', // Default shadow color from your CSS
  shadowRadius = 10,       // Default blur radius (half of 20px for visual similarity)
  ...props
}: SleepScoreProps) {
  // Generate a unique ID for the filter to avoid conflicts if multiple icons are rendered
  const filterId = `sleepscore-shadow-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Defs>
        <Filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          {/* Apply Gaussian blur to the alpha channel of the source graphic */}
          <FeGaussianBlur in="SourceAlpha" stdDeviation={shadowRadius} result="blur" />
          {/* Offset is 0,0 for a glow-like shadow as per your CSS */}
          <FeOffset dx="0" dy="0" result="offsetBlur" />
          {/* Create a solid color layer for the shadow */}
          <FeFlood floodColor={shadowColor} floodOpacity="1" result="floodColor" />
          {/* Composite the flood color with the blurred and offset alpha */}
          <FeComposite in="floodColor" in2="offsetBlur" operator="in" result="shadow" />
          {/* Layer the shadow under the original graphic */}
          <FeMerge>
            <FeMergeNode in="shadow" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
      </Defs>

      <Mask
        id="mask0_563_381"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={32}
        height={32}
      >
        <Rect width={32} height={32} fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0_563_381)" filter={`url(#${filterId})`}> {/* Apply the filter here */}
        <Path
          d="M19.4667 2.13333C22.3409 2.13333 24.7872 3.14255 26.8057 5.161C28.8241 7.17944 29.8333 9.62578 29.8333 12.5H25.9C25.9 11.8111 25.7944 11.1444 25.5833 10.5C25.3722 9.85555 25.0778 9.26666 24.7 8.73333L24.2 9.86667C24.0162 10.214 23.8369 10.5674 23.662 10.927C23.4873 11.2868 23.2555 11.6 22.9667 11.8667C22.5778 12.2444 22.1028 12.4444 21.5417 12.4667C20.9805 12.4889 20.5 12.2889 20.1 11.8667C19.7 11.4444 19.5055 10.9623 19.5167 10.4203C19.5278 9.87811 19.7222 9.40467 20.1 9C20.3747 8.72711 20.6822 8.49222 21.0227 8.29533C21.3631 8.09844 21.7111 7.91111 22.0667 7.73333L23.2 7.23333C22.6667 6.85555 22.0833 6.56666 21.45 6.36666C20.8167 6.16666 20.1555 6.06666 19.4667 6.06666V2.13333ZM16.1037 29.4667C14.2261 29.4667 12.4659 29.1093 10.823 28.3947C9.18032 27.68 7.74532 26.7091 6.51799 25.482C5.29088 24.2547 4.31999 22.8197 3.60533 21.177C2.89066 19.5341 2.53333 17.7739 2.53333 15.8963C2.53333 12.521 3.62221 9.56111 5.79999 7.01666C7.97777 4.47222 10.7333 2.9 14.0667 2.3C13.8889 4.58889 14.0833 6.76666 14.65 8.83333C15.2167 10.9 16.2778 12.7111 17.8333 14.2667C19.3444 15.7778 21.15 16.7944 23.25 17.3167C25.35 17.8389 27.4778 18.0889 29.6333 18.0667C29.1 21.3333 27.5555 24.05 25 26.2167C22.4444 28.3833 19.479 29.4667 16.1037 29.4667ZM16.1 25.5333C17.6555 25.5333 19.1389 25.1778 20.55 24.4667C21.9611 23.7556 23.0889 22.7667 23.9333 21.5C22.2667 21.2556 20.6722 20.75 19.15 19.9833C17.6278 19.2167 16.2555 18.2222 15.0333 17C13.7889 15.7556 12.7889 14.3833 12.0333 12.8833C11.2778 11.3833 10.7555 9.78889 10.4667 8.1C9.24444 9.01111 8.27221 10.152 7.54999 11.5227C6.82777 12.8936 6.46666 14.3527 6.46666 15.9C6.46666 18.5944 7.39866 20.8736 9.26266 22.7373C11.1264 24.6013 13.4055 25.5333 16.1 25.5333Z"
          fill={iconColor || '#CAD9F3'}
        />
      </G>
    </Svg>
  );
}

export default SleepScore;