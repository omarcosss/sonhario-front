import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

// Define the props interface for type checking (optional but good practice)
interface MyTextProps {
  children: React.ReactNode; // To accept any valid React child (text, other components)
  style?: object; // To allow custom styles to be passed
  fontSize?: number; // Optional font size prop
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; // Optional fontWeight prop
}

/**
 * MyText is a simple reusable component that renders text.
 * It uses the React Native Text component.
 *
 * @param {MyTextProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the Text component.
 * @param {object} [props.style] - Optional custom styles to apply to the Text component.
 * @returns {JSX.Element} A Text component.
 */
const FText: React.FC<MyTextProps> = ({ children, style, fontSize, fontWeight }) => {
  return (
    <Text
      style={[
        styles.defaultText,
        style,
        fontSize !== undefined ? { fontSize } : undefined,
        fontWeight !== undefined ? { fontWeight } : undefined,
      ]}
    >
      {children}
    </Text>
  );
};

// Default styles for the component
const styles = StyleSheet.create({
  defaultText: {
    fontSize: 14,
    color: Colors.Astronaut[50],
    fontFamily: 'Fustat',
  },
});

// Export the component to make it available for import in other files
export default FText;