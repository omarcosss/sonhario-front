import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Define the props interface for type checking (optional but good practice)
interface MyTextProps {
  children: React.ReactNode; // To accept any valid React child (text, other components)
  style?: object; // To allow custom styles to be passed
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
const FText: React.FC<MyTextProps> = ({ children, style }) => {
  return (
    // The Text component from react-native is used here.
    // It combines the default styles with any custom styles passed via props.
    <Text style={[styles.defaultText, style]}>
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