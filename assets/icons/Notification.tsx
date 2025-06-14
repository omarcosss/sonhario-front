import React from 'react';
import { Svg, Path } from 'react-native-svg';

const IconNotification = (props: { width?: number; height?: number; color?: string }) => {
  const { width = 24, height = 24, color = '#1f1f1f' } = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 -960 960 960"
      fill="none"
    >
      <Path
        d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"
        fill={color}
      />
    </Svg>
  );
};

export default IconNotification;
