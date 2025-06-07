import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import FText from './FText';

// Define types for the Chip component props
interface ChipProps {
    label: string;
    backgroundColor: string;
    borderColor?: string; // Optional border color
    textColor: string;
    onPress?: () => void; // Optional press handler
    style?: ViewStyle; // Optional style for the container
    labelStyle?: TextStyle; // Optional style for the text
}

const Chip: React.FC<ChipProps> = ({ label, backgroundColor, borderColor, textColor, onPress, style, labelStyle }) => {
    return (
        <TouchableOpacity
        style={[styles.chipContainer, { backgroundColor }, {borderWidth:1}, { borderColor }, style]}
        onPress={onPress}
        activeOpacity={0.7} // Visual feedback on press
        >
        <FText style={[styles.chipLabel, { color: textColor }, labelStyle]}>{label}</FText>
        </TouchableOpacity>
    );
};

// Define types for the parent component props
interface QualityChipProps {
    label: string;
    quality: '1' | '2' | '3';
    onPress?: () => void;
}

const QualityChip: React.FC<QualityChipProps> = ({ label, quality, onPress }) => {
    let backgroundColor: string;
    let borderColor: string;
    let textColor: string;

    switch (quality) {
        case '1':
            backgroundColor = Colors.Shamrock[950];
            borderColor = Colors.Shamrock[900];
            textColor = Colors.Shamrock[400];
            break;
        case '2':
            backgroundColor = Colors.Shamrock[950];
            borderColor = Colors.Shamrock[900];
            textColor = Colors.Shamrock[400];
            break;
        case '3':
            backgroundColor = Colors.Shamrock[950];
            borderColor = Colors.Shamrock[900];
            textColor = Colors.Shamrock[400];
            break;
        default:
            backgroundColor = Colors.Shamrock[950];
            borderColor = Colors.Shamrock[900];
            textColor = Colors.Shamrock[400];
            break;
    }
    return (
        <Chip
            label={label}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            textColor={textColor}
            onPress={onPress}
        />
    );
};

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute chips evenly
    alignItems: 'center',
    width: '100%', // Take full width
    paddingHorizontal: 16, // Add some padding on the sides
    backgroundColor: '#4D4D4D', // Background color matching the image (dark grey)
    paddingVertical: 20, // Padding to give space around chips
  },
  chipContainer: {
    borderRadius: 25, // Creates the rounded capsule shape
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginHorizontal: 8, // Space between chips
    // Optional: Add shadow for a more distinct look if desired
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  chipLabel: {
    fontSize: 16,
  },
});

export { Chip, QualityChip };
