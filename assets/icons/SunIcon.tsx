import * as React from 'react';
import Svg, { Path, G, Rect, Mask, SvgProps, Defs } from 'react-native-svg'; // Added Defs for completeness

interface SunIconProps extends SvgProps {
  iconColor?: string;
}

function SunIcon({ iconColor, ...props }: SunIconProps) {
  const defaultIconColor = '#FFFEE7'; // Default color from the original SVG

  return (
    <Svg width={71} height={71} viewBox="0 0 71 71" fill="none" {...props}>
      {/*
        The style prop with maskType on Mask is not standard for react-native-svg.
        Mask behavior is usually determined by its content (e.g., luminance of colors or alpha).
        react-native-svg generally treats <Rect> with a fill inside a <Mask> as an alpha mask.
        Including it here to match the provided MoonStars style, but it might not have the intended effect
        or could be removed if not specifically required by a particular react-native-svg version/behavior.
      */}
      <Mask
        id="mask0_sun_icon" // Unique ID for this mask
        style={{ maskType: 'alpha' } as any} // Casting to any to suppress potential TypeScript error for non-standard style prop
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={71}
        height={71}
      >
        <Rect x="0.5" y="0.916107" width="70" height="70" fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0_sun_icon)">
        <Path
          d="M32.5833 15.4994V3.83277H38.4167V15.4994H32.5833ZM51.9792 23.5203L47.9687 19.5099L56.1354 11.1244L60.2187 15.2807L51.9792 23.5203ZM55.9167 38.8328V32.9994H67.5833V38.8328H55.9167ZM32.5833 67.9994V56.3328H38.4167V67.9994H32.5833ZM19.0208 23.3744L10.7083 15.2807L14.8646 11.1974L23.1042 19.4369L19.0208 23.3744ZM56.0625 60.7078L47.9687 52.3224L51.9062 48.3849L60.2187 56.4057L56.0625 60.7078ZM3.41666 38.8328V32.9994H15.0833V38.8328H3.41666ZM14.8646 60.7078L10.7812 56.5515L18.9479 48.3849L21.0625 50.3536L23.1771 52.3953L14.8646 60.7078ZM35.5 53.4161C30.6389 53.4161 26.5069 51.7147 23.1042 48.3119C19.7014 44.9092 18 40.7772 18 35.9161C18 31.055 19.7014 26.923 23.1042 23.5203C26.5069 20.1175 30.6389 18.4161 35.5 18.4161C40.3611 18.4161 44.493 20.1175 47.8958 23.5203C51.2986 26.923 53 31.055 53 35.9161C53 40.7772 51.2986 44.9092 47.8958 48.3119C44.493 51.7147 40.3611 53.4161 35.5 53.4161ZM35.5 47.5828C38.7083 47.5828 41.4548 46.4404 43.7396 44.1557C46.0243 41.871 47.1667 39.1244 47.1667 35.9161C47.1667 32.7078 46.0243 29.9612 43.7396 27.6765C41.4548 25.3918 38.7083 24.2494 35.5 24.2494C32.2917 24.2494 29.5451 25.3918 27.2604 27.6765C24.9757 29.9612 23.8333 32.7078 23.8333 35.9161C23.8333 39.1244 24.9757 41.871 27.2604 44.1557C29.5451 46.4404 32.2917 47.5828 35.5 47.5828Z"
          fill={iconColor || defaultIconColor}
        />
      </G>
    </Svg>
  );
}

export default SunIcon;