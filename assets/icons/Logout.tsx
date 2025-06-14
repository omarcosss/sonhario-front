import React from 'react';
import { Svg, Path } from 'react-native-svg';

const IconLogout = (props: { width?: number; height?: number; color?: string }) => {
  const { width = 24, height = 24, color = '#1f1f1f' } = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 -960 960 960"
      fill="none"
    >
      <Path
        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
        fill={color}
      />
    </Svg>
  );
};

export default IconLogout;