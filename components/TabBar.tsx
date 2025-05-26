import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import MoonStars from '@/assets/icons/MoonStars';
import Book from '@/assets/icons/Book';
import Person from '@/assets/icons/Person';
import * as Haptics from 'expo-haptics';


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  // Define the icons without hardcoding the color here
  // The color will be passed dynamically later
  const icons: { [key: string]: (props: { iconColor: string }) => React.ReactNode } = {
    index: (props) => <MoonStars width={32} height={32} iconColor={props.iconColor} />,
    journal: (props) => <Book width={32} height={32} iconColor={props.iconColor} />,
    user: (props) => <Person width={32} height={32} iconColor={props.iconColor} />,
  };

  return (
    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 40, bottom: 0, backgroundColor: Colors.dark.background, borderTopWidth: 1, borderTopColor: Colors.dark.border }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Determine the icon color based on focus state
        const iconFillColor = isFocused ? Colors.dark.tabIconSelected : Colors.dark.tabIconDefault;

        return (
          
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 , display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 5, borderRadius: 50, backgroundColor: isFocused ? Colors.dark.tabItemActive : 'transparent' }}
          >
            {/* Pass the dynamically determined iconFillColor to the icon component */}
            {icons[route.name] ? icons[route.name]({ iconColor: iconFillColor }) : null}
          </PlatformPressable>
        );
      })}
    </View>
  );
}