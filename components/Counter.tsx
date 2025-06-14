import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import FText from './FText';

interface CounterProps {
  /** The current value of the counter */
  value: number;
  /** Callback function that is called when the value changes */
  onValueChange: (newValue: number) => void;
  /** The minimum value the counter can have (default: 0) */
  minValue?: number;
  /** The maximum value the counter can have (default: Infinity) */
  maxValue?: number;
  /** The amount to increment or decrement by (default: 1) */
  step?: number;
  /** An optional label to display next to the value (e.g., "mg" or "min") */
  label?: string;
  /** Optional styles for the container */
  style?: ViewStyle;
}

const Counter: React.FC<CounterProps> = ({
  value,
  onValueChange,
  minValue = 0,
  maxValue = Infinity,
  step = 1,
  label,
  style,
}) => {

  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= maxValue) {
      onValueChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= minValue) {
      onValueChange(newValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        onPress={handleDecrement} 
        style={styles.button}
        disabled={value <= minValue}
      >
        <Text style={[styles.buttonText, value <= minValue && styles.disabledText]}>−</Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <FText>{value}{label && <FText style={styles.labelText}> {label}</FText>}</FText>
      </View>

      <TouchableOpacity 
        onPress={handleIncrement} 
        style={styles.button}
        disabled={value >= maxValue}
      >
        <Text style={[styles.buttonText, value >= maxValue && styles.disabledText]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    buttonText: {
        color: '#E0E2E8',
        fontSize: 24,
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#4A4E58',
    },
    valueContainer: {
        display: 'flex',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: Colors.Card.Background,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
    },
    labelText: {
        fontSize: 10,
        color: '#A9B0C0',
    },
});

export default Counter;