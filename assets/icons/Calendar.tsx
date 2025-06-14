import React from 'react';
import { Svg, Path } from 'react-native-svg';

const IconCalendar = (props: { width?: number; height?: number; color?: string }) => {
  const { width = 20, height = 22, color = '#D9D9D9' } = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 22"
      fill="none"
    >
      <Path
        d="M2.22222 22C1.61111 22 1.08796 21.7846 0.652778 21.3538C0.217593 20.9229 0 20.405 0 19.8V4.4C0 3.795 0.217593 3.27708 0.652778 2.84625C1.08796 2.41542 1.61111 2.2 2.22222 2.2H3.33333V0H5.55556V2.2H14.4444V0H16.6667V2.2H17.7778C18.3889 2.2 18.912 2.41542 19.3472 2.84625C19.7824 3.27708 20 3.795 20 4.4V19.8C20 20.405 19.7824 20.9229 19.3472 21.3538C18.912 21.7846 18.3889 22 17.7778 22H2.22222ZM2.22222 19.8H17.7778V8.8H2.22222V19.8ZM2.22222 6.6H17.7778V4.4H2.22222V6.6Z"
        fill={color}
      />
    </Svg>
  );
};

export default IconCalendar;
